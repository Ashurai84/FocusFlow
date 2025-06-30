import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, ExternalLink, Plus, Play, Pause, SkipForward, Volume2 } from 'lucide-react';

export function SpotifyPlayer() {
  const [spotifyUrl, setSpotifyUrl] = useState(
    localStorage.getItem('spotifyPlaylist') || ''
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const handleSavePlaylist = () => {
    localStorage.setItem('spotifyPlaylist', spotifyUrl);
    setIsEditing(false);
  };

  const openSpotify = () => {
    if (spotifyUrl) {
      window.open(spotifyUrl, '_blank');
    }
  };

  const defaultPlaylists = [
    {
      name: "Lofi Hip Hop",
      url: "https://open.spotify.com/playlist/0weU7zD3LmCExMSXPZt1AN?si=73b57b7d4df0476f"
    },
    {
      name: "Deep Focus",
      url: "https://open.spotify.com/playlist/5jYQ4O9Ii3tQcSbJMtVrk8?si=ed42b955dc164f34"
    },
    {
      name: "Peaceful Piano",
      url: "https://open.spotify.com/playlist/1Dk9SeguLL5qTnjfyX5VnZ?si=75d11e41ba07403c"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Playlist Input */}
      <div className="space-y-2">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <input
              type="text"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="Paste Spotify playlist URL..."
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none text-sm"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSavePlaylist}
                className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
            >
              <Plus size={16} className="mr-1" />
              Add Playlist
            </button>
            {spotifyUrl && (
              <button
                onClick={openSpotify}
                className="flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
              >
                <ExternalLink size={16} className="mr-1" />
                Open
              </button>
            )}
          </div>
        )}
      </div>

      {/* Default Playlists */}
      {!spotifyUrl && (
        <div className="space-y-2">
          <p className="text-white/80 text-xs">Quick Access:</p>
          <div className="grid grid-cols-1 gap-2">
            {defaultPlaylists.map((playlist, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => window.open(playlist.url, '_blank')}
                className="flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
              >
                <span>{playlist.name}</span>
                <ExternalLink size={14} />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Mini Player Controls */}
      <div className="bg-white/10 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white" />}
            </button>
            <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <SkipForward size={16} className="text-white" />
            </button>
          </div>
          <div className="text-white/80 text-xs">
            {isPlaying ? 'Playing...' : 'Paused'}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Volume2 size={14} className="text-white/60" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none slider"
          />
          <span className="text-white/60 text-xs">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
}