import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/di/injection_container.dart';
import '../../../wallets/domain/wallet_repository.dart';
import '../../../dashboard/domain/models.dart';
import '../bloc/transaction_form_bloc.dart';

class AddTransactionScreen extends StatefulWidget {
  const AddTransactionScreen({super.key});

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _amountController = TextEditingController();
  String _selectedType = 'expense';
  String _selectedCategory = 'Food';
  int? _selectedWalletId;
  int? _receiverWalletId;
  final DateTime _selectedDate = DateTime.now();
  List<Wallet> _wallets = [];
  bool _isLoadingWallets = true;

  final List<String> _categories = const [
    'Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Salary', 'Transfer', 'Other'
  ];

  @override
  void initState() {
    super.initState();
    _loadWallets();
  }

  Future<void> _loadWallets() async {
    try {
      final wallets = await sl<WalletRepository>().getWallets();
      setState(() {
        _wallets = wallets;
        if (wallets.isNotEmpty) {
          _selectedWalletId = wallets.first.id;
        }
        _isLoadingWallets = false;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors du chargement des portefeuilles: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => sl<TransactionFormBloc>(),
      child: BlocConsumer<TransactionFormBloc, TransactionFormState>(
        listener: (context, state) {
          if (state is TransactionFormSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('Transaction ajoutée !'),
                backgroundColor: const Color(0xFF16A34A),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            );
            context.pop(true);
          } else if (state is TransactionFormFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Erreur: ${state.message}'),
                backgroundColor: const Color(0xFFDC2626),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            );
          }
        },
        builder: (context, state) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Nouvelle Transaction'),
            ),
            body: _isLoadingWallets
                ? const Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildLabel('Portefeuille source'),
                          DropdownButtonFormField<int>(
                            initialValue: _selectedWalletId,
                            decoration: const InputDecoration(
                              hintText: 'Choisir le portefeuille source',
                              prefixIcon: Icon(Icons.account_balance_wallet_outlined, size: 20),
                            ),
                            items: _wallets.map((wallet) {
                              return DropdownMenuItem(
                                value: wallet.id,
                                child: Text(wallet.name),
                              );
                            }).toList(),
                            onChanged: (value) {
                              setState(() {
                                _selectedWalletId = value;
                              });
                            },
                            validator: (value) => value == null ? 'Veuillez choisir un portefeuille' : null,
                          ),
                          if (_selectedType == 'transfer') ...[
                            const SizedBox(height: 20),
                            _buildLabel('Portefeuille destinataire'),
                            DropdownButtonFormField<int>(
                              initialValue: _receiverWalletId,
                              decoration: const InputDecoration(
                                hintText: 'Choisir le portefeuille destinataire',
                                prefixIcon: Icon(Icons.move_to_inbox_outlined, size: 20),
                              ),
                              items: _wallets.where((w) => w.id != _selectedWalletId).map((wallet) {
                                return DropdownMenuItem(
                                  value: wallet.id,
                                  child: Text(wallet.name),
                                );
                              }).toList(),
                              onChanged: (value) {
                                setState(() {
                                  _receiverWalletId = value;
                                });
                              },
                              validator: (value) => value == null ? 'Veuillez choisir un destinataire' : null,
                            ),
                          ],
                          const SizedBox(height: 20),
                          _buildLabel('Description'),
                          TextFormField(
                            controller: _nameController,
                            decoration: const InputDecoration(
                              hintText: 'ex: Courses Hebdomadaires',
                              prefixIcon: Icon(Icons.description_outlined, size: 20),
                            ),
                            validator: (value) => value!.isEmpty ? 'Veuillez entrer une description' : null,
                          ),
                          const SizedBox(height: 20),
                          _buildLabel('Montant'),
                          TextFormField(
                            controller: _amountController,
                            decoration: const InputDecoration(
                              hintText: '0',
                              prefixIcon: Icon(Icons.payments_outlined, size: 20),
                              suffixText: 'CFA',
                              suffixStyle: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                            ),
                            keyboardType: TextInputType.number,
                            validator: (value) {
                              if (value!.isEmpty) return 'Veuillez entrer un montant';
                              if (double.tryParse(value) == null) return 'Nombre invalide';
                              return null;
                            },
                          ),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildLabel('Type'),
                                    DropdownButtonFormField<String>(
                                      initialValue: _selectedType,
                                      decoration: const InputDecoration(),
                                      items: const [
                                        DropdownMenuItem(value: 'expense', child: Text('Dépense')),
                                        DropdownMenuItem(value: 'income', child: Text('Revenu')),
                                        DropdownMenuItem(value: 'transfer', child: Text('Transfert')),
                                      ],
                                      onChanged: (value) => setState(() {
                                        _selectedType = value!;
                                        if (_selectedType == 'transfer') {
                                           _selectedCategory = 'Transfer';
                                        }
                                      }),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    _buildLabel('Catégorie'),
                                    DropdownButtonFormField<String>(
                                      initialValue: _selectedCategory,
                                      decoration: const InputDecoration(),
                                      items: _categories.map((cat) {
                                        return DropdownMenuItem(value: cat, child: Text(cat));
                                      }).toList(),
                                      onChanged: (value) => setState(() => _selectedCategory = value!),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 48),
                          SizedBox(
                            width: double.infinity,
                            height: 52,
                            child: ElevatedButton(
                              onPressed: state is TransactionFormSubmitting
                                  ? null
                                  : () {
                                      if (_formKey.currentState!.validate()) {
                                        context.read<TransactionFormBloc>().add(
                                              TransactionFormSubmitted(
                                                walletId: _selectedWalletId!,
                                                receiverWalletId: _selectedType == 'transfer' ? _receiverWalletId : null,
                                                name: _nameController.text,
                                                amount: double.parse(_amountController.text),
                                                type: _selectedType,
                                                category: _selectedCategory,
                                                date: _selectedDate,
                                              ),
                                            );
                                      }
                                    },
                              child: state is TransactionFormSubmitting
                                  ? const SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                    )
                                  : const Text('Confirmer la transaction', style: TextStyle(fontSize: 16)),
                            ),
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

  Widget _buildLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 4),
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.bold,
          color: Color(0xFF475569),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _amountController.dispose();
    super.dispose();
  }
}
