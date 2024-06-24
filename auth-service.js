import auth0 from 'auth0-js';

class AuthService {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: 'your-auth0-domain.auth0.com',
      clientID: 'your-client-id',
      redirectUri: 'chrome-extension://your-extension-id/callback.html',
      responseType: 'token id_token',
      scope: 'openid profile email'
    });
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
          resolve();
        } else if (err) {
          reject(err);
        }
      });
    });
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}

export default new AuthService();
