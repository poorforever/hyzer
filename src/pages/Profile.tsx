import React, { useState, useEffect } from 'react';
import { authService, AuthState } from '../services/AuthService/AuthService';
import { SpotifyProvider, YouTubeProvider, MusicDataService } from '../services/MusicProviderStrategy/MusicProviderStrategy';
import './Profile.css';

const Profile: React.FC = () => {
  const [platforms, setPlatforms] = useState<AuthState[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState('');

  const providers = [new SpotifyProvider(), new YouTubeProvider()];
  const musicDataService = new MusicDataService();

  useEffect(() => {
    // Gérer le retour d'OAuth2 (callback)
    const result = authService.handleCallback();
    if (result) {
      setMessage(`Connecté avec succès à ${result.platform} !`);
    }
    refreshPlatforms();
  }, []);

  const refreshPlatforms = () => {
    const states = providers.map(p => authService.getAuthState(p.name));
    setPlatforms(states);
  };

  const handleLink = (platformName: string) => {
    const provider = providers.find(p => p.name === platformName);
    if (provider) {
      try {
        const config = provider.getOAuth2Config(platformName);
        const authUrl = authService.getAuthorizationUrl(config, platformName);
        // Redirection vers le fournisseur de musique (OAuth2 flow)
        window.location.assign(authUrl);
      } catch (error: any) {
        console.error('Erreur lors de la génération de l\'URL d\'auth:', error);
        setMessage(`Erreur de configuration : ${error.message}`);
      }
    }
  };

  const handleUnlink = (platformName: string) => {
    authService.unlinkPlatform(platformName);
    refreshPlatforms();
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setMessage('Analyse des données en cours...');
    
    try {
      const connectedPlatforms = platforms.filter(p => p.isConnected);
      const allHistory = [];

      for (const p of connectedPlatforms) {
        const history = await musicDataService.fetchHistory(p.platform, 'current-user', 10, p.accessToken);
        allHistory.push(...history);
      }

      // Simulation d'envoi à l'API d'écoute
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage(`Analyse terminée ! ${allHistory.length} titres récupérés.`);
    } catch (error) {
      setMessage('Erreur lors de l\'analyse.');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profil Utilisateur</h1>
      <p>Gérez vos connexions aux plateformes de musique pour enrichir votre profil.</p>

      <div className="platform-list">
        {platforms.map((p) => (
          <div key={p.platform} className="platform-item">
            <div className="platform-info">
              <strong>{p.platform}</strong>
              <span className={p.isConnected ? 'status-connected' : 'status-disconnected'}>
                {p.isConnected ? '● Connecté' : '○ Non lié'}
              </span>
            </div>
            {p.isConnected ? (
              <button className="btn btn-unlink" onClick={() => handleUnlink(p.platform)}>
                Dissocier
              </button>
            ) : (
              <button className="btn btn-link" onClick={() => handleLink(p.platform)}>
                Lier
              </button>
            )}
          </div>
        ))}
      </div>

      <button 
        className="btn btn-analyze" 
        onClick={handleAnalyze}
        disabled={!platforms.some(p => p.isConnected) || isAnalyzing}
      >
        Lancer l'analyse des écoutes
      </button>

      {message && <p className="status-message">{message}</p>}

      {isAnalyzing && (
        <div className="overlay-spinner">
          <div className="spinner"></div>
          <p>Analyse en cours...</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
