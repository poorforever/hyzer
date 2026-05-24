import { authService } from './AuthService';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return disconnected state by default', () => {
    const state = authService.getAuthState('Spotify');
    expect(state.isConnected).toBe(false);
    expect(state.accessToken).toBeUndefined();
  });

  it('should link a platform and store the token', () => {
    authService.linkPlatform('Spotify', 'token123');
    const state = authService.getAuthState('Spotify');
    expect(state.isConnected).toBe(true);
    expect(state.accessToken).toBe('token123');
  });

  it('should unlink a platform', () => {
    authService.linkPlatform('Spotify', 'token123');
    authService.unlinkPlatform('Spotify');
    const state = authService.getAuthState('Spotify');
    expect(state.isConnected).toBe(false);
    expect(state.accessToken).toBeUndefined();
  });

  it('should generate a correct authorization URL', () => {
    const config = {
      authEndpoint: 'https://example.com/auth',
      clientId: 'abc',
      scopes: ['read', 'write']
    };
    const url = authService.getAuthorizationUrl(config, 'Spotify');
    expect(url).toContain('https://example.com/auth');
    expect(url).toContain('client_id=abc');
    expect(url).toContain('response_type=code');
    expect(url).toContain('state=spotify');
    expect(url).toContain('scope=read+write');
  });

  it('should use REACT_APP_REDIRECT_URI if defined', () => {
    const config = {
      authEndpoint: 'https://example.com/auth',
      clientId: 'abc',
      scopes: ['read']
    };
    const originalEnv = process.env.REACT_APP_REDIRECT_URI;
    process.env.REACT_APP_REDIRECT_URI = 'https://myapp.com/callback';
    
    const url = authService.getAuthorizationUrl(config, 'Spotify');
    expect(url).toContain('redirect_uri=https%3A%2F%2Fmyapp.com%2Fcallback');
    
    process.env.REACT_APP_REDIRECT_URI = originalEnv;
  });

  it('should replace localhost with 127.0.0.1 in redirect_uri', () => {
    const config = {
      authEndpoint: 'https://example.com/auth',
      clientId: 'abc',
      scopes: ['read']
    };
    const originalEnv = process.env.REACT_APP_REDIRECT_URI;
    process.env.REACT_APP_REDIRECT_URI = 'http://localhost:3000/profile';
    
    const url = authService.getAuthorizationUrl(config, 'Spotify');
    expect(url).toContain('redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fprofile');
    expect(url).not.toContain('localhost');
    
    process.env.REACT_APP_REDIRECT_URI = originalEnv;
  });

  it('should replace https://localhost with http://127.0.0.1 in redirect_uri', () => {
    const config = {
      authEndpoint: 'https://example.com/auth',
      clientId: 'abc',
      scopes: ['read']
    };
    const originalEnv = process.env.REACT_APP_REDIRECT_URI;
    process.env.REACT_APP_REDIRECT_URI = 'https://localhost:3000/profile';
    
    const url = authService.getAuthorizationUrl(config, 'Spotify');
    expect(url).toContain('redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fprofile');
    expect(url).not.toContain('localhost');
    
    process.env.REACT_APP_REDIRECT_URI = originalEnv;
  });

  it('should handle callback correctly when code is present in search', () => {
    const originalSearch = window.location.search;
    delete (window as any).location;
    window.location = { 
      ...window.location, 
      search: '?code=code123&state=spotify',
      hash: '',
      origin: 'https://localhost',
      pathname: '/profile'
    } as any;

    const result = authService.handleCallback();
    expect(result).toEqual({ platform: 'spotify', token: 'code123' });
    
    const state = authService.getAuthState('Spotify');
    expect(state.isConnected).toBe(true);
    expect(state.accessToken).toBe('code123');

    window.location.search = originalSearch;
  });

  it('should handle callback correctly when token is present', () => {
    // Mock window.location.hash
    const originalHash = window.location.hash;
    delete (window as any).location;
    window.location = { 
      ...window.location, 
      hash: '#access_token=token123&state=spotify',
      origin: 'https://localhost',
      pathname: '/profile'
    } as any;

    const result = authService.handleCallback();
    expect(result).toEqual({ platform: 'spotify', token: 'token123' });
    
    const state = authService.getAuthState('Spotify');
    expect(state.isConnected).toBe(true);
    expect(state.accessToken).toBe('token123');

    window.location.hash = originalHash;
  });

  it('should return null if no token in hash', () => {
    const originalHash = window.location.hash;
    window.location.hash = '';
    const result = authService.handleCallback();
    expect(result).toBeNull();
    window.location.hash = originalHash;
  });
});
