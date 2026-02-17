import 'package:equatable/equatable.dart';

class User extends Equatable {
  final int id;
  final String email;
  final String name;
  final String username;
  final String? avatarUrl;
  final String currency;
  final String language;
  final double monthlyIncome;

  const User({
    required this.id,
    required this.email,
    required this.name,
    required this.username,
    this.avatarUrl,
    required this.currency,
    required this.language,
    required this.monthlyIncome,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      username: json['username'] ?? '',
      avatarUrl: json['avatar_url'],
      currency: json['currency'] ?? 'USD',
      language: json['language'] ?? 'fr',
      monthlyIncome: double.parse((json['monthly_income'] ?? 0).toString()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'username': username,
      'avatar_url': avatarUrl,
      'currency': currency,
      'language': language,
      'monthly_income': monthlyIncome,
    };
  }

  @override
  List<Object?> get props => [id, email, name, username, avatarUrl, currency, language, monthlyIncome];
}
