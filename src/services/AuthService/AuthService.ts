import { OAuth2Config } from '../MusicProviderStrategy/MusicProviderStrategy';

export interface AuthState {
  platform: string;
  isConnected: boolean;
  accessToken?: string;
}

class AuthService {
  private storageKey = 'platform_auth_tokens';

  getAuthState(platform: string): AuthState {
    const tokens = this.getAllTokens();
    return {
      platform,
      isConnected: !!tokens[platform.toLowerCase()],
      accessToken: tokens[platform.toLowerCase()]
    };
  }

  getAuthorizationUrl(config: OAuth2Config, platform: string): string {
    let redirectUri = process.env.REACT_APP_REDIRECT_URI || (window.location.origin + '/profile');
    
    // Spotify n'accepte plus 'localhost' comme redirect URI depuis 2025.
    // Utiliser l'adresse IP de loopback 127.0.0.1 en HTTP simple est autorisé par Spotify.
    // Si l'URI contient encore 'localhost', on le remplace automatiquement par 127.0.0.1.
    if (redirectUri.includes('localhost')) {
      redirectUri = redirectUri.replace('localhost', '127.0.0.1').replace('https://', 'http://');
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state: platform.toLowerCase(),
    });
    return `${config.authEndpoint}?${params.toString()}`;
  }

  handleCallback(): { platform: string; token: string } | null {
    const hash = window.location.hash;
    const search = window.location.search;
    
    let token: string | null = null;
    let platform: string | null = null;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      token = params.get('access_token');
      platform = params.get('state');
    }

    if (!token && search) {
      const params = new URLSearchParams(search);
      token = params.get('code'); // En flux 'code', on reçoit un code qu'on traite ici comme un token pour la simulation
      platform = params.get('state');
    }

    if (token && platform) {
      this.linkPlatform(platform, token);
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return { platform, token };
    }
    return null;
  }

  linkPlatform(platform: string, token: string): void {
    const tokens = this.getAllTokens();
    tokens[platform.toLowerCase()] = token;
    localStorage.setItem(this.storageKey, JSON.stringify(tokens));
  }

  unlinkPlatform(platform: string): void {
    const tokens = this.getAllTokens();
    delete tokens[platform.toLowerCase()];
    localStorage.setItem(this.storageKey, JSON.stringify(tokens));
  }

  private getAllTokens(): Record<string, string> {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }
}

export const authService = new AuthService();
