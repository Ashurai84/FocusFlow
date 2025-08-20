import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { spotifyService, SpotifyUser, SpotifyPlaylist, SpotifyTrack, SpotifyArtist } from '../services/spotify';

interface SpotifyStore {
  // Authentication
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  
  // Data
  playlists: SpotifyPlaylist[];
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  searchResults: {
    tracks: SpotifyTrack[];
    artists: SpotifyArtist[];
    playlists: SpotifyPlaylist[];
  };
  searchFallback: {
    used: boolean;
    type?: string;
    message?: string;
  };
  recommendations: SpotifyTrack[];
  
  // Playback
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  deviceId: string | null;
  volume: number;
  position: number;
  duration: number;
  
  // Loading states
  loading: {
    auth: boolean;
    playlists: boolean;
    topTracks: boolean;
    topArtists: boolean;
    search: boolean;
    recommendations: boolean;
  };
  
  // Actions
  login: () => void;
  handleCallback: (code: string, state: string) => Promise<void>;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  fetchTopTracks: (timeRange?: 'short_term' | 'medium_term' | 'long_term') => Promise<void>;
  fetchTopArtists: (timeRange?: 'short_term' | 'medium_term' | 'long_term') => Promise<void>;
  search: (query: string, type?: string[]) => Promise<void>;
  fetchRecommendations: (params?: any) => Promise<void>;
  
  // Playback actions
  initializePlayer: () => void;
  playTrack: (track: SpotifyTrack) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  skipNext: () => Promise<void>;
  skipPrevious: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  updatePlaybackState: (state: any) => void;
}

