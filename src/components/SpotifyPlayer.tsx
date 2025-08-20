// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Play, 
//   Pause, 
//   SkipForward, 
//   SkipBack, 
//   Volume2, 
//   Search, 
//   Heart, 
//   List, 
//   TrendingUp, 
//   Headphones, 
//   AlertCircle, 
//   Smartphone, 
//   Music,
//   ExternalLink,
//   User
// } from 'lucide-react';
// import { useSpotifyStore } from '../store/spotify';
// import { SpotifyTrack, SpotifyPlaylist } from '../services/spotify';

// export function SpotifyPlayer() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeTab, setActiveTab] = useState<'search' | 'playlists' | 'top' | 'recommendations'>('search');
//   const [showPlayer, setShowPlayer] = useState(true);
//   const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
//   const [userHasPremium, setUserHasPremium] = useState<boolean | null>(null);

//   const {
//     isAuthenticated,
//     user,
//     playlists,
//     topTracks,
//     searchResults,
//     recommendations,
//     currentTrack,
//     isPlaying,
//     volume,
//     loading,
//     login,
//     logout,
//     fetchPlaylists,
//     fetchTopTracks,
//     fetchRecommendations,
//     search,
//     initializePlayer,
//     playTrack,
//     pauseTrack,
//     resumeTrack,
//     skipNext,
//     skipPrevious,
//     setVolume,
//   } = useSpotifyStore();

//   useEffect(() => {
//     if (isAuthenticated && !user) {
//       useSpotifyStore.getState().fetchUserData();
//     }
//   }, [isAuthenticated, user]);

//   useEffect(() => {
//     if (user) {
//       setUserHasPremium(user.product === 'premium');
//     }
//   }, [user]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       initializePlayer();
//       fetchRecommendations();
//     }
//   }, [isAuthenticated]);

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       await search(searchQuery);
//       setActiveTab('search');
//     }
//   };

//   const handleTabChange = async (tab: typeof activeTab) => {
//     setActiveTab(tab);
    
//     switch (tab) {
//       case 'playlists':
//         if (playlists.length === 0) {
//           await fetchPlaylists();
//         }
//         break;
//       case 'top':
//         if (topTracks.length === 0) {
//           await fetchTopTracks(timeRange);
//         }
//         break;
//       case 'recommendations':
//         if (recommendations.length === 0) {
//           await fetchRecommendations();
//         }
//         break;
//     }
//   };

//   const formatDuration = (ms: number) => {
//     const minutes = Math.floor(ms / 60000);
//     const seconds = Math.floor((ms % 60000) / 1000);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const handlePlayTrack = async (track: SpotifyTrack) => {
//     if (userHasPremium) {
//       if (currentTrack?.id === track.id) {
//         if (isPlaying) {
//           await pauseTrack();
//         } else {
//           await resumeTrack();
//         }
//       } else {
//         await playTrack(track);
//       }
//     } else {
//       // For free users, open in Spotify app
//       openInSpotifyApp(track.external_urls.spotify);
//     }
//   };

//   const openInSpotifyApp = (spotifyUrl: string) => {
//     // Try to open in Spotify app first, fallback to web
//     const spotifyAppUrl = spotifyUrl.replace('https://open.spotify.com/', 'spotify:');
    
//     // Create a temporary link to try opening the app
//     const link = document.createElement('a');
//     link.href = spotifyAppUrl;
//     link.click();
    
//     // Fallback to web version after a short delay
//     setTimeout(() => {
//       window.open(spotifyUrl, '_blank');
//     }, 1000);
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="bg-gradient-to-br from-green-900 via-black to-green-800 rounded-2xl p-6 text-white">
//         <div className="text-center">
//           <div className="flex items-center justify-center mb-4">
//             <Headphones className="text-green-400 mr-3" size={32} />
//             <h3 className="text-2xl font-bold">Spotify Integration</h3>
//           </div>
//           <p className="text-white/80 mb-6">
//             Connect your Spotify account to access your playlists, top tracks, and get personalized music recommendations for studying.
//           </p>
//           <p className="text-green-400 text-sm mb-6">
//             🎵 Premium users can enjoy in-browser playback!
//           </p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={login}
//             className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center mx-auto"
//           >
//             <Music className="mr-2" size={20} />
//             Connect Spotify
//           </motion.button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-green-900 via-black to-green-800 rounded-2xl p-6 text-white">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center">
//           <Headphones className="text-green-400 mr-3" size={24} />
//           <div>
//             <h3 className="text-lg font-semibold">Spotify Player</h3>
//             {user && (
//               <div className="flex items-center space-x-2">
//                 <img 
//                   src={user.images?.[0]?.url || '/default-avatar.png'} 
//                   alt={user.display_name}
//                   className="w-6 h-6 rounded-full"
//                 />
//                 <p className="text-white/70 text-sm">{user.display_name}</p>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setShowPlayer(!showPlayer)}
//             className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
//           >
//             <Music size={18} />
//           </button>
//           <button
//             onClick={logout}
//             className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
//           >
//             <User size={18} />
//           </button>
//         </div>
//       </div>

