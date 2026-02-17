import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../features/auth/data/auth_repository.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/dashboard/data/dashboard_repository.dart';
import '../../features/dashboard/presentation/bloc/dashboard_bloc.dart';
import '../../features/wallets/data/wallet_repository.dart';
import '../../features/wallets/domain/wallet_repository.dart' as wallet_domain;
import '../../features/wallets/presentation/bloc/wallet_form_bloc.dart';
import '../../features/transactions/data/transaction_repository.dart';
import '../../features/transactions/domain/transaction_repository.dart' as trans_domain;
import '../../features/transactions/presentation/bloc/transaction_form_bloc.dart';
import '../api/api_client.dart';
import '../data/local_data_source.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => ApiClient());
  sl.registerLazySingleton(() => LocalDataSource(sl()));

  // Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepository(sl(), sl(), sl()),
  );
  sl.registerLazySingleton<DashboardRepository>(
    () => DashboardRepository(sl(), sl()),
  );
  sl.registerLazySingleton<wallet_domain.WalletRepository>(
    () => WalletRepositoryImpl(sl()),
  );
  sl.registerLazySingleton<trans_domain.TransactionRepository>(
    () => TransactionRepositoryImpl(sl()),
  );

  // Bloc
  sl.registerFactory(() => AuthBloc(sl()));
  sl.registerFactory(() => DashboardBloc(sl()));
  sl.registerFactory(() => WalletFormBloc(sl()));
  sl.registerFactory(() => TransactionFormBloc(sl()));
}