export const useSpotifyStore = create<SpotifyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      playlists: [],
      topTracks: [],
      topArtists: [],
      searchResults: { tracks: [], artists: [], playlists: [] },
      searchFallback: { used: false },
      recommendations: [],
      currentTrack: null,
      isPlaying: false,
      deviceId: null,
      volume: 0.5,
      position: 0,
      duration: 0,
      loading: {
        auth: false,
        playlists: false,
        topTracks: false,
        topArtists: false,
        search: false,
        recommendations: false,
      },

      // Authentication actions
      login: () => {
        const authUrl = spotifyService.getAuthUrl();
        window.location.href = authUrl;
      },

      handleCallback: async (code: string, state: string) => {
        set((state) => ({ loading: { ...state.loading, auth: true } }));
        try {
          await spotifyService.exchangeCodeForToken(code, state);
          set({ isAuthenticated: true });
          await get().fetchUserData();
          await get().fetchRecommendations();
        } catch (error) {
          console.error('Authentication error:', error);
          set({ isAuthenticated: false });
        } finally {
          set((state) => ({ loading: { ...state.loading, auth: false } }));
        }
      },

      logout: () => {
        spotifyService.logout();
        set({
          isAuthenticated: false,
          user: null,
          playlists: [],
          topTracks: [],
          topArtists: [],
          searchResults: { tracks: [], artists: [], playlists: [] },
          recommendations: [],
          currentTrack: null,
          isPlaying: false,
          deviceId: null,
        });
      },

      // Data fetching actions
      fetchUserData: async () => {
        try {
          const user = await spotifyService.getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          if (error.message.includes('401')) {
            set({ isAuthenticated: false, user: null });
          }
        }
      },

      fetchPlaylists: async () => {
        set((state) => ({ loading: { ...state.loading, playlists: true } }));
        try {
          const response = await spotifyService.getUserPlaylists(50);
          set({ playlists: response.items });
        } catch (error) {
          console.error('Failed to fetch playlists:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, playlists: false } }));
        }
      },

      fetchTopTracks: async (timeRange = 'medium_term') => {
        set((state) => ({ loading: { ...state.loading, topTracks: true } }));
        try {
          const response = await spotifyService.getTopTracks(timeRange, 50);
          set({ topTracks: response.items });
        } catch (error) {
          console.error('Failed to fetch top tracks:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, topTracks: false } }));
        }
      },

      fetchTopArtists: async (timeRange = 'medium_term') => {
        set((state) => ({ loading: { ...state.loading, topArtists: true } }));
        try {
          const response = await spotifyService.getTopArtists(timeRange, 50);
          set({ topArtists: response.items });
        } catch (error) {
          console.error('Failed to fetch top artists:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, topArtists: false } }));
        }
      },

      search: async (query: string, type = ['track', 'artist', 'playlist']) => {
        if (!query.trim()) {
          set({
            searchResults: {
              tracks: [],
              artists: [],
              playlists: [],
            }
          });
          return;
        }
        
        set((state) => ({ loading: { ...state.loading, search: true } }));
        try {
          const response = await spotifyService.searchWithFallbacks(query, type);
          set({
            searchResults: {
              tracks: response.results.tracks?.items || [],
              artists: response.results.artists?.items || [],
              playlists: response.results.playlists?.items || [],
            },
            searchFallback: {
              used: response.fallbackUsed,
              type: response.fallbackType,
              message: response.message
            }
          });
        } catch (error) {
          console.error('Search failed:', error);
          // Set empty results on error
          set({
            searchResults: {
              tracks: [],
              artists: [],
              playlists: [],
            },
            searchFallback: {
              used: true,
              type: 'error',
              message: 'Search temporarily unavailable. Please try again.'
            }
          });
        } finally {
          set((state) => ({ loading: { ...state.loading, search: false } }));
        }
      },

      fetchRecommendations: async (params = {}) => {
        set((state) => ({ loading: { ...state.loading, recommendations: true } }));
        try {
          const defaultParams = {
            seed_genres: ['ambient', 'chill', 'study'],
            limit: 20,
            target_energy: 0.4,
            target_valence: 0.5,
            target_danceability: 0.2,
            target_instrumentalness: 0.8,
            ...params
          };
          const response = await spotifyService.getRecommendations(defaultParams);
          set({ recommendations: response.tracks });
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        } finally {
          set((state) => ({ loading: { ...state.loading, recommendations: false } }));
        }
      },

      // Playback actions
      initializePlayer: () => {
        if (!get().isAuthenticated) return;

        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          spotifyService.initializeWebPlayback(
            (device_id: string) => {
              set({ deviceId: device_id });
              console.log('Spotify player ready with device ID:', device_id);
            },
            (state: any) => {
              get().updatePlaybackState(state);
            }
          );
        }, 1000);
      },

      playTrack: async (track: SpotifyTrack) => {
        const { deviceId } = get();
        if (!deviceId) return;

        try {
          await spotifyService.playTrack(deviceId, [track.uri]);
          set({ currentTrack: track, isPlaying: true });
        } catch (error) {
          console.error('Failed to play track:', error);
        }
      },

      pauseTrack: async () => {
        const { deviceId } = get();
        if (!deviceId) return;

        try {
          await spotifyService.pausePlayback(deviceId);
          set({ isPlaying: false });
        } catch (error) {
          console.error('Failed to pause track:', error);
        }
      },

      resumeTrack: async () => {
        const { deviceId } = get();
        if (!deviceId) return;

        try {
          await spotifyService.resumePlayback(deviceId);
          set({ isPlaying: true });
        } catch (error) {
          console.error('Failed to resume track:', error);
        }
      },

      skipNext: async () => {
        const { deviceId } = get();
        if (!deviceId) return;

        try {
          await spotifyService.skipToNext(deviceId);
        } catch (error) {
          console.error('Failed to skip to next:', error);
        }
      },

      skipPrevious: async () => {
        const { deviceId } = get();
        if (!deviceId) return;

        try {
          await spotifyService.skipToPrevious(deviceId);
        } catch (error) {
          console.error('Failed to skip to previous:', error);
        }
      },

      setVolume: async (volume: number) => {
        const { deviceId } = get();
        if (!deviceId) return;

        try {
          await spotifyService.setVolume(deviceId, volume);
          set({ volume });
        } catch (error) {
          console.error('Failed to set volume:', error);
        }
      },

      updatePlaybackState: (state: any) => {
        if (!state) return;

        const track = state.track_window?.current_track;
        set({
          currentTrack: track ? {
            id: track.id,
            name: track.name,
            artists: track.artists,
            album: track.album,
            duration_ms: track.duration_ms,
            preview_url: null,
            external_urls: { spotify: `https://open.spotify.com/track/${track.id}` },
            uri: track.uri
          } : null,
          isPlaying: !state.paused,
          position: state.position,
          duration: state.duration,
        });
      },
    }),
    {
      name: 'spotify-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        volume: state.volume,
      }),
    }
  )
);