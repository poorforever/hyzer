import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { authService } from '../services/AuthService/AuthService';

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Profile Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders platform list', () => {
    render(<Profile />);
    expect(screen.getByText('Spotify')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getAllByText('Lier')).toHaveLength(2);
  });

  it('redirects to auth provider when clicking Lier', async () => {
    const originalLocation = window.location;
    delete (window as any).location;
    window.location = { ...originalLocation, assign: jest.fn() } as any;

    // Mock environment variables for testing
    const originalEnv = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    process.env.REACT_APP_SPOTIFY_CLIENT_ID = 'test-client-id';

    render(<Profile />);
    const linkButtons = screen.getAllByText('Lier');
    fireEvent.click(linkButtons[0]); // Spotify

    expect(window.location.assign).toHaveBeenCalledWith(expect.stringContaining('spotify'));
    
    // Restore
    process.env.REACT_APP_SPOTIFY_CLIENT_ID = originalEnv;
    window.location = originalLocation;
  });

  it('displays success message after successful callback', async () => {
    const originalHash = window.location.hash;
    delete (window as any).location;
    window.location = { 
      hash: '#access_token=token123&state=spotify',
      origin: 'https://localhost',
      pathname: '/profile'
    } as any;

    render(<Profile />);
    
    expect(screen.getByText(/Connecté avec succès à spotify/i)).toBeInTheDocument();
    expect(screen.getByText('● Connecté')).toBeInTheDocument();

    window.location.hash = originalHash;
  });

  it('unlinks a platform when clicking Dissocier', async () => {
    authService.linkPlatform('Spotify', 'token');
    render(<Profile />);
    
    expect(screen.getByText('● Connecté')).toBeInTheDocument();
    const unlinkButton = screen.getByText('Dissocier');
    fireEvent.click(unlinkButton);

    expect(screen.queryByText('● Connecté')).not.toBeInTheDocument();
    expect(screen.getAllByText('○ Non lié').length).toBeGreaterThan(0);
  });

  it('starts analysis and shows spinner', async () => {
    authService.linkPlatform('Spotify', 'token');
    render(<Profile />);
    
    const analyzeButton = screen.getByText('Lancer l\'analyse des écoutes');
    fireEvent.click(analyzeButton);

    expect(screen.getByText('Analyse en cours...')).toBeInTheDocument();
    expect(screen.getByText('Analyse des données en cours...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Analyse terminée !/)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.queryByText('Analyse en cours...')).not.toBeInTheDocument();
  });

  it('disables analyze button if no platform is connected', () => {
    render(<Profile />);
    const analyzeButton = screen.getByText('Lancer l\'analyse des écoutes');
    expect(analyzeButton).toBeDisabled();
  });
});
