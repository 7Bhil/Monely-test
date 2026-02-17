import '../../../../core/api/api_client.dart';
import '../../../../core/data/local_data_source.dart';
import '../domain/models.dart';

class DashboardRepository {
  final ApiClient _apiClient;
  final LocalDataSource _localDataSource;

  DashboardRepository(this._apiClient, this._localDataSource);

  Future<List<Wallet>> getWallets() async {
    try {
      final response = await _apiClient.client.get('/wallets/wallets/');
      final dynamic data = response.data;
      List<Wallet> wallets = [];
      
      if (data is Map && data.containsKey('results')) {
         final results = data['results'];
         if (results is List) {
           wallets = results.map((json) => Wallet.fromJson(json)).toList();
         }
      } else if (data is List) {
         wallets = data.map((json) => Wallet.fromJson(json)).toList();
      }
      
      if (wallets.isNotEmpty) {
        await _localDataSource.cacheWallets(wallets);
      }
      return wallets;
    } catch (e) {
      return _localDataSource.getCachedWallets();
    }
  }

  Future<List<Transaction>> getRecentTransactions() async {
    try {
      final response = await _apiClient.client.get('/transactions/transactions/');
      final dynamic data = response.data;
      List<Transaction> transactions = [];
      
      if (data is Map && data.containsKey('results')) {
         final results = data['results'];
         if (results is List) {
           transactions = results.map((json) => Transaction.fromJson(json)).toList();
         }
      } else if (data is List) {
         transactions = data.map((json) => Transaction.fromJson(json)).toList();
      }

      if (transactions.isNotEmpty) {
        await _localDataSource.cacheTransactions(transactions);
      }
      return transactions;
    } catch (e) {
      return _localDataSource.getCachedTransactions();
    }
  }
}
