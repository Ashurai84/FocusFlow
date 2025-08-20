interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  country: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: { total: number };
  owner: { display_name: string };
  public: boolean;
  external_urls: { spotify: string };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
  uri: string;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  genres: string[];
  followers: { total: number };
  popularity: number;
  external_urls: { spotify: string };
}

class SpotifyService {
  private clientId = '98c86a30b01a4b63b55ddc7230efa0e9';
  private clientSecret = '487a056b23454d1f846b52cbba7b9147';
  private redirectUri = 'https://stupendous-paprenjak-1053a3.netlify.app/callback';
  private baseUrl = 'https://api.spotify.com/v1';
  private authUrl = 'https://accounts.spotify.com';

  // Generate random string for state parameter
  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // Get authorization URL
  getAuthUrl(): string {
    const state = this.generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);
    
    const scope = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-top-read',
      'user-read-recently-played',
      'streaming',
      'user-read-playback-state',
      'user-modify-playback-state'
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope,
      redirect_uri: this.redirectUri,
      state,
      show_dialog: 'true'
    });

    return `${this.authUrl}/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, state: string): Promise<SpotifyTokens> {
    const storedState = localStorage.getItem('spotify_auth_state');
    
    if (state !== storedState) {
      throw new Error('State mismatch error');
    }

    try {
      const tokenEndpoint = 'https://accounts.spotify.com/api/token';

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret
      });

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Token exchange error:', errorData);
        
        if (response.status === 400 && errorData.error === 'invalid_client') {
          throw new Error('Invalid client configuration. Please check Spotify app settings.');
        }
        if (response.status === 400 && errorData.error === 'invalid_grant') {
          throw new Error('Invalid authorization code. Please try logging in again.');
        }
        if (response.status === 400 && errorData.error === 'redirect_uri_mismatch') {
          throw new Error('Redirect URI mismatch. Expected: https://stupendous-paprenjak-1053a3.netlify.app/callback');
        }
        
        throw new Error(`Authentication failed: ${errorData.error_description || response.status}`);
      }

      const tokens = await response.json();
      this.storeTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Spotify authentication error:', error);
      throw error;
    }
  }

  // Store tokens securely
  private storeTokens(tokens: SpotifyTokens): void {
    const expiresAt = Date.now() + (tokens.expires_in * 1000);
    localStorage.setItem('spotify_access_token', tokens.access_token);
    localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
    localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
  }

  // Get stored access token
  private getAccessToken(): string | null {
    const token = localStorage.getItem('spotify_access_token');
    const expiresAt = localStorage.getItem('spotify_token_expires_at');
    
    if (!token || !expiresAt) return null;
    
    if (Date.now() > parseInt(expiresAt)) {
      this.refreshAccessToken();
      return localStorage.getItem('spotify_access_token');
    }
    
    return token;
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenEndpoint = window.location.hostname === 'localhost' 
      ? '/api/spotify/refresh' 
      : 'https://spotify-token-exchange.vercel.app/api/refresh';

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        client_id: this.clientId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const tokens = await response.json();
    this.storeTokens({ ...tokens, refresh_token: refreshToken });
  }

  // Make authenticated API request
  private async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = this.getAccessToken();
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      await this.refreshAccessToken();
      return this.apiRequest(endpoint, options);
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expires_at');
    localStorage.removeItem('spotify_auth_state');
  }

  // Get current user profile
  async getCurrentUser(): Promise<SpotifyUser> {
    return this.apiRequest('/me');
  }

  // Get user playlists
  async getUserPlaylists(limit: number = 20, offset: number = 0): Promise<{ items: SpotifyPlaylist[]; total: number }> {
    return this.apiRequest(`/me/playlists?limit=${limit}&offset=${offset}`);
  }

  // Get user's top tracks
  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<{ items: SpotifyTrack[] }> {
    return this.apiRequest(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  }

  // Get user's top artists
  async getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<{ items: SpotifyArtist[] }> {
    return this.apiRequest(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
  }

  // Search for tracks, artists, albums, playlists
  async search(query: string, type: string[] = ['track'], limit: number = 20): Promise<any> {
    // Trim whitespace and handle empty queries
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      throw new Error('Search query cannot be empty');
    }

    // Log search attempt for debugging
    console.log('Spotify Search:', { originalQuery: query, trimmedQuery, type, limit });

    const typeString = type.join(',');
    const encodedQuery = encodeURIComponent(trimmedQuery);
    
    try {
      const results = await this.apiRequest(`/search?q=${encodedQuery}&type=${typeString}&limit=${limit}`);
      
      // Log results for debugging
      console.log('Search Results:', {
        query: trimmedQuery,
        tracksFound: results.tracks?.items?.length || 0,
        artistsFound: results.artists?.items?.length || 0,
        playlistsFound: results.playlists?.items?.length || 0
      });
      
      return results;
    } catch (error) {
      console.error('Search API Error:', error);
      throw error;
    }
  }

  // Enhanced search with fallbacks and partial matching
  async searchWithFallbacks(query: string, type: string[] = ['track'], limit: number = 20): Promise<{
    results: any;
    fallbackUsed: boolean;
    fallbackType?: string;
    message?: string;
  }> {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      return {
        results: { tracks: { items: [] }, artists: { items: [] }, playlists: { items: [] } },
        fallbackUsed: false,
        message: 'Please enter a search term'
      };
    }

    try {
      // First attempt: exact search
      let results = await this.search(trimmedQuery, type, limit);
      
      // Check if we got meaningful results
      const hasResults = (results.tracks?.items?.length > 0) || 
                        (results.artists?.items?.length > 0) || 
                        (results.playlists?.items?.length > 0);
      
      if (hasResults) {
        return { results, fallbackUsed: false };
      }

      // Second attempt: try with wildcard for partial matching
      console.log('No exact results, trying partial match...');
      const partialQuery = `${trimmedQuery}*`;
      results = await this.search(partialQuery, type, limit);
      
      const hasPartialResults = (results.tracks?.items?.length > 0) || 
                               (results.artists?.items?.length > 0) || 
                               (results.playlists?.items?.length > 0);
      
      if (hasPartialResults) {
        return { 
          results, 
          fallbackUsed: true, 
          fallbackType: 'partial',
          message: 'Showing partial matches for your search'
        };
      }

      // Third attempt: try individual words
      const words = trimmedQuery.split(' ').filter(word => word.length > 2);
      if (words.length > 1) {
        console.log('Trying individual words:', words);
        const wordQuery = words.join(' OR ');
        results = await this.search(wordQuery, type, limit);
        
        const hasWordResults = (results.tracks?.items?.length > 0) || 
                              (results.artists?.items?.length > 0) || 
                              (results.playlists?.items?.length > 0);
        
        if (hasWordResults) {
          return { 
            results, 
            fallbackUsed: true, 
            fallbackType: 'words',
            message: 'Showing results matching some of your search terms'
          };
        }
      }

      // Final fallback: popular Indian/Bollywood tracks
      console.log('No results found, using Indian music fallback...');
      const fallbackResults = await this.getIndianMusicFallback(type, limit);
      
      return {
        results: fallbackResults,
        fallbackUsed: true,
        fallbackType: 'indian',
        message: 'No exact matches found. Here are some popular Indian tracks you might enjoy'
      };

    } catch (error) {
      console.error('Search with fallbacks failed:', error);
      
      // Emergency fallback
      try {
        const emergencyResults = await this.getIndianMusicFallback(type, Math.min(limit, 10));
        return {
          results: emergencyResults,
          fallbackUsed: true,
          fallbackType: 'emergency',
          message: 'Search temporarily unavailable. Here are some popular tracks'
        };
      } catch (emergencyError) {
        console.error('Emergency fallback failed:', emergencyError);
        throw new Error('Search service temporarily unavailable');
      }
    }
  }

  // Get popular Indian/Bollywood music as fallback
  private async getIndianMusicFallback(type: string[] = ['track'], limit: number = 20): Promise<any> {
    const indianQueries = [
      'bollywood hits',
      'indian classical',
      'hindi songs',
      'ar rahman',
      'lata mangeshkar',
      'kishore kumar',
      'arijit singh',
      'shreya ghoshal'
    ];
    
    // Try each query until we get results
    for (const query of indianQueries) {
      try {
        const results = await this.search(query, type, Math.ceil(limit / 2));
        if (results.tracks?.items?.length > 0) {
          return results;
        }
      } catch (error) {
        console.warn(`Fallback query "${query}" failed:`, error);
        continue;
      }
    }
    
    // If all Indian queries fail, try generic popular music
    return await this.search('popular music', type, limit);
  }

  // Get recommendations based on seed tracks, artists, or genres
  async getRecommendations(params: {
    seed_tracks?: string[];
    seed_artists?: string[];
    seed_genres?: string[];
    limit?: number;
    target_energy?: number;
    target_valence?: number;
    target_danceability?: number;
  }): Promise<{ tracks: SpotifyTrack[] }> {
    const searchParams = new URLSearchParams();
    
    if (params.seed_tracks) searchParams.append('seed_tracks', params.seed_tracks.join(','));
    if (params.seed_artists) searchParams.append('seed_artists', params.seed_artists.join(','));
    if (params.seed_genres) searchParams.append('seed_genres', params.seed_genres.join(','));
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.target_energy) searchParams.append('target_energy', params.target_energy.toString());
    if (params.target_valence) searchParams.append('target_valence', params.target_valence.toString());
    if (params.target_danceability) searchParams.append('target_danceability', params.target_danceability.toString());

    return this.apiRequest(`/recommendations?${searchParams.toString()}`);
  }

  // Get playlist tracks
  async getPlaylistTracks(playlistId: string, limit: number = 50, offset: number = 0): Promise<{ items: Array<{ track: SpotifyTrack }> }> {
    return this.apiRequest(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`);
  }

  // Get recently played tracks
  async getRecentlyPlayed(limit: number = 20): Promise<{ items: Array<{ track: SpotifyTrack; played_at: string }> }> {
    return this.apiRequest(`/me/player/recently-played?limit=${limit}`);
  }

  // Get available genres for recommendations
  async getAvailableGenres(): Promise<{ genres: string[] }> {
    return this.apiRequest('/recommendations/available-genre-seeds');
  }

  // Web Playback SDK methods
  initializeWebPlayback(onReady: (device_id: string) => void, onStateChange: (state: any) => void): void {
    if (!window.Spotify) {
      // Load Spotify SDK if not already loaded
      this.loadSpotifySDK().then(() => {
        this.setupPlayer(onReady, onStateChange);
      });
      return;
    }

    this.setupPlayer(onReady, onStateChange);
  }

  private async loadSpotifySDK(): Promise<void> {
    return new Promise((resolve) => {
      if (window.Spotify) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve();
      };
      
      document.head.appendChild(script);
    });
  }

  private setupPlayer(onReady: (device_id: string) => void, onStateChange: (state: any) => void): void {
    const token = this.getAccessToken();
    if (!token) {
      console.error('No access token for playback');
      return;
    }

    const player = new window.Spotify.Player({
      name: 'FocusFlow Player',
      getOAuthToken: (cb: (token: string) => void) => {
        const currentToken = this.getAccessToken();
        if (currentToken) {
          cb(currentToken);
        }
      },
      volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      onReady(device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Player state changed
    player.addListener('player_state_changed', (state: any) => {
      if (!state) return;
      onStateChange(state);
    });

    // Connect to the player
    player.connect();

    // Store player instance
    (window as any).spotifyPlayer = player;
  }

  // Play a track using Web Playback SDK
  async playTrack(deviceId: string, uris: string[], position?: number): Promise<void> {
    const body: any = {
      uris,
      device_ids: [deviceId]
    };

    if (position !== undefined) {
      body.position_ms = position;
    }

    await this.apiRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  // Pause playback
  async pausePlayback(deviceId: string): Promise<void> {
    await this.apiRequest(`/me/player/pause?device_id=${deviceId}`, {
      method: 'PUT'
    });
  }

  // Resume playback
  async resumePlayback(deviceId: string): Promise<void> {
    await this.apiRequest(`/me/player/play?device_id=${deviceId}`, {
      method: 'PUT'
    });
  }

  // Skip to next track
  async skipToNext(deviceId: string): Promise<void> {
    await this.apiRequest(`/me/player/next?device_id=${deviceId}`, {
      method: 'POST'
    });
  }

  // Skip to previous track
  async skipToPrevious(deviceId: string): Promise<void> {
    await this.apiRequest(`/me/player/previous?device_id=${deviceId}`, {
      method: 'POST'
    });
  }

  // Set volume
  async setVolume(deviceId: string, volume: number): Promise<void> {
    await this.apiRequest(`/me/player/volume?volume_percent=${Math.round(volume * 100)}&device_id=${deviceId}`, {
      method: 'PUT'
    });
  }
}

export const spotifyService = new SpotifyService();
export type { SpotifyUser, SpotifyPlaylist, SpotifyTrack, SpotifyArtist };