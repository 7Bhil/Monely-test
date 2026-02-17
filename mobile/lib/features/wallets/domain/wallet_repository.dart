import '../../dashboard/domain/models.dart';

abstract class WalletRepository {
  Future<List<Wallet>> getWallets();
  Future<Wallet> createWallet({
    required String name,
    required String type,
    required double balance,
    required String currency,
    required String color,
    required String icon,
  });
  Future<void> deleteWallet(int id);
}
