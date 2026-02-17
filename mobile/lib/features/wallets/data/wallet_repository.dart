import '../../../../core/api/api_client.dart';
import '../../dashboard/domain/models.dart';
import '../domain/wallet_repository.dart';

class WalletRepositoryImpl implements WalletRepository {
  final ApiClient _apiClient;

  WalletRepositoryImpl(this._apiClient);

  @override
  Future<List<Wallet>> getWallets() async {
    try {
      final response = await _apiClient.client.get('/wallets/wallets/');
      final dynamic data = response.data;
      
      if (data is Map && data.containsKey('results')) {
         final results = data['results'];
         if (results is List) {
           return results.map((json) => Wallet.fromJson(json)).toList();
         }
      } else if (data is List) {
         return data.map((json) => Wallet.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Wallet> createWallet({
    required String name,
    required String type,
    required double balance,
    required String currency,
    required String color,
    required String icon,
  }) async {
    try {
      final response = await _apiClient.client.post('/wallets/wallets/', data: {
        'name': name,
        'type': type,
        'balance': balance,
        'currency': currency,
        'color': color,
        'icon': icon,
      });
      return Wallet.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
  @override
  Future<void> deleteWallet(int id) async {
    try {
      await _apiClient.client.delete('/wallets/wallets/$id/');
    } catch (e) {
      rethrow;
    }
  }
}
