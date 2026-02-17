import 'package:flutter/material.dart';

class FixedExpensesPage extends StatelessWidget {
  const FixedExpensesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Charges Fixes', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: Color(0xFF2563EB)),
            onPressed: () {
              // TODO: Implement Add Fixed Expense
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('L\'ajout de charge fixe sera bientôt disponible !')),
              );
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const Text(
            'Tes abonnements et charges qui reviennent chaque mois.',
            style: TextStyle(color: Color(0xFF64748B), fontSize: 14),
          ),
          const SizedBox(height: 24),
          _buildExpenseItem(
            context,
            'Loyer / Hypothèque',
            '500 000 F CFA',
            'Mensuel',
            Icons.home_outlined,
            const Color(0xFF2563EB),
          ),
          _buildExpenseItem(
            context,
            'Netflix',
            '10 000 F CFA',
            'Mensuel',
            Icons.movie_outlined,
            const Color(0xFFEF4444),
          ),
          _buildExpenseItem(
            context,
            'Assurance Auto',
            '45 000 F CFA',
            'Annuel',
            Icons.directions_car_outlined,
            const Color(0xFF10B981),
          ),
          const SizedBox(height: 32),
          const Card(
            color: Color(0xFFF8FAFC),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: Color(0xFF2563EB)),
                  SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      'Ces montants sont automatiquement pris en compte dans ton calcul de budget.',
                      style: TextStyle(fontSize: 13, color: Color(0xFF475569)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExpenseItem(
    BuildContext context,
    String name,
    String amount,
    String period,
    IconData icon,
    Color color,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withAlpha((0.1 * 255).toInt()),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 24),
        ),
        title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(period),
        trailing: Text(
          amount,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        onTap: () {
          // TODO: Edit fixed expense
        },
      ),
    );
  }
}
