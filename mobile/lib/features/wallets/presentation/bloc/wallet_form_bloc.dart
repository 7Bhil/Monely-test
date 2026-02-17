import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../domain/wallet_repository.dart';

// Events
abstract class WalletFormEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class WalletFormSubmitted extends WalletFormEvent {
  final String name;
  final String type;
  final double balance;
  final String currency;
  final String color;
  final String icon;

  WalletFormSubmitted({
    required this.name,
    required this.type,
    required this.balance,
    required this.currency,
    required this.color,
    required this.icon,
  });

  @override
  List<Object?> get props => [name, type, balance, currency, color, icon];
}

// States
abstract class WalletFormState extends Equatable {
  @override
  List<Object?> get props => [];
}

class WalletFormInitial extends WalletFormState {}

class WalletFormSubmitting extends WalletFormState {}

class WalletFormSuccess extends WalletFormState {}

class WalletFormFailure extends WalletFormState {
  final String message;

  WalletFormFailure(this.message);

  @override
  List<Object?> get props => [message];
}

// Bloc
class WalletFormBloc extends Bloc<WalletFormEvent, WalletFormState> {
  final WalletRepository _repository;

  WalletFormBloc(this._repository) : super(WalletFormInitial()) {
    on<WalletFormSubmitted>(_onSubmitted);
  }

  Future<void> _onSubmitted(
    WalletFormSubmitted event,
    Emitter<WalletFormState> emit,
  ) async {
    emit(WalletFormSubmitting());
    try {
      await _repository.createWallet(
        name: event.name,
        type: event.type,
        balance: event.balance,
        currency: event.currency,
        color: event.color,
        icon: event.icon,
      );
      emit(WalletFormSuccess());
    } catch (e) {
      emit(WalletFormFailure(e.toString()));
    }
  }
}
