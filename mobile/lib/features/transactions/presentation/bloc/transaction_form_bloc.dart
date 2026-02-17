import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/transaction_repository.dart';

// Events
abstract class TransactionFormEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class TransactionFormSubmitted extends TransactionFormEvent {
  final int walletId;
  final int? receiverWalletId;
  final String name;
  final double amount;
  final String type;
  final String category;
  final DateTime date;

  TransactionFormSubmitted({
    required this.walletId,
    this.receiverWalletId,
    required this.name,
    required this.amount,
    required this.type,
    required this.category,
    required this.date,
  });

  @override
  List<Object?> get props => [walletId, receiverWalletId, name, amount, type, category, date];
}

// States
abstract class TransactionFormState extends Equatable {
  @override
  List<Object?> get props => [];
}

class TransactionFormInitial extends TransactionFormState {}

class TransactionFormSubmitting extends TransactionFormState {}

class TransactionFormSuccess extends TransactionFormState {}

class TransactionFormFailure extends TransactionFormState {
  final String message;

  TransactionFormFailure(this.message);

  @override
  List<Object?> get props => [message];
}

// Bloc
class TransactionFormBloc extends Bloc<TransactionFormEvent, TransactionFormState> {
  final TransactionRepository _repository;

  TransactionFormBloc(this._repository) : super(TransactionFormInitial()) {
    on<TransactionFormSubmitted>(_onSubmitted);
  }

  Future<void> _onSubmitted(
    TransactionFormSubmitted event,
    Emitter<TransactionFormState> emit,
  ) async {
    emit(TransactionFormSubmitting());
    try {
      await _repository.createTransaction(
        walletId: event.walletId,
        receiverWalletId: event.receiverWalletId,
        name: event.name,
        amount: event.amount,
        type: event.type,
        category: event.category,
        date: event.date,
      );
      emit(TransactionFormSuccess());
    } catch (e) {
      emit(TransactionFormFailure(e.toString()));
    }
  }
}
