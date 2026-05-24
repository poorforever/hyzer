import { MusicDataService } from '../MusicProviderStrategy/MusicProviderStrategy';
import { AgentClient } from '../AgentClient/AgentClient';
import { AgentRequest, ListeningHistoryItem, TrackInfo } from '../types';

export class CoordinatorService {
  private musicService: MusicDataService;
  private agentClient: AgentClient;

  constructor(musicService: MusicDataService, agentClient: AgentClient) {
    this.musicService = musicService;
    this.agentClient = agentClient;
  }

  /**
   * Coordonne la récupération et l'envoi des données.
   */
  async processUserHistory(platform: string, userId: string, limit: number = 5): Promise<any> {
    try {
      // 1. Récupération des données brutes
      const tracks = await this.musicService.fetchHistory(platform, userId, limit);

      // 2. Transformation en format AgentRequest
      const historyItems: ListeningHistoryItem[] = tracks.map(track => ({
        track_id: track.id,
        play_count: track.play_count || 0,
        duration_ms: track.duration_ms,
        is_hit: this.determineIfHit(track),
      }));

      const requestData: AgentRequest = {
        user_id: userId,
        history: historyItems,
        limit: limit,
      };

      // 3. Envoi à l'agent
      return await this.agentClient.pushListeningData(requestData);
    } catch (error) {
      console.error('Erreur lors de la coordination :', error);
      throw error;
    }
  }

  /**
   * Détermine si une chanson est un "hit" pour l'utilisateur.
   * Ces critères pourront être affinés dans music_analysis_guidelines.md.
   */
  private determineIfHit(track: TrackInfo): boolean {
    const playCountThreshold = 10;
    // On pourrait ajouter une logique sur la période d'écoute ici
    return (track.play_count || 0) >= playCountThreshold;
  }
}
