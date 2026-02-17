import '../../../../core/api/api_client.dart';
import '../../dashboard/domain/models.dart';
import '../domain/transaction_repository.dart';

class TransactionRepositoryImpl implements TransactionRepository {
  final ApiClient _apiClient;

  TransactionRepositoryImpl(this._apiClient);

  @override
  Future<List<Transaction>> getTransactions() async {
    try {
      final response = await _apiClient.client.get('/transactions/transactions/');
      final dynamic data = response.data;
      
      if (data is Map && data.containsKey('results')) {
         final results = data['results'];
         if (results is List) {
           return results.map((json) => Transaction.fromJson(json)).toList();
         }
      } else if (data is List) {
         return data.map((json) => Transaction.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Transaction> createTransaction({
    required int walletId,
    int? receiverWalletId,
    required String name,
    required double amount,
    required String type,
    required String category,
    required DateTime date,
  }) async {
    try {
      final response = await _apiClient.client.post('/transactions/transactions/', data: {
        'wallet': walletId,
        'receiver_wallet': receiverWalletId,
        'name': name,
        'amount': amount,
        'type': type,
        'category': category,
        'date': date.toIso8601String().split('T')[0],
      });
      return Transaction.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
  @override
  Future<void> deleteTransaction(int id) async {
    try {
      await _apiClient.client.delete('/transactions/transactions/$id/');
    } catch (e) {
      rethrow;
    }
  }
}