//       {/* Search */}
//       <form onSubmit={handleSearch} className="mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search for songs, artists, or albums..."
//             className="w-full pl-10 pr-4 py-3 bg-white/20 rounded-xl text-white placeholder-white/60 border border-white/30 focus:border-green-400 focus:outline-none"
//           />
//         </div>
//       </form>

//       {/* Tabs */}
//       <div className="flex space-x-1 mb-6 bg-white/10 rounded-xl p-1">
//         {[
//           { id: 'search', label: 'Search', icon: Search },
//           { id: 'playlists', label: 'Playlists', icon: List },
//           { id: 'top', label: 'Top Tracks', icon: TrendingUp },
//           { id: 'recommendations', label: 'For You', icon: Heart },
//         ].map(({ id, label, icon: Icon }) => (
//           <button
//             key={id}
//             onClick={() => handleTabChange(id as typeof activeTab)}
//             className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
//               activeTab === id
//                 ? 'bg-green-500 text-white'
//                 : 'text-white/70 hover:text-white hover:bg-white/10'
//             }`}
//           >
//             <Icon size={16} className="mr-1" />
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* Content */}
//       <div className="max-h-64 overflow-y-auto space-y-2">
//         {/* Premium Status Notice */}
//         {userHasPremium === false && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-orange-500/20 border border-orange-400/50 rounded-xl p-3 mb-4"
//           >
//             <div className="flex items-center text-orange-300 text-sm">
//               <AlertCircle size={16} className="mr-2 flex-shrink-0" />
//               <div>
//                 <p className="font-medium">🔒 In-browser playback requires Spotify Premium</p>
//                 <p className="text-xs text-orange-200 mt-1">
//                   Click tracks to open in your Spotify app instead
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* Search Results */}
//         {activeTab === 'search' && (
//           <AnimatePresence>
//             {loading.search ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
//               </div>
//             ) : searchResults.tracks.length > 0 ? (
//               searchResults.tracks.map((track, index) => (
//                 <TrackItem
//                   key={track.id}
//                   track={track}
//                   index={index}
//                   isCurrentTrack={currentTrack?.id === track.id}
//                   isPlaying={isPlaying}
//                   userHasPremium={userHasPremium}
//                   onPlay={() => handlePlayTrack(track)}
//                   onOpenInApp={() => openInSpotifyApp(track.external_urls.spotify)}
//                 />
//               ))
//             ) : searchQuery ? (
//               <div className="text-center py-8 text-white/60">
//                 No results found for "{searchQuery}"
//               </div>
//             ) : (
//               <div className="text-center py-8 text-white/60">
//                 Search for your favorite study music
//               </div>
//             )}
//           </AnimatePresence>
//         )}

//         {/* Playlists */}
//         {activeTab === 'playlists' && (
//           <AnimatePresence>
//             {loading.playlists ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
//               </div>
//             ) : (
//               playlists.map((playlist, index) => (
//                 <PlaylistItem key={playlist.id} playlist={playlist} index={index} />
//               ))
//             )}
//           </AnimatePresence>
//         )}

