import decode from 'jwt-decode';

class AuthService {
  login(token) {
    localStorage.setItem('jwt', token);
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  getToken() {
    return localStorage.getItem('jwt');
  }

  decodedToken() {
    return decode(this.getToken());
  }

  isTokenValid(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) return false;
      else return true;
    } catch {
      return false;
    }
  }

  isLoggedIn() {
    const token = this.getToken();
    return !!token && this.isTokenValid(token);
  }
}

export default new AuthService();
