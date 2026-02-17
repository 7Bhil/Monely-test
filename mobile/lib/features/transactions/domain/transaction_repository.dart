import '../../dashboard/domain/models.dart';

abstract class TransactionRepository {
  Future<List<Transaction>> getTransactions();
  Future<Transaction> createTransaction({
    required int walletId,
    int? receiverWalletId,
    required String name,
    required double amount,
    required String type,
    required String category,
    required DateTime date,
  });
  Future<void> deleteTransaction(int id);
}