//         {/* Top Tracks */}
//         {activeTab === 'top' && (
//           <>
//             <div className="flex space-x-2 mb-4">
//               {[
//                 { id: 'short_term', label: '4 Weeks' },
//                 { id: 'medium_term', label: '6 Months' },
//                 { id: 'long_term', label: 'All Time' }
//               ].map(({ id, label }) => (
//                 <button
//                   key={id}
//                   onClick={() => {
//                     setTimeRange(id as typeof timeRange);
//                     fetchTopTracks(id as typeof timeRange);
//                   }}
//                   className={`px-3 py-1 rounded-lg text-xs transition-colors ${
//                     timeRange === id
//                       ? 'bg-green-500 text-white'
//                       : 'bg-white/20 text-white/70 hover:bg-white/30'
//                   }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </div>
//             <AnimatePresence>
//               {loading.topTracks ? (
//                 <div className="flex items-center justify-center py-8">
//                   <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
//                 </div>
//               ) : (
//                 topTracks.map((track, index) => (
//                   <TrackItem
//                     key={track.id}
//                     track={track}
//                     index={index}
//                     isCurrentTrack={currentTrack?.id === track.id}
//                     isPlaying={isPlaying}
//                     userHasPremium={userHasPremium}
//                     onPlay={() => handlePlayTrack(track)}
//                     onOpenInApp={() => openInSpotifyApp(track.external_urls.spotify)}
//                   />
//                 ))
//               )}
//             </AnimatePresence>
//           </>
//         )}

//         {/* Recommendations */}
//         {activeTab === 'recommendations' && (
//           <AnimatePresence>
//             {loading.recommendations ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
//               </div>
//             ) : (
//               recommendations.map((track, index) => (
//                 <TrackItem
//                   key={track.id}
//                   track={track}
//                   index={index}
//                   isCurrentTrack={currentTrack?.id === track.id}
//                   isPlaying={isPlaying}
//                   userHasPremium={userHasPremium}
//                   onPlay={() => handlePlayTrack(track)}
//                 />
//               ))
//             )}
//           </AnimatePresence>
//         )}
//       </div>

//       {/* Current Track & Controls */}
//       <AnimatePresence>
//         {currentTrack && showPlayer && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="mt-6 pt-6 border-t border-white/20"
//           >
//             <div className="flex items-center space-x-3 mb-4">
//               {currentTrack.album.images[0] && (
//                 <img
//                   src={currentTrack.album.images.url}
//                   alt={currentTrack.album.name}
//                   className="w-16 h-16 rounded-lg object-cover shadow-lg"
//                 />
//               )}
//               <div className="flex-1 min-w-0">
//                 <h4 className="font-bold text-white text-lg truncate">{currentTrack.name}</h4>
//                 <p className="text-white/80 text-sm truncate mb-1">
//                   {currentTrack.artists.map(artist => artist.name).join(', ')}
//                 </p>
//                 <p className="text-white/60 text-xs truncate">
//                   {currentTrack.album.name}
//                 </p>
//               </div>
//               <a
//                 href={currentTrack.external_urls.spotify}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors"
//               >
//                 <ExternalLink size={18} className="text-green-400" />
//               </a>
//             </div>

//             {/* Controls */}
//             <div className="flex items-center justify-center space-x-6 mb-6">
//               <button
//                 onClick={skipPrevious}
//                 className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110"
//               >
//                 <SkipBack size={22} />
//               </button>
              
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={isPlaying ? pauseTrack : resumeTrack}
//                 className="p-4 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-lg"
//               >
//                 {isPlaying ? <Pause size={28} /> : <Play size={28} />}
//               </motion.button>
              
//               <button
//                 onClick={skipNext}
//                 className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all hover:scale-110"
//               >
//                 <SkipForward size={22} />
//               </button>
//             </div>

//             {/* Volume Control */}
//             <div className="flex items-center space-x-4">
//               <Volume2 size={18} className="text-white/70" />
//               <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.01"
//                 value={volume}
//                 onChange={(e) => setVolume(parseFloat(e.target.value))}
//                 className="flex-1 h-2 bg-white/20 rounded-lg appearance-none slider"
//               />
//               <span className="text-white/70 text-sm w-10 text-right">{Math.round(volume * 100)}%</span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // Track Item Component
// function TrackItem({ 
//   track, 
//   index, 
//   isCurrentTrack, 
//   isPlaying, 
//   userHasPremium,
//   onPlay,
//   onOpenInApp
// }: { 
//   track: SpotifyTrack; 
//   index: number; 
//   isCurrentTrack: boolean; 
//   isPlaying: boolean; 
//   userHasPremium: boolean | null;
//   onPlay: () => void; 
//   onOpenInApp?: () => void;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: index * 0.05 }}
//       className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
//         isCurrentTrack
//           ? 'bg-green-500/20 border border-green-400/50 shadow-lg'
//           : 'bg-white/10 hover:bg-white/20'
//       }`}
//     >
//       <div className="relative">
//         {track.album.images[0] ? (
//           <img
//             src={track.album.images.url}
//             alt={track.album.name}
//             className="w-12 h-12 rounded-lg object-cover"
//           />
//         ) : (
//           <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
//             <Music size={16} />
//           </div>
//         )}
//         {isCurrentTrack && userHasPremium && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
//             {isPlaying ? <Pause size={18} className="text-green-400" /> : <Play size={18} className="text-green-400" />}
//           </div>
//         )}
//       </div>
      
