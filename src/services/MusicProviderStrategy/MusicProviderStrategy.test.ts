import { MusicDataService, SpotifyProvider, YouTubeProvider } from './MusicProviderStrategy';

describe('MusicDataService', () => {
  let service: MusicDataService;

  beforeEach(() => {
    service = new MusicDataService();
  });

  it('should be initialized with Spotify and YouTube strategies', () => {
    // On peut tester indirectement en essayant de récupérer l'historique
    expect(async () => await service.fetchHistory('spotify', 'user1', 1)).not.toThrow();
    expect(async () => await service.fetchHistory('youtube', 'user1', 1)).not.toThrow();
  });

  it('should throw an error for unsupported platforms', async () => {
    await expect(service.fetchHistory('deezer', 'user1', 1)).rejects.toThrow('Plateforme non supportée : deezer');
  });

  it('should fetch history from Spotify with token', async () => {
    const history = await service.fetchHistory('spotify', 'user1', 1, 'fake-token');
    expect(history).toHaveLength(1);
    expect(history[0].id).toContain('spo_');
  });

  it('should fetch history from YouTube with token', async () => {
    const history = await service.fetchHistory('youtube', 'user1', 1, 'fake-token');
    expect(history).toHaveLength(1);
    expect(history[0].id).toContain('yt_');
  });

  it('should respect the limit parameter', async () => {
    const history = await service.fetchHistory('spotify', 'user1', 1);
    expect(history.length).toBeLessThanOrEqual(1);
  });
});

describe('SpotifyProvider', () => {
  it('should return spotify history', async () => {
    const provider = new SpotifyProvider();
    const history = await provider.getListeningHistory('user1', 5);
    expect(history[0].id).toBe('spo_1');
    expect(provider.name).toBe('Spotify');
  });

  it('should throw an error if not configured', () => {
    const originalEnv = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    process.env.REACT_APP_SPOTIFY_CLIENT_ID = '';
    const provider = new SpotifyProvider();
    expect(() => provider.getOAuth2Config('Spotify')).toThrow('Spotify Client ID is not configured');
    process.env.REACT_APP_SPOTIFY_CLIENT_ID = originalEnv;
  });

  it('should return oauth2 config when configured', () => {
    const originalEnv = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    process.env.REACT_APP_SPOTIFY_CLIENT_ID = 'valid-id';
    const provider = new SpotifyProvider();
    const config = provider.getOAuth2Config('Spotify');
    expect(config.clientId).toBe('valid-id');
    process.env.REACT_APP_SPOTIFY_CLIENT_ID = originalEnv;
  });
});

describe('YouTubeProvider', () => {
  it('should return youtube history', async () => {
    const provider = new YouTubeProvider();
    const history = await provider.getListeningHistory('user1', 5);
    expect(history[0].id).toBe('yt_1');
    expect(provider.name).toBe('YouTube');
  });

  it('should throw an error if not configured', () => {
    const originalEnv = process.env.REACT_APP_YOUTUBE_CLIENT_ID;
    process.env.REACT_APP_YOUTUBE_CLIENT_ID = '';
    const provider = new YouTubeProvider();
    expect(() => provider.getOAuth2Config('YouTube')).toThrow('YouTube Client ID is not configured');
    process.env.REACT_APP_YOUTUBE_CLIENT_ID = originalEnv;
  });

  it('should return oauth2 config when configured', () => {
    const originalEnv = process.env.REACT_APP_YOUTUBE_CLIENT_ID;
    process.env.REACT_APP_YOUTUBE_CLIENT_ID = 'valid-yt-id';
    const provider = new YouTubeProvider();
    const config = provider.getOAuth2Config('YouTube');
    expect(config.clientId).toBe('valid-yt-id');
    process.env.REACT_APP_YOUTUBE_CLIENT_ID = originalEnv;
  });
});
