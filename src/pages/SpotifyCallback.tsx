import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useSpotifyStore } from '../store/spotify';

export function SpotifyCallback() {
  const navigate = useNavigate();
  const { handleCallback, loading, isAuthenticated } = useSpotifyStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    console.log('Callback URL:', window.location.href);
    console.log('Received params:', { code: code?.substring(0, 10) + '...', state, error });

    if (error) {
      setStatus('error');
      if (error === 'access_denied') {
        setErrorMessage('Access denied. You need to grant permission to use Spotify features.');
      } else {
        setErrorMessage(`Spotify authentication error: ${error}`);
      }
      console.error('Spotify authentication error:', error);
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (code && state) {
      console.log('Processing Spotify callback with code:', code.substring(0, 10) + '...');
      handleCallback(code, state).then(() => {
        setStatus('success');
        setTimeout(() => navigate('/'), 2000);
      }).catch((error) => {
        console.error('Callback handling error:', error);
        setStatus('error');
        
        if (error.message.includes('invalid_client')) {
          setErrorMessage('Spotify app configuration error. Please contact support.');
        } else if (error.message.includes('invalid_grant')) {
          setErrorMessage('Authorization expired. Please try connecting again.');
        } else {
          setErrorMessage(error.message || 'Unknown error occurred during authentication');
        }
        
        setTimeout(() => navigate('/'), 3000);
      });
    } else {
      setStatus('error');
      setErrorMessage('Missing authorization parameters. Please try connecting to Spotify again.');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [handleCallback, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-black to-green-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md w-full"
      >
        <div className="flex items-center justify-center mb-6">
          <Music className="text-green-400 mr-3" size={48} />
          <h1 className="text-2xl font-bold text-white">Spotify Integration</h1>
        </div>

        {status === 'error' ? (
          <>
            <XCircle className="text-red-400 mx-auto mb-4" size={64} />
            <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
            <p className="text-white/80 mb-4">
              {errorMessage || 'There was an error connecting to your Spotify account.'}
            </p>
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 mb-4">
              <div className="flex items-center text-red-300 text-sm">
                <AlertCircle size={16} className="mr-2" />
                <span>Redirect URI: https://stupendous-paprenjak-1053a3.netlify.app/callback</span>
              </div>
            </div>
            <p className="text-white/60 text-sm">
              Redirecting you back to the app...
            </p>
          </>
        ) : status === 'loading' ? (
          <>
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Connecting to Spotify</h2>
            <p className="text-white/80">
              Please wait while we set up your music integration...
            </p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
            <h2 className="text-xl font-semibold text-white mb-2">Successfully Connected!</h2>
            <p className="text-white/80 mb-4">
              Your Spotify account has been linked to FocusFlow.
            </p>
            <p className="text-white/60 text-sm">
              Redirecting you back to the app...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Processing...</h2>
            <p className="text-white/80">
              Setting up your Spotify connection...
            </p>
          </>
        )}
        
      </motion.div>
    </div>
  );
}