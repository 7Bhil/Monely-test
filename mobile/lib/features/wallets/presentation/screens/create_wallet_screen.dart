import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/di/injection_container.dart';
import '../bloc/wallet_form_bloc.dart';

class CreateWalletScreen extends StatefulWidget {
  const CreateWalletScreen({super.key});

  @override
  State<CreateWalletScreen> createState() => _CreateWalletScreenState();
}

class _CreateWalletScreenState extends State<CreateWalletScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _balanceController = TextEditingController();
  String _selectedType = 'cash';
  final String _selectedCurrency = 'CFA';
  final String _selectedColor = '#2563EB'; // Changed to match theme
  final String _selectedIcon = 'account_balance_wallet';

  final List<Map<String, String>> _walletTypes = [
    {'value': 'cash', 'label': 'Espèces'},
    {'value': 'bank', 'label': 'Banque'},
    {'value': 'mobile', 'label': 'Mobile Money'},
    {'value': 'crypto', 'label': 'Crypto'},
  ];

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => sl<WalletFormBloc>(),
      child: BlocConsumer<WalletFormBloc, WalletFormState>(
        listener: (context, state) {
          if (state is WalletFormSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: const Text('Portefeuille créé avec succès !'),
                backgroundColor: const Color(0xFF16A34A),
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
            );
            context.pop(true);
          } else if (state is WalletFormFailure) {
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
              title: const Text('Nouveau Portefeuille'),
            ),
            body: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLabel('Nom du portefeuille'),
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        hintText: 'ex: Compte Principal',
                        prefixIcon: Icon(Icons.label_outline, size: 20),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veuillez entrer un nom';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    _buildLabel('Type de compte'),
                    DropdownButtonFormField<String>(
                      initialValue: _selectedType,
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.category_outlined, size: 20),
                      ),
                      items: _walletTypes.map((type) {
                        return DropdownMenuItem(
                          value: type['value'],
                          child: Text(type['label']!),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedType = value!;
                        });
                      },
                    ),
                    const SizedBox(height: 20),
                    _buildLabel('Solde initial'),
                    TextFormField(
                      controller: _balanceController,
                      decoration: const InputDecoration(
                        hintText: '0',
                        prefixIcon: Icon(Icons.account_balance_wallet_outlined, size: 20),
                        suffixText: 'CFA',
                        suffixStyle: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Veuillez entrer un solde';
                        }
                        if (double.tryParse(value) == null) {
                          return 'Veuillez entrer un nombre valide';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 48),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: state is WalletFormSubmitting
                            ? null
                            : () {
                                if (_formKey.currentState!.validate()) {
                                  context.read<WalletFormBloc>().add(
                                        WalletFormSubmitted(
                                          name: _nameController.text,
                                          type: _selectedType,
                                          balance: double.parse(_balanceController.text),
                                          currency: _selectedCurrency,
                                          color: _selectedColor,
                                          icon: _selectedIcon,
                                        ),
                                      );
                                }
                              },
                        child: state is WalletFormSubmitting
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                              )
                            : const Text('Créer mon portefeuille', style: TextStyle(fontSize: 16)),
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
    _balanceController.dispose();
    super.dispose();
  }
}
