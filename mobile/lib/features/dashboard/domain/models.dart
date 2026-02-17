import 'package:equatable/equatable.dart';

class Wallet extends Equatable {
  final int id;
  final String name;
  final String type;
  final String typeDisplay;
  final double balance;
  final String currency;
  final String color;
  final String icon;

  const Wallet({
    required this.id,
    required this.name,
    required this.type,
    required this.typeDisplay,
    required this.balance,
    required this.currency,
    required this.color,
    required this.icon,
  });

  factory Wallet.fromJson(Map<String, dynamic> json) {
    return Wallet(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      typeDisplay: json['type_display'] ?? (json['type'] ?? ''),
      balance: double.tryParse(json['balance']?.toString() ?? '0') ?? 0.0,
      currency: json['currency'] ?? 'USD',
      color: json['color'] ?? 'blue',
      icon: json['icon'] ?? 'account_balance',
    );
  }

  @override
  List<Object?> get props => [id, name, type, balance, currency];
}

class Transaction extends Equatable {
  final int id;
  final int walletId;
  final int? receiverWalletId;
  final String walletName;
  final String name;
  final double amount;
  final String category;
  final String type;
  final String typeDisplay;
  final String status;
  final String statusDisplay;
  final DateTime date;
  final String icon;

  const Transaction({
    required this.id,
    required this.walletId,
    this.receiverWalletId,
    required this.walletName,
    required this.name,
    required this.amount,
    required this.category,
    required this.type,
    required this.typeDisplay,
    required this.status,
    required this.statusDisplay,
    required this.date,
    required this.icon,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? 0,
      walletId: json['wallet'] ?? 0,
      receiverWalletId: json['receiver_wallet'],
      walletName: json['wallet_name'] ?? '',
      name: json['name'] ?? '',
      amount: double.tryParse(json['amount']?.toString() ?? '0') ?? 0.0,
      category: json['category'] ?? '',
      type: json['type'] ?? '',
      typeDisplay: json['type_display'] ?? (json['type'] ?? ''),
      status: json['status'] ?? '',
      statusDisplay: json['status_display'] ?? (json['status'] ?? ''),
      date: json['date'] != null ? DateTime.parse(json['date']) : DateTime.now(),
      icon: json['icon'] ?? 'attach_money',
    );
  }

  @override
  List<Object?> get props => [id, name, amount, type, status, date, receiverWalletId];
}
