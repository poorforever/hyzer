import { CoordinatorService } from './CoordinatorService';
import { MusicDataService } from '../MusicProviderStrategy/MusicProviderStrategy';
import { AgentClient } from '../AgentClient/AgentClient';

describe('CoordinatorService', () => {
  let coordinator: CoordinatorService;
  let mockMusicService: jest.Mocked<MusicDataService>;
  let mockAgentClient: jest.Mocked<AgentClient>;

  beforeEach(() => {
    mockMusicService = new MusicDataService() as jest.Mocked<MusicDataService>;
    mockMusicService.fetchHistory = jest.fn();

    mockAgentClient = new AgentClient() as jest.Mocked<AgentClient>;
    mockAgentClient.pushListeningData = jest.fn();

    coordinator = new CoordinatorService(mockMusicService, mockAgentClient);
  });

  it('should process user history correctly', async () => {
    const mockTracks = [
      { id: 't1', title: 'Song 1', artist: 'Art 1', duration_ms: 200000, play_count: 15 },
      { id: 't2', title: 'Song 2', artist: 'Art 2', duration_ms: 180000, play_count: 5 },
    ];

    mockMusicService.fetchHistory.mockResolvedValue(mockTracks);
    mockAgentClient.pushListeningData.mockResolvedValue({ status: 'success' });

    const result = await coordinator.processUserHistory('spotify', 'user_123', 5);

    expect(mockMusicService.fetchHistory).toHaveBeenCalledWith('spotify', 'user_123', 5);
    expect(mockAgentClient.pushListeningData).toHaveBeenCalledWith({
      user_id: 'user_123',
      history: [
        { track_id: 't1', play_count: 15, duration_ms: 200000, is_hit: true },
        { track_id: 't2', play_count: 5, duration_ms: 180000, is_hit: false },
      ],
      limit: 5,
    });
    expect(result).toEqual({ status: 'success' });
  });

  it('should handle errors', async () => {
    mockMusicService.fetchHistory.mockRejectedValue(new Error('Fetch error'));
    
    await expect(coordinator.processUserHistory('spotify', 'user1')).rejects.toThrow('Fetch error');
  });

  describe('determineIfHit', () => {
    it('should return true if play_count >= 10', () => {
      // @ts-ignore - access private
      expect(coordinator.determineIfHit({ play_count: 10 })).toBe(true);
      // @ts-ignore - access private
      expect(coordinator.determineIfHit({ play_count: 15 })).toBe(true);
    });

    it('should return false if play_count < 10', () => {
      // @ts-ignore - access private
      expect(coordinator.determineIfHit({ play_count: 9 })).toBe(false);
      // @ts-ignore - access private
      expect(coordinator.determineIfHit({ play_count: 0 })).toBe(false);
      // @ts-ignore - access private
      expect(coordinator.determineIfHit({})).toBe(false);
    });
  });
});
