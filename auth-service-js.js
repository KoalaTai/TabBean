import auth0 from 'auth0-js';
import config from '../config';

class AuthService {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: config.auth0Domain,
      clientID: config.auth0ClientId,
      redirectUri: chrome.runtime.getURL('callback.html'),
      responseType: 'token id_token',
      scope: 'openid profile email'
    });
  }

  login() {
    return new Promise((resolve, reject) => {
      this.auth0.authorize((err) => {
        if (err) {
          console.error('Error during login:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
          resolve(authResult);
        } else if (err) {
          console.error('Error parsing hash:', err);
          reject(err);
        }
      });
    });
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    chrome.storage.local.set({
      access_token: authResult.accessToken,
      id_token: authResult.idToken,
      expires_at: expiresAt
    });
  }

  logout() {
    return new Promise((resolve) => {
      chrome.storage.local.remove(['access_token', 'id_token', 'expires_at'], () => {
        this.auth0.logout({
          returnTo: chrome.runtime.getURL('index.html')
        });
        resolve();
      });
    });
  }

  isAuthenticated() {
    return new Promise((resolve) => {
      chrome.storage.local.get('expires_at', (result) => {
        const expiresAt = JSON.parse(result.expires_at || '0');
        resolve(new Date().getTime() < expiresAt);
      });
    });
  }

  getAccessToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get('access_token', (result) => {
        resolve(result.access_token);
      });
    });
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      this.getAccessToken().then(accessToken => {
        if (!accessToken) {
          reject('Not authenticated');
        } else {
          this.auth0.client.userInfo(accessToken, (err, user) => {
            if (err) {
              console.error('Error getting user info:', err);
              reject(err);
            } else {
              resolve(user);
            }
          });
        }
      });
    });
  }
}

export default new AuthService();
