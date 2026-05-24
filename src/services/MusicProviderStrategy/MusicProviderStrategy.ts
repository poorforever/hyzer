import { TrackInfo } from '../types';

export interface OAuth2Config {
  authEndpoint: string;
  clientId: string;
  scopes: string[];
  apiKey?: string; // Optionnel : pour certains appels API YouTube
}

export interface IMusicProvider {
  name: string;
  getListeningHistory(userId: string, limit: number, token?: string): Promise<TrackInfo[]>;
  getOAuth2Config(platform?: string): OAuth2Config;
}

export class SpotifyProvider implements IMusicProvider {
  name = 'Spotify';
  
  getOAuth2Config(platform?: string): OAuth2Config {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    
    if (!clientId || clientId === 'YOUR_SPOTIFY_CLIENT_ID') {
      const errorMsg = 'Spotify Client ID is not configured. Please check your .env file.';
      console.error(errorMsg);
      // Aide au diagnostic si la variable n'est pas chargée
      if (!clientId) {
        console.warn('DEBUG: process.env.REACT_APP_SPOTIFY_CLIENT_ID est undefined ou vide.');
      } else {
        console.warn('DEBUG: process.env.REACT_APP_SPOTIFY_CLIENT_ID contient encore la valeur par défaut.');
      }
      throw new Error(errorMsg);
    }

    return {
      authEndpoint: 'https://accounts.spotify.com/authorize',
      clientId: clientId,
      scopes: ['user-read-recently-played', 'user-top-read'],
    };
  }

  async getListeningHistory(userId: string, limit: number, token?: string): Promise<TrackInfo[]> {
    // Simulation d'appel API Spotify
    if (token) {
      console.log(`Utilisation du token Spotify: ${token.substring(0, 5)}...`);
    }
    console.log(`Récupération de l'historique Spotify pour ${userId}`);
    return [
      { id: 'spo_1', title: 'Song 1', artist: 'Artist A', duration_ms: 210000, play_count: 15 },
      { id: 'spo_2', title: 'Song 2', artist: 'Artist B', duration_ms: 180000, play_count: 3 },
    ].slice(0, limit);
  }

  async authorize(): Promise<string> {
    // Cette méthode n'est plus directement utilisée pour la redirection mais peut servir pour des tests
    return 'fake-spotify-token';
  }
}

export class YouTubeProvider implements IMusicProvider {
  name = 'YouTube';

  getOAuth2Config(platform?: string): OAuth2Config {
    const clientId = process.env.REACT_APP_YOUTUBE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_YOUTUBE_CLIENT_ID') {
      const errorMsg = 'YouTube Client ID is not configured. Please check your .env file.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    return {
      authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      clientId: clientId,
      scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
      apiKey: process.env.REACT_APP_YOUTUBE_API_KEY,
    };
  }

  async getListeningHistory(userId: string, limit: number, token?: string): Promise<TrackInfo[]> {
    // Simulation d'appel API YouTube
    if (token) {
      console.log(`Utilisation du token YouTube: ${token.substring(0, 5)}...`);
    }
    console.log(`Récupération de l'historique YouTube pour ${userId}`);
    return [
      { id: 'yt_1', title: 'Video 1', artist: 'Channel X', duration_ms: 300000, play_count: 20 },
    ].slice(0, limit);
  }

  async authorize(): Promise<string> {
    return 'fake-youtube-token';
  }
}

export class MusicDataService {
  private strategies: Map<string, IMusicProvider> = new Map();

  constructor() {
    this.addStrategy(new SpotifyProvider());
    this.addStrategy(new YouTubeProvider());
  }

  addStrategy(strategy: IMusicProvider) {
    this.strategies.set(strategy.name.toLowerCase(), strategy);
  }

  async fetchHistory(platform: string, userId: string, limit: number, token?: string): Promise<TrackInfo[]> {
    const strategy = this.strategies.get(platform.toLowerCase());
    if (!strategy) {
      throw new Error(`Plateforme non supportée : ${platform}`);
    }
    return strategy.getListeningHistory(userId, limit, token);
  }
}
