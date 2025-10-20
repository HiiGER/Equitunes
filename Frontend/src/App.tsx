import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ProtectedRoute from './components/ProtectedRoute';
import PlayerBar from './components/PlayerBar';
import { usePlayerStore } from './store/playerStore';
import { supabase } from './lib/supabase';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import PaymentPage from './pages/PaymentPage';
import PaymentsHistoryPage from './pages/PaymentsHistoryPage';
import ProfilePage from './pages/ProfilePage';
import PlayerPage from './pages/PlayerPage';

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const userRequestedPlayRef = useRef(false);
  const lastLoggedRef = useRef<{ trackId: string | null; t: number }>({ trackId: null, t: 0 });
  
  const {
    currentTrack,
    isPlaying,
    volume,
    setIsPlaying,
    setVolume,
    setCurrentTime,
    setDuration,
    playNext,
    playPrevious,
  } = usePlayerStore();

  const logPlayHistory = async (trackId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from('play_history').insert({
        track_id: trackId,
        user_id: user.id,
      });
    } catch (error) {
      console.error('Error logging play history:', error);
      if ((error as any)?.error) console.error('Supabase error detail:', (error as any).error);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        if (userRequestedPlayRef.current) {
          audioRef.current
            .play()
            .then(() => {
              userRequestedPlayRef.current = false;
            })
            .catch(() => {
              userRequestedPlayRef.current = false;
              setIsPlaying(false);
            });
        } else {
          setIsPlaying(false);
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, setIsPlaying]);

  const handlePlayPause = () => {
    userRequestedPlayRef.current = true;
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    userRequestedPlayRef.current = true;
    playNext();
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
        {currentTrack && (
          <>
            <PlayerBar
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              volume={volume}
              audioRef={audioRef}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={playPrevious}
              onVolumeChange={setVolume}
            />
            <audio
              ref={audioRef}
              src={currentTrack.file_url}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  const ct = audioRef.current.currentTime;
                  setCurrentTime(ct);

                  const trackId = currentTrack?.id;
                  if (trackId) {
                    const now = Date.now();
                    if (!(lastLoggedRef.current.trackId === trackId && now - lastLoggedRef.current.t < 8000)) {
                      if (Math.floor(ct) >= 5) {
                        lastLoggedRef.current = { trackId, t: now };
                        logPlayHistory(trackId);
                      }
                    }
                  }
                }
              }}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setDuration(audioRef.current.duration);
                }
              }}
              onEnded={handleNext}
            />
          </>
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <MarketplacePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute>
                <SubscriptionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentsHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/player"
            element={
              <ProtectedRoute>
                <PlayerPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
