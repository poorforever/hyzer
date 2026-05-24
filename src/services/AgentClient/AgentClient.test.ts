import { AgentClient } from './AgentClient';
import { AgentRequest } from '../types';

describe('AgentClient', () => {
  let client: AgentClient;
  const mockUrl = 'https://api.test.local';

  beforeEach(() => {
    client = new AgentClient(mockUrl);
  });

  it('should push data and return success', async () => {
    const mockRequest: AgentRequest = {
      user_id: 'user_123',
      history: [
        { track_id: 't1', play_count: 5, duration_ms: 100, is_hit: false }
      ],
      limit: 5
    };

    const response = await client.pushListeningData(mockRequest);
    expect(response).toEqual({ status: 'success', matches: [] });
  });

  it('should use default URL if none provided', () => {
    const defaultClient = new AgentClient();
    // @ts-ignore - accessing private member for test
    expect(defaultClient.apiUrl).toBe('https://api.agent-analyze.local');
  });
});
