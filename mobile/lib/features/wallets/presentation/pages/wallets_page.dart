import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../dashboard/presentation/bloc/dashboard_bloc.dart';

class WalletsPage extends StatelessWidget {
  const WalletsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DashboardBloc, DashboardState>(
      builder: (context, state) {
        final currentState = state;
        if (currentState is DashboardLoaded) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Mes Portefeuilles', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
              actions: [
                IconButton(
                  icon: const Icon(Icons.add_circle_outline, color: Color(0xFF2563EB)),
                  onPressed: () async {
                    final result = await Navigator.of(context).pushNamed('/create-wallet');
                    if (result == true && context.mounted) {
                      context.read<DashboardBloc>().add(DashboardLoadRequested());
                    }
                  },
                ),
              ],
            ),
            body: RefreshIndicator(
              onRefresh: () async {
                context.read<DashboardBloc>().add(DashboardLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(20),
                itemCount: currentState.wallets.length,
                itemBuilder: (context, index) {
                  final wallet = currentState.wallets[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 16),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(16),
                      leading: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.account_balance_wallet_outlined, color: Color(0xFF2563EB)),
                      ),
                      title: Text(wallet.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(wallet.type.toUpperCase()),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            _formatCurrency(wallet.balance),
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Color(0xFFDC2626), size: 20),
                            onPressed: () => _showDeleteConfirmation(context, wallet.id, wallet.name),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          );
        }
        return const Center(child: CircularProgressIndicator());
      },
    );
  }

  void _showDeleteConfirmation(BuildContext context, int id, String name) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Supprimer Portefeuille'),
        content: Text('Voulez-vous vraiment supprimer "$name" ? Cette action est irréversible.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('Annuler')),
          TextButton(
            onPressed: () {
              context.read<DashboardBloc>().add(WalletDeleted(id));
              Navigator.pop(dialogContext);
            },
            child: const Text('Supprimer', style: TextStyle(color: Color(0xFFDC2626))),
          ),
        ],
      ),
    );
  }

  String _formatCurrency(double amount) {
    return '${amount.toStringAsFixed(0).replaceAllMapped(RegExp(r"(\d{1,3})(?=(\d{3})+(?!\d))"), (Match m) => "${m[1]} ")} F CFA';
  }
}