//       <div className="flex-1 min-w-0" onClick={onPlay}>
//         <p className="text-sm font-semibold text-white truncate">{track.name}</p>
//         <p className="text-xs text-white/70 truncate">
//           {track.artists.map(artist => artist.name).join(', ')}
//         </p>
//       </div>
      
//       <div className="text-right flex items-center space-x-2">
//         {userHasPremium === false && onOpenInApp && (
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={(e) => {
//               e.stopPropagation();
//               onOpenInApp();
//             }}
//             className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors"
//             title="Open in Spotify App"
//           >
//             <Smartphone size={14} className="text-green-400" />
//           </motion.button>
//         )}
//         <span className="text-xs text-white/70 block">{formatDuration(track.duration_ms)}</span>
//         {isCurrentTrack && userHasPremium && (
//           <span className="text-xs text-green-400">Now Playing</span>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// // Playlist Item Component  
// function PlaylistItem({ playlist, index }: { playlist: SpotifyPlaylist; index: number }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: index * 0.05 }}
//       className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
//     >
//       {playlist.images[0] ? (
//         <img
//           src={playlist.images.url}
//           alt={playlist.name}
//           className="w-12 h-12 rounded-lg object-cover"
//         />
//       ) : (
//         <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
//           <Music size={16} />
//         </div>
//       )}
      
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-white truncate">{playlist.name}</p>
//         <p className="text-xs text-white/70 truncate">
//           {playlist.tracks.total} tracks • {playlist.owner.display_name}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// function formatDuration(ms: number) {
//   const minutes = Math.floor(ms / 60000);
//   const seconds = Math.floor((ms % 60000) / 1000);
//   return `${minutes}:${seconds.toString().padStart(2, '0')}`;
// }


import React from 'react';
import { motion } from 'framer-motion';
import { 
  Construction, 
  Headphones, 
  Clock, 
  Settings,
  Zap
} from 'lucide-react';

export function SpotifyPlayer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Headphones className="text-green-400 mr-3" size={24} />
          <h3 className="text-lg font-semibold">Spotify Player</h3>
        </div>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      {/* Under Construction Content */}
      <div className="text-center py-8">
        {/* Construction Icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="mb-6"
        >
          <Construction size={64} className="mx-auto text-yellow-400" />
        </motion.div>

        {/* Main Message */}
        <h4 className="text-xl font-bold text-white mb-3">
          🚧 Under Construction
        </h4>
        
        <p className="text-green-100 text-sm mb-4 leading-relaxed">
          We're working hard to bring you the best Spotify integration experience! 
          <br />
          Our team is fine-tuning the music player for optimal performance.
        </p>

        {/* Features Coming Soon */}
        <div className="bg-green-800/30 rounded-lg p-4 mb-6">
          <h5 className="text-green-200 font-semibold mb-3 flex items-center justify-center">
            <Zap size={16} className="mr-2" />
            Coming Soon
          </h5>
          <div className="grid grid-cols-1 gap-2 text-xs text-green-100">
            <div className="flex items-center justify-center">
              🎵 Spotify Playlist Integration
            </div>
            <div className="flex items-center justify-center">
              🎧 In-Browser Music Playback
            </div>
            <div className="flex items-center justify-center">
              📊 Personalized Recommendations
            </div>
            <div className="flex items-center justify-center">
              🎚️ Advanced Player Controls
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-green-200 mb-2">
            <span>Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full h-2 bg-green-800/40 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '75%' }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
        </div>

        {/* ETA */}
        <div className="flex items-center justify-center text-sm text-green-200">
          <Clock size={16} className="mr-2" />
          Expected completion: Soon™
        </div>

        {/* Thank You Message */}
        <div className="mt-6 p-3 bg-green-800/20 rounded-lg">
          <p className="text-xs text-green-100">
            Thank you for your patience! In the meantime, enjoy other features of FocusFlow.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default SpotifyPlayer;
