import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../data/dashboard_repository.dart';
import '../../domain/models.dart';
import '../../../auth/domain/user_model.dart';
import '../../../auth/data/auth_repository.dart';
import '../../../wallets/domain/wallet_repository.dart';
import '../../../transactions/domain/transaction_repository.dart';
import '../../../../core/data/local_data_source.dart';
import '../../../../core/di/injection_container.dart';

// Events
abstract class DashboardEvent extends Equatable {
  const DashboardEvent();
  @override
  List<Object?> get props => [];
}

class DashboardLoadRequested extends DashboardEvent {}

class WalletDeleted extends DashboardEvent {
  final int id;
  const WalletDeleted(this.id);
  @override
  List<Object?> get props => [id];
}

class TransactionDeleted extends DashboardEvent {
  final int id;
  const TransactionDeleted(this.id);
  @override
  List<Object?> get props => [id];
}

// States
abstract class DashboardState extends Equatable {
  @override
  List<Object?> get props => [];
}

class DashboardInitial extends DashboardState {}

class DashboardLoading extends DashboardState {}

class DashboardLoaded extends DashboardState {
  final User user;
  final List<Wallet> wallets;
  final List<Transaction> recentTransactions;
  final double totalBalance;
  final double totalIncome;
  final double totalExpense;
  final double budgetLeft;
  final double monthlyIncome;

  DashboardLoaded({
    required this.user,
    required this.wallets,
    required this.recentTransactions,
  }) : 
    monthlyIncome = user.monthlyIncome,
    totalBalance = wallets.fold(0.0, (sum, wallet) => sum + wallet.balance), 
    totalIncome = recentTransactions
        .where((t) => t.type == 'income' && t.date.month == DateTime.now().month && t.date.year == DateTime.now().year)
        .fold(0.0, (sum, t) => sum + t.amount),
    totalExpense = recentTransactions
        .where((t) => t.type == 'expense' && t.date.month == DateTime.now().month && t.date.year == DateTime.now().year)
        .fold(0.0, (sum, t) => sum + t.amount),
    budgetLeft = user.monthlyIncome - recentTransactions
        .where((t) => t.type == 'expense' && t.date.month == DateTime.now().month && t.date.year == DateTime.now().year)
        .fold(0.0, (sum, t) => sum + t.amount);

  @override
  List<Object?> get props => [user, wallets, recentTransactions, totalBalance, totalIncome, totalExpense, budgetLeft];
}

class DashboardFailure extends DashboardState {
  final String message;

  DashboardFailure(this.message);

  @override
  List<Object?> get props => [message];
}

// Bloc
class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  final DashboardRepository _repository;

  DashboardBloc(this._repository) : super(DashboardInitial()) {
    on<DashboardLoadRequested>(_onDashboardLoadRequested);
    on<WalletDeleted>(_onWalletDeleted);
    on<TransactionDeleted>(_onTransactionDeleted);
  }

  Future<void> _onWalletDeleted(WalletDeleted event, Emitter<DashboardState> emit) async {
    try {
      await sl<WalletRepository>().deleteWallet(event.id);
      add(DashboardLoadRequested());
    } catch (e) {
      emit(DashboardFailure(e.toString()));
    }
  }

  Future<void> _onTransactionDeleted(TransactionDeleted event, Emitter<DashboardState> emit) async {
    try {
      await sl<TransactionRepository>().deleteTransaction(event.id);
      add(DashboardLoadRequested());
    } catch (e) {
      emit(DashboardFailure(e.toString()));
    }
  }

  Future<void> _onDashboardLoadRequested(
    DashboardLoadRequested event,
    Emitter<DashboardState> emit,
  ) async {
    // 1. Try to load from cache first for instant UI
    try {
      final cachedUser = sl<LocalDataSource>().getCachedUserProfile();
      final cachedWallets = sl<LocalDataSource>().getCachedWallets();
      final cachedTransactions = sl<LocalDataSource>().getCachedTransactions();

      if (cachedUser != null) {
        emit(DashboardLoaded(
          user: cachedUser,
          wallets: cachedWallets,
          recentTransactions: cachedTransactions,
        ));
      } else {
        emit(DashboardLoading());
      }
    } catch (_) {
      emit(DashboardLoading());
    }

    // 2. Fetch fresh data from network
    try {
      final user = await sl<AuthRepository>().getProfile();
      final wallets = await _repository.getWallets();
      final transactions = await _repository.getRecentTransactions();
      
      emit(DashboardLoaded(
        user: user,
        wallets: wallets, 
        recentTransactions: transactions,
      ));
    } catch (e) {
      if (state is! DashboardLoaded) {
        emit(DashboardFailure(e.toString()));
      }
    }
  }
}
