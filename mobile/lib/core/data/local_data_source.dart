import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/auth/domain/user_model.dart';
import '../../features/dashboard/domain/models.dart';

class LocalDataSource {
  final SharedPreferences _prefs;

  LocalDataSource(this._prefs);

  static const _kUserProfile = 'cached_user_profile';
  static const _kWallets = 'cached_wallets';
  static const _kTransactions = 'cached_transactions';

  // User Profile
  Future<void> cacheUserProfile(User user) async {
    await _prefs.setString(_kUserProfile, jsonEncode(user.toJson()));
  }

  User? getCachedUserProfile() {
    final jsonString = _prefs.getString(_kUserProfile);
    if (jsonString != null) {
      return User.fromJson(jsonDecode(jsonString));
    }
    return null;
  }

  // Wallets
  Future<void> cacheWallets(List<Wallet> wallets) async {
    final List<Map<String, dynamic>> jsonList = wallets.map((w) => {
      'id': w.id,
      'name': w.name,
      'type': w.type,
      'type_display': w.typeDisplay,
      'balance': w.balance,
      'currency': w.currency,
      'color': w.color,
      'icon': w.icon,
    }).toList();
    await _prefs.setString(_kWallets, jsonEncode(jsonList));
  }

  List<Wallet> getCachedWallets() {
    final jsonString = _prefs.getString(_kWallets);
    if (jsonString != null) {
      final List<dynamic> decoded = jsonDecode(jsonString);
      return decoded.map((json) => Wallet.fromJson(json)).toList();
    }
    return [];
  }

  // Transactions
  Future<void> cacheTransactions(List<Transaction> transactions) async {
    final List<Map<String, dynamic>> jsonList = transactions.map((t) => {
      'id': t.id,
      'wallet': t.walletId,
      'wallet_name': t.walletName,
      'name': t.name,
      'amount': t.amount,
      'category': t.category,
      'type': t.type,
      'type_display': t.typeDisplay,
      'status': t.status,
      'status_display': t.statusDisplay,
      'date': t.date.toIso8601String(),
      'icon': t.icon,
    }).toList();
    await _prefs.setString(_kTransactions, jsonEncode(jsonList));
  }

  List<Transaction> getCachedTransactions() {
    final jsonString = _prefs.getString(_kTransactions);
    if (jsonString != null) {
      final List<dynamic> decoded = jsonDecode(jsonString);
      return decoded.map((json) => Transaction.fromJson(json)).toList();
    }
    return [];
  }

  Future<void> clearCache() async {
    await _prefs.remove(_kUserProfile);
    await _prefs.remove(_kWallets);
    await _prefs.remove(_kTransactions);
  }
}
