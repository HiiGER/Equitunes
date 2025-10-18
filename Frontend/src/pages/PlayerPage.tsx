import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase, Track } from '../lib/supabase';
import { usePlayerStore } from '../store/playerStore';

export default function PlayerPage() {
  const location = useLocation();
  const { genreId } = location.state as { genreId: string } || {};
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userRequestedPlayRef = useRef(false);
  const lastLoggedRef = useRef<{ trackId: string | null; t: number }>({ trackId: null, t: 0 });

  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    shuffle,
    repeat,
    setCurrentTrack,
    setPlaylist,
    setIsPlaying,
    setVolume,
    setCurrentTime,
    setDuration,
    toggleShuffle,
    cycleRepeat,
    playNext,
    playPrevious,
  } = usePlayerStore();

  useEffect(() => {
    if (genreId) {
      fetchTracks();
    }
  }, [genreId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        // Only attempt play if the user initiated the action recently
        if (userRequestedPlayRef.current) {
          audioRef.current
            .play()
            .then(() => {
              userRequestedPlayRef.current = false;
            })
            .catch(() => {
              // Autoplay blocked - do not spam console with stacktrace
              userRequestedPlayRef.current = false;
              setIsPlaying(false);
            });
        } else {
          // Not a user-initiated play; avoid calling play() to prevent browser autoplay errors
          setIsPlaying(false);
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('genre_id', genreId);

      if (error) throw error;
      if (data) {
        setTracks(data);
        setPlaylist(data);
        if (data.length > 0) {
          setCurrentTrack(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const ct = audioRef.current.currentTime;
      setCurrentTime(ct);

      // Logging: when playback crosses 5s, log once per track (deduped by lastLoggedRef)
      const trackId = currentTrack?.id;
      if (trackId) {
        const now = Date.now();
        // if same track logged within last 8 seconds, skip
        if (!(lastLoggedRef.current.trackId === trackId && now - lastLoggedRef.current.t < 8000)) {
          if (Math.floor(ct) >= 5) {
            lastLoggedRef.current = { trackId, t: now };
            logPlayHistory(trackId);
          }
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const logPlayHistory = async (trackId: string) => {
    try {
      // attach current user id so RLS policies allowing owner inserts pass
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // no authenticated user, skip logging or handle as needed
        return;
      }

      await supabase.from('play_history').insert({
        track_id: trackId,
        user_id: user.id,
      });
    } catch (error) {
      // Supabase client returns an error object; log details for debugging
      console.error('Error logging play history:', error);
      if ((error as any)?.error) console.error('Supabase error detail:', (error as any).error);
    }
  };


  const handleTrackClick = (track: Track) => {
    // user-initiated click: set current track and start playback
    userRequestedPlayRef.current = true;
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  

  if (!genreId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
        <Navbar />
        <div className="pt-24 px-6 pb-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[#E2E8F0]">No genre selected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <Navbar />

      <div className="pt-24 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
              {currentTrack ? (
                <div className="text-center">
                  <div className="w-64 h-64 mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl shadow-[#3B82F6]/20">
                    <img
                      src={currentTrack.album_art_url}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-[#E2E8F0] mb-2">{currentTrack.title}</h2>
                  <p className="text-xl text-[#94A3B8] mb-8">{currentTrack.artist}</p>

                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-[#1E3A8A] rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                          (currentTime / duration) * 100
                        }%, #1E3A8A ${(currentTime / duration) * 100}%, #1E3A8A 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-[#94A3B8] text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-8">
                    <button
                      onClick={toggleShuffle}
                      className={`p-3 rounded-full transition-all ${
                        shuffle ? 'bg-[#3B82F6] text-[#E2E8F0]' : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                      }`}
                    >
                      <Shuffle className="w-5 h-5" />
                    </button>

                    <button
                      onClick={playPrevious}
                      className="p-3 text-[#E2E8F0] hover:text-[#3B82F6] transition-colors"
                    >
                      <SkipBack className="w-6 h-6" />
                    </button>

                    <button
                      onClick={() => {
                        // mark that user requested play so audioRef.play() is allowed
                        userRequestedPlayRef.current = true;
                        setIsPlaying(!isPlaying);
                      }}
                      className="p-6 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] rounded-full hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-[#E2E8F0]" />
                      ) : (
                        <Play className="w-8 h-8 text-[#E2E8F0] ml-1" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        userRequestedPlayRef.current = true;
                        playNext();
                      }}
                      className="p-3 text-[#E2E8F0] hover:text-[#3B82F6] transition-colors"
                    >
                      <SkipForward className="w-6 h-6" />
                    </button>

                    <button
                      onClick={cycleRepeat}
                      className={`p-3 rounded-full transition-all ${
                        repeat !== 'off' ? 'bg-[#3B82F6] text-[#E2E8F0]' : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                      }`}
                    >
                      <Repeat className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-8 justify-center">
                    <Volume2 className="w-5 h-5 text-[#94A3B8]" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-32 h-2 bg-[#1E3A8A] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#94A3B8]">No track selected</p>
                </div>
              )}
            </div>

            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-8 border border-[#1E3A8A]/30">
              <h2 className="text-2xl font-bold text-[#E2E8F0] mb-6">Playlist</h2>
              {loading ? (
                <p className="text-[#94A3B8]">Loading tracks...</p>
              ) : tracks.length === 0 ? (
                <p className="text-[#94A3B8]">No tracks available</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {tracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackClick(track)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${
                        currentTrack?.id === track.id
                          ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/50'
                          : 'bg-[#0B1120]/50 border border-[#1E3A8A]/30 hover:border-[#3B82F6]/30'
                      }`}
                    >
                      <img
                        src={track.album_art_url}
                        alt={track.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-[#E2E8F0] font-semibold">{track.title}</p>
                        <p className="text-[#94A3B8] text-sm">{track.artist}</p>
                      </div>
                      <span className="text-[#94A3B8] text-sm">{formatTime(track.duration)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.file_url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}
    </div>
  );
}
