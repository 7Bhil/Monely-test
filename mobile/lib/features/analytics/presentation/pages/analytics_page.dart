import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../dashboard/presentation/bloc/dashboard_bloc.dart';

class AnalyticsPage extends StatelessWidget {
  const AnalyticsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DashboardBloc, DashboardState>(
      builder: (context, state) {
        if (state is DashboardLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (state is DashboardFailure) {
          return Center(child: Text('Error: ${state.message}'));
        }
        if (state is DashboardLoaded) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Analyses', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24)),
            ),
            body: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                _buildOverviewCards(state),
                const SizedBox(height: 32),
                _buildSectionTitle('Répartition des Dépenses'),
                const SizedBox(height: 16),
                _buildCategoryPieChart(state),
                const SizedBox(height: 32),
                _buildSectionTitle('Flux de Trésorerie'),
                const SizedBox(height: 16),
                _buildIncomeExpenseChart(state),
                const SizedBox(height: 40),
              ],
            ),
          );
        }
        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
    );
  }

  Widget _buildOverviewCards(DashboardLoaded state) {
    final savingsRate = state.totalIncome > 0 ? ((state.totalIncome - state.totalExpense) / state.totalIncome * 100) : 0.0;
    
    return Row(
      children: [
        Expanded(
          child: _buildMetricCard(
            'Taux d\'Épargne',
            '${savingsRate.toStringAsFixed(1)}%',
            Icons.savings_outlined,
            const Color(0xFF2563EB),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildMetricCard(
            'Transactions',
            '${state.recentTransactions.length}',
            Icons.receipt_long_outlined,
            const Color(0xFF7C3AED),
          ),
        ),
      ],
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 12),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
        ],
      ),
    );
  }

  Widget _buildCategoryPieChart(DashboardLoaded state) {
    final categories = <String, double>{};
    for (var t in state.recentTransactions.where((t) => t.type == 'expense')) {
      categories[t.category] = (categories[t.category] ?? 0) + t.amount;
    }

    if (categories.isEmpty) {
      return const Center(child: Text('Pas de données de dépenses'));
    }

    final colors = [
      const Color(0xFF2563EB),
      const Color(0xFF10B981),
      const Color(0xFFF59E0B),
      const Color(0xFFEF4444),
      const Color(0xFF8B5CF6),
      const Color(0xFF64748B),
    ];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 4,
                centerSpaceRadius: 40,
                sections: categories.entries.toList().asMap().entries.map((e) {
                  final index = e.key;
                  final entry = e.value;
                  return PieChartSectionData(
                    value: entry.value,
                    title: '',
                    color: colors[index % colors.length],
                    radius: 20,
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Wrap(
            spacing: 16,
            runSpacing: 8,
            children: categories.entries.toList().asMap().entries.map((e) {
              final index = e.key;
              final entry = e.value;
              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: colors[index % colors.length],
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    entry.key,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                  ),
                ],
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildIncomeExpenseChart(DashboardLoaded state) {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      padding: const EdgeInsets.all(20),
      child: BarChart(
        BarChartData(
          gridData: const FlGridData(show: false),
          titlesData: FlTitlesData(
             show: true,
             topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
             rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
             bottomTitles: AxisTitles(
               sideTitles: SideTitles(
                 showTitles: true,
                 getTitlesWidget: (value, meta) {
                   if (value == 0) return const Text('Revenus', style: TextStyle(fontSize: 10));
                   if (value == 1) return const Text('Dépenses', style: TextStyle(fontSize: 10));
                   return const SizedBox.shrink();
                 },
               ),
             ),
          ),
          borderData: FlBorderData(show: false),
          barGroups: [
            BarChartGroupData(x: 0, barRods: [
              BarChartRodData(toY: state.totalIncome, color: const Color(0xFF10B981), width: 30, borderRadius: BorderRadius.circular(4)),
            ]),
            BarChartGroupData(x: 1, barRods: [
              BarChartRodData(toY: state.totalExpense, color: const Color(0xFFEF4444), width: 30, borderRadius: BorderRadius.circular(4)),
            ]),
          ],
        ),
      ),
    );
  }

}
