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
  product?: string; // Add this for premium check
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
  private redirectUri = 'https://stupendous-paprenjak-1053a3.netlify.app/';
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

      // ✅ Use Basic Auth header instead of body parameters
      const credentials = btoa(`${this.clientId}:${this.clientSecret}`);

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri
      });

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Token exchange error:', errorData);
        
        // ✅ Better error handling with specific messages
        if (response.status === 400) {
          if (errorData.error === 'invalid_grant') {
            throw new Error('Invalid authorization code. Please try connecting again.');
          }
          if (errorData.error === 'invalid_client') {
            throw new Error('Invalid client configuration. Check Spotify app settings.');
          }
          if (errorData.error === 'redirect_uri_mismatch') {
            throw new Error(`Redirect URI mismatch. Expected: ${this.redirectUri}`);
          }
        }
        
        throw new Error(`Authentication failed: ${errorData.error_description || errorData.error || response.status}`);
      }

      const tokens = await response.json();
      this.storeTokens(tokens);
      
      // ✅ Clean up state after successful exchange
      localStorage.removeItem('spotify_auth_state');
      
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
    if (tokens.refresh_token) {
      localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
    }
    localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
  }

  // Get stored access token
  private getAccessToken(): string | null {
    const token = localStorage.getItem('spotify_access_token');
    const expiresAt = localStorage.getItem('spotify_token_expires_at');
    
    if (!token || !expiresAt) return null;
    
    if (Date.now() > parseInt(expiresAt)) {
      // ✅ Return null if expired, let calling code handle refresh
      return null;
    }
    
    return token;
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const credentials = btoa(`${this.clientId}:${this.clientSecret}`);

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Token refresh error:', errorData);
      
      // ✅ If refresh fails, clear tokens and require re-auth
      this.logout();
      throw new Error('Session expired. Please reconnect to Spotify.');
    }

    const tokens = await response.json();
    this.storeTokens({ ...tokens, refresh_token: refreshToken });
  }

  // Make authenticated API request
  private async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    let token = this.getAccessToken();
    
    // ✅ If token is expired, try to refresh it first
    if (!token) {
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      if (refreshToken) {
        try {
          await this.refreshAccessToken();
          token = this.getAccessToken();
        } catch (error) {
          throw new Error('Authentication required. Please connect to Spotify.');
        }
      }
    }

    if (!token) {
      throw new Error('No access token available. Please connect to Spotify.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // ✅ Handle 401 with retry
    if (response.status === 401) {
      try {
        await this.refreshAccessToken();
        const newToken = this.getAccessToken();
        
        if (!newToken) {
          throw new Error('Failed to refresh token');
        }

        // Retry the request with new token
        const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
            ...options.headers
          }
        });

        if (!retryResponse.ok) {
          throw new Error(`Spotify API error: ${retryResponse.status}`);
        }

        return retryResponse.json();
      } catch (error) {
        this.logout();
        throw new Error('Session expired. Please reconnect to Spotify.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Spotify API error:', errorData);
      throw new Error(`Spotify API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
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

  // Search for tracks, artists, albums, playlists
  async search(query: string, type: string[] = ['track'], limit: number = 20): Promise<any> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      throw new Error('Search query cannot be empty');
    }

    const typeString = type.join(',');
    const encodedQuery = encodeURIComponent(trimmedQuery);
    
    try {
      return await this.apiRequest(`/search?q=${encodedQuery}&type=${typeString}&limit=${limit}`);
    } catch (error) {
      console.error('Search API Error:', error);
      throw error;
    }
  }

  // Get recommendations
  async getRecommendations(params: {
    seed_tracks?: string[];
    seed_artists?: string[];
    seed_genres?: string[];
    limit?: number;
  } = {}): Promise<{ tracks: SpotifyTrack[] }> {
    const searchParams = new URLSearchParams();
    
    if (params.seed_tracks) searchParams.append('seed_tracks', params.seed_tracks.join(','));
    if (params.seed_artists) searchParams.append('seed_artists', params.seed_artists.join(','));
    if (params.seed_genres) searchParams.append('seed_genres', params.seed_genres.join(','));
    if (params.limit) searchParams.append('limit', params.limit.toString());

    // Default seeds if none provided
    if (!params.seed_tracks && !params.seed_artists && !params.seed_genres) {
      searchParams.append('seed_genres', 'pop,rock,indie,electronic,hip-hop');
      searchParams.append('limit', '20');
    }

    try {
      return await this.apiRequest(`/recommendations?${searchParams.toString()}`);
    } catch (error) {
      console.error('Recommendations API Error:', error);
      // Return empty results instead of throwing for better UX
      return { tracks: [] };
    }
  }

  // ✅ Get available genres for recommendations
  async getAvailableGenres(): Promise<{ genres: string[] }> {
    try {
      return await this.apiRequest('/recommendations/available-genre-seeds');
    } catch (error) {
      console.error('Available genres API Error:', error);
      // Return default genres if API fails
      return { genres: ['pop', 'rock', 'indie', 'electronic', 'hip-hop', 'jazz', 'classical'] };
    }
  }

  // ✅ Get recently played tracks
  async getRecentlyPlayed(limit: number = 20): Promise<{ items: Array<{ track: SpotifyTrack; played_at: string }> }> {
    return this.apiRequest(`/me/player/recently-played?limit=${limit}`);
  }

  // ✅ Get playlist tracks
  async getPlaylistTracks(playlistId: string, limit: number = 50, offset: number = 0): Promise<{ items: Array<{ track: SpotifyTrack }> }> {
    return this.apiRequest(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`);
  }
}

export const spotifyService = new SpotifyService();
export type { SpotifyUser, SpotifyPlaylist, SpotifyTrack, SpotifyArtist, SpotifyTokens };
