import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/api/api_client.dart';
import '../../../../core/data/local_data_source.dart';
import '../domain/user_model.dart';

class AuthRepository {
  final ApiClient _apiClient;
  final SharedPreferences _prefs;
  final LocalDataSource _localDataSource;

  AuthRepository(this._apiClient, this._prefs, this._localDataSource);

  Future<User> login(String email, String password) async {
    try {
      final response = await _apiClient.client.post('/auth/login/', data: {
        'email': email, // Changed from username to email based on Django User model
        'password': password,
      });

      final accessToken = response.data['access'];
      final refreshToken = response.data['refresh'];

      await _prefs.setString('access_token', accessToken);
      await _prefs.setString('refresh_token', refreshToken);

      return await getProfile();
    } catch (e) {
      rethrow;
    }
  }

  Future<User> register(String name, String email, String password) async {
    try {
      await _apiClient.client.post('/auth/register/', data: {
        'username': email.split('@')[0], // Generate username from email
        'email': email,
        'name': name,
        'password': password,
        'password_confirm': password,
      });

      return await login(email, password);
    } catch (e) {
      rethrow;
    }
  }

  Future<User> getProfile() async {
    try {
      final response = await _apiClient.client.get('/auth/profile/');
      final user = User.fromJson(response.data);
      await _localDataSource.cacheUserProfile(user);
      return user;
    } catch (e) {
      final cached = _localDataSource.getCachedUserProfile();
      if (cached != null) return cached;
      rethrow;
    }
  }

  Future<void> logout() async {
    await _prefs.remove('access_token');
    await _prefs.remove('refresh_token');
    await _localDataSource.clearCache();
  }
    
  bool get isAuthenticated => _prefs.containsKey('access_token');

  User? get currentUser => _localDataSource.getCachedUserProfile();
}
