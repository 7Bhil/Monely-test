import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../dashboard/presentation/bloc/dashboard_bloc.dart';

class TransactionsPage extends StatelessWidget {
  const TransactionsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DashboardBloc, DashboardState>(
      builder: (context, state) {
        final currentState = state;
        if (currentState is DashboardLoaded) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Transactions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
            ),
            body: RefreshIndicator(
              onRefresh: () async {
                context.read<DashboardBloc>().add(DashboardLoadRequested());
              },
              child: ListView.builder(
                padding: const EdgeInsets.all(20),
                itemCount: currentState.recentTransactions.length,
                itemBuilder: (context, index) {
                  final transaction = currentState.recentTransactions[index];
                  final isIncome = transaction.type == 'income';
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      leading: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: isIncome ? const Color(0xFFF0FDF4) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Icon(
                          isIncome ? Icons.arrow_downward : Icons.shopping_bag_outlined,
                          color: isIncome ? const Color(0xFF16A34A) : const Color(0xFF64748B),
                          size: 20,
                        ),
                      ),
                      title: Text(transaction.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      subtitle: Text('${transaction.category} • ${transaction.date.toString().split(' ')[0]}'),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '${isIncome ? '+' : '-'}${_formatCurrency(transaction.amount)}',
                            style: TextStyle(
                              color: isIncome ? const Color(0xFF16A34A) : const Color(0xFF0F172A),
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Color(0xFFDC2626), size: 18),
                            onPressed: () => _showDeleteConfirmation(context, transaction.id, transaction.name),
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
        title: const Text('Supprimer Transaction'),
        content: Text('Voulez-vous vraiment supprimer "$name" ?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('Annuler')),
          TextButton(
            onPressed: () {
              context.read<DashboardBloc>().add(TransactionDeleted(id));
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
