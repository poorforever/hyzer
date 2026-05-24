import { AgentRequest } from '../types';

export class AgentClient {
  private apiUrl: string;

  constructor(apiUrl: string = 'https://api.agent-analyze.local') {
    this.apiUrl = apiUrl;
  }

  async pushListeningData(data: AgentRequest): Promise<any> {
    console.log(`Envoi des données à l'API Agent : ${this.apiUrl}`, data);
    
    // Dans un environnement réel, on utiliserait fetch
    /*
    const response = await fetch(`${this.apiUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
    */

    return { status: 'success', matches: [] };
  }
}
