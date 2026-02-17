import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:fl_chart/fl_chart.dart';
import '../bloc/dashboard_bloc.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  bool _hideSalaryBanner = false;
  bool _salaryConfirming = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: BlocBuilder<DashboardBloc, DashboardState>(
            builder: (context, state) {
              if (state is DashboardLoaded) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Aperçu', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24, color: Color(0xFF0F172A))),
                    Text('Bon retour, ${state.user.name.split(' ').first} !', style: const TextStyle(fontSize: 14, color: Color(0xFF64748B))),
                  ],
                );
              }
              return const Text('Aperçu');
            },
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.notifications_none_outlined),
              onPressed: () {},
            ),
            const SizedBox(width: 8),
          ],
        ),
        body: BlocBuilder<DashboardBloc, DashboardState>(
          builder: (context, state) {
            if (state is DashboardLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is DashboardFailure) {
              return Center(child: Text('Error: ${state.message}'));
            } else if (state is DashboardLoaded) {
              return RefreshIndicator(
                onRefresh: () async {
                  context.read<DashboardBloc>().add(DashboardLoadRequested());
                },
                child: ListView(
                  padding: const EdgeInsets.all(20),
                  children: [
                    _buildSalaryBanner(context, state),
                    _buildPremiumStatCard(
                      context,
                      title: 'SOLDE TOTAL',
                      value: state.totalBalance,
                      trend: '+2.4%',
                      isPositive: true,
                      chart: _buildSparkline(),
                    ),
                    const SizedBox(height: 16),
                    _buildPremiumStatCard(
                      context,
                      title: 'REVENU MENSUEL (Profil)',
                      value: state.monthlyIncome,
                      subtitle: 'Reçu: ${_formatCurrency(state.totalIncome)}',
                      trend: state.totalIncome >= state.monthlyIncome ? 'OK' : '${(state.totalIncome / (state.monthlyIncome > 0 ? state.monthlyIncome : 1) * 100).toStringAsFixed(0)}%',
                      isPositive: true,
                      chart: _buildMicroBarChart(Colors.green.withAlpha((0.2 * 255).toInt())),
                    ),
                    const SizedBox(height: 16),
                    _buildPremiumStatCard(
                      context,
                      title: 'DÉPENSES',
                      value: state.totalExpense,
                      trend: '-8%',
                      isPositive: false,
                      chart: _buildMicroBarChart(const Color(0xFFDC2626).withValues(alpha: 0.2)),
                    ),
                    const SizedBox(height: 16),
                    _buildPremiumStatCard(
                      context,
                      title: 'RESTE À VIVRE',
                      value: state.budgetLeft,
                      subtitle: '${state.user.monthlyIncome > 0 ? (state.budgetLeft / state.user.monthlyIncome * 100).toStringAsFixed(0) : 0}%',
                      chart: _buildProgressBar(state.user.monthlyIncome > 0 ? (state.budgetLeft / state.user.monthlyIncome).clamp(0.0, 1.0) : 0.0),
                    ),
                    const SizedBox(height: 32),
                    _buildAIInsightsBanner(context),
                    const SizedBox(height: 32),
                     _buildSectionHeader(
                      context,
                      title: 'Mes Portefeuilles',
                      onAdd: () async {
                        final dashboardBloc = context.read<DashboardBloc>();
                        final result = await context.push('/create-wallet');
                        if (result == true && mounted) {
                          dashboardBloc.add(DashboardLoadRequested());
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    _buildWalletsList(context, state),
                    const SizedBox(height: 32),
                    _buildSectionHeader(context, title: 'Transactions Récentes'),
                    const SizedBox(height: 16),
                    _buildTransactionsList(context, state),
                  ],
                ),
              );
            }
            return const SizedBox.shrink();
          },
        ),
    );
  }

  String _formatCurrency(double amount) {
    return '${amount.toStringAsFixed(0).replaceAllMapped(RegExp(r"(\d{1,3})(?=(\d{3})+(?!\d))"), (Match m) => "${m[1]} ")} F CFA';
  }

  Widget _buildPremiumStatCard(
    BuildContext context, {
    required String title,
    required double value,
    String? trend,
    bool isPositive = true,
    String? subtitle,
    required Widget chart,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF64748B), letterSpacing: 0.5)),
                if (trend != null)
                   Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: isPositive ? const Color(0xFFF0FDF4) : const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(100)),
                    child: Text(trend, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isPositive ? const Color(0xFF16A34A) : const Color(0xFFDC2626))),
                  )
                else if (subtitle != null)
                  Text(subtitle, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
              ],
            ),
            const SizedBox(height: 8),
            Text(_formatCurrency(value), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
            const SizedBox(height: 16),
            SizedBox(height: 40, width: double.infinity, child: chart),
          ],
        ),
      ),
    );
  }

  Widget _buildSparkline() {
    return LineChart(
      LineChartData(
        gridData: const FlGridData(show: false),
        titlesData: const FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            isCurved: true,
            color: const Color(0xFF2563EB),
            barWidth: 2,
            isStrokeCapRound: true,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(show: true, gradient: LinearGradient(colors: [const Color(0xFF2563EB).withValues(alpha: 0.3), const Color(0xFF2563EB).withValues(alpha: 0)], begin: Alignment.topCenter, end: Alignment.bottomCenter)),
            spots: const [FlSpot(0, 1), FlSpot(1, 1.2), FlSpot(2, 1.1), FlSpot(3, 1.4), FlSpot(4, 1.3), FlSpot(5, 1.6)],
          ),
        ],
      ),
    );
  }

  Widget _buildMicroBarChart(Color color) {
    return BarChart(
      BarChartData(
        gridData: const FlGridData(show: false),
        titlesData: const FlTitlesData(show: false),
        borderData: FlBorderData(show: false),
        barGroups: [40, 60, 45, 70, 65, 80].asMap().entries.map((e) => BarChartGroupData(x: e.key, barRods: [BarChartRodData(toY: e.value.toDouble(), color: color, width: 35, borderRadius: BorderRadius.circular(4))])).toList(),
      ),
    );
  }

  Widget _buildSalaryBanner(BuildContext context, DashboardLoaded state) {
    final isTenthDay = DateTime.now().day == 10;
    if (!isTenthDay || _hideSalaryBanner) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF059669),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF059669).withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.payments_outlined, color: Colors.white, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Salaire reçu ?',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  'Confirmez la réception de votre salaire de ${_formatCurrency(state.user.monthlyIncome)}',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: _salaryConfirming ? null : () => _handleSalaryConfirm(context, state),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF059669),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              minimumSize: const Size(60, 32),
              shape: _roundedRectanglePlatform(borderRadius: BorderRadius.circular(8)),
            ),
            child: _salaryConfirming 
              ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF059669)))
              : const Text('Oui !', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white70, size: 20),
            onPressed: () => setState(() => _hideSalaryBanner = true),
          ),
        ],
      ),
    );
  }

  Future<void> _handleSalaryConfirm(BuildContext context, DashboardLoaded state) async {
    setState(() => _salaryConfirming = true);
    try {
      await Future.delayed(const Duration(seconds: 1)); // Simulate API
      if (mounted) {
        setState(() {
          _salaryConfirming = false;
          _hideSalaryBanner = true;
        });
        context.read<DashboardBloc>().add(DashboardLoadRequested());
      }
    } catch (e) {
      if (mounted) setState(() => _salaryConfirming = false);
    }
  }

  RoundedRectangleBorder _roundedRectanglePlatform({required BorderRadius borderRadius}) => RoundedRectangleBorder(borderRadius: borderRadius);

  Widget _buildProgressBar(double progress) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 8,
            backgroundColor: const Color(0xFFF1F5F9),
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF2563EB)),
          ),
        ),
      ],
    );
  }

  Widget _buildAIInsightsBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF2563EB), Color(0xFF7C3AED)], begin: Alignment.topLeft, end: Alignment.bottomRight),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: const Color(0xFF2563EB).withValues(alpha: 0.2), blurRadius: 20, offset: const Offset(0, 8))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [const Icon(Icons.auto_awesome_outlined, color: Colors.white, size: 18), const SizedBox(width: 8), const Text('Smart AI Insights', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold))]),
          const SizedBox(height: 12),
          const Text("Votre santé financière s'améliore ! Vous avez économisé 12% de plus ce mois-ci.", style: TextStyle(color: Colors.white, fontSize: 13, height: 1.4)),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, {required String title, VoidCallback? onAdd}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        if (onAdd != null) IconButton(icon: const Icon(Icons.add_circle_outline, color: Color(0xFF2563EB), size: 22), onPressed: onAdd),
      ],
    );
  }

  Widget _buildWalletsList(BuildContext context, DashboardLoaded state) {
    if (state.wallets.isEmpty) {
      return const Card(child: Padding(padding: EdgeInsets.all(24.0), child: Center(child: Text('Aucun portefeuille'))));
    }
    return SizedBox(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        clipBehavior: Clip.none,
        itemCount: state.wallets.length,
        itemBuilder: (context, index) {
          final wallet = state.wallets[index];
          return Container(
            width: 180,
            margin: const EdgeInsets.only(right: 16),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Icon(Icons.account_balance_wallet_outlined, size: 20, color: Color(0xFF2563EB)),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(wallet.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)), maxLines: 1, overflow: TextOverflow.ellipsis),
                        Text(_formatCurrency(wallet.balance), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTransactionsList(BuildContext context, DashboardLoaded state) {
    if (state.recentTransactions.isEmpty) {
      return const Card(child: Padding(padding: EdgeInsets.all(24.0), child: Center(child: Text('Aucune transaction'))));
    }
    return Column(
      children: state.recentTransactions.map((transaction) {
        final isIncome = transaction.type == 'income';
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFE2E8F0))),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            leading: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(color: isIncome ? const Color(0xFFF0FDF4) : const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(100)),
              child: Icon(isIncome ? Icons.arrow_downward : Icons.shopping_bag_outlined, color: isIncome ? const Color(0xFF16A34A) : const Color(0xFF64748B), size: 20),
            ),
            title: Text(transaction.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0F172A))),
            subtitle: Text('${transaction.category} • ${transaction.date.toString().split(' ')[0]}', style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
            trailing: Text('${isIncome ? '+' : '-'}${_formatCurrency(transaction.amount)}', style: TextStyle(color: isIncome ? const Color(0xFF16A34A) : const Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 14)),
          ),
        );
      }).toList(),
    );
  }
}
