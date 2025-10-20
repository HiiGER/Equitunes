import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import Navbar from '../components/Navbar';
import PlayerBar from '../components/PlayerBar';
import { supabase, Track } from '../lib/supabase';
import { usePlayerStore } from '../store/playerStore';

export default function PlayerPage() {
  const location = useLocation();
  const { genreId } = location.state as { genreId: string } || {};
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userRequestedPlayRef = useRef(false);
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

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Central play control function
  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    try {
      if (audio.paused) {
        userRequestedPlayRef.current = true;
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Playback error:', error);
      }
      setIsPlaying(false);
    } finally {
      userRequestedPlayRef.current = false;
    }
  };

  // Handle play/pause state changes and audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
    };

    const handleCanPlay = async () => {
      if (userRequestedPlayRef.current && !isPlaying) {
        try {
          await audio.play();
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          }
        } finally {
          userRequestedPlayRef.current = false;
        }
      }
    };

    // Add event listeners
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [isPlaying, setIsPlaying]);

  // Handle track changes and initial setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const wasPlaying = isPlaying;
    const currentPosition = audio.currentTime;
    
    // Update source only if it's different
    if (audio.src !== currentTrack.file_url) {
      audio.src = currentTrack.file_url;
      if (wasPlaying) {
        userRequestedPlayRef.current = true;
      }
    } else {
      // If same track, maintain current position and play state
      audio.currentTime = currentPosition;
      if (wasPlaying && audio.paused) {
        userRequestedPlayRef.current = true;
        audio.play().catch(console.error);
      }
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const newTime = audioRef.current.currentTime;
        setCurrentTime(newTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.volume = volume;
        
        if (currentTime > 0) {
          audio.currentTime = currentTime;
        }
        
        if (isPlaying && audio.paused) {
          userRequestedPlayRef.current = true;
          audio.play().catch(console.error);
        }
      }
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          userRequestedPlayRef.current = true;
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      } else {
        userRequestedPlayRef.current = true;
        playNext();
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [setCurrentTime, volume, repeat, playNext]);

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = Number(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <p className="text-[#E2E8F0]">Tidak ada genre dipilih</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E293B] to-[#0B1120]">
      <Navbar />

      <div className="pt-24 px-4 sm:px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-[#1E3A8A]/30">
              {currentTrack ? (
                <div className="text-center">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-2xl shadow-[#3B82F6]/20">
                    <img
                      src={currentTrack.album_art_url}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#E2E8F0] mb-1 sm:mb-2 truncate px-2">{currentTrack.title}</h2>
                  <p className="text-lg sm:text-xl text-[#94A3B8] mb-6 sm:mb-8 truncate px-2">{currentTrack.artist}</p>

                  <div className="space-y-4 px-2">
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

                  <div className="flex items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8">
                    <button
                      onClick={toggleShuffle}
                      className={`p-2 sm:p-3 rounded-full transition-all ${
                        shuffle ? 'bg-[#3B82F6] text-[#E2E8F0]' : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                      }`}
                    >
                      <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                      onClick={() => {
                        userRequestedPlayRef.current = true;
                        playPrevious();
                      }}
                      className="p-2 sm:p-3 text-[#E2E8F0] hover:text-[#3B82F6] transition-colors"
                    >
                      <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <button
                      onClick={handlePlayPause}
                      className="p-4 sm:p-6 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] rounded-full hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-[#E2E8F0]" />
                      ) : (
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 text-[#E2E8F0] ml-0.5 sm:ml-1" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        userRequestedPlayRef.current = true;
                        playNext();
                      }}
                      className="p-2 sm:p-3 text-[#E2E8F0] hover:text-[#3B82F6] transition-colors"
                    >
                      <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <button
                      onClick={cycleRepeat}
                      className={`p-2 sm:p-3 rounded-full transition-all ${
                        repeat !== 'off' ? 'bg-[#3B82F6] text-[#E2E8F0]' : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                      }`}
                    >
                      <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-6 sm:mt-8 justify-center">
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8]" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-24 sm:w-32 h-2 bg-[#1E3A8A] rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                          volume * 100
                        }%, #1E3A8A ${volume * 100}%, #1E3A8A 100%)`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-[#94A3B8]">Tidak ada lagu dipilih</p>
                </div>
              )}
            </div>

            <div className="bg-[#1E293B]/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-[#1E3A8A]/30">
              <h2 className="text-xl sm:text-2xl font-bold text-[#E2E8F0] mb-4 sm:mb-6">Daftar Putar</h2>
              {loading ? (
                <p className="text-[#94A3B8]">Memuat lagu...</p>
              ) : tracks.length === 0 ? (
                <p className="text-[#94A3B8]">Tidak ada lagu tersedia</p>
              ) : (
                <div className="space-y-2 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
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
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-[#E2E8F0] font-semibold truncate">{track.title}</p>
                        <p className="text-[#94A3B8] text-sm truncate">{track.artist}</p>
                      </div>
                      <span className="text-[#94A3B8] text-sm pl-2">{formatTime(track.duration)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack?.file_url}
      />
      {currentTrack && (
        <PlayerBar 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          volume={volume}
          audioRef={audioRef}
          genreId={genreId}
          onPlayPause={handlePlayPause}
          onNext={() => {
            userRequestedPlayRef.current = true;
            playNext();
          }}
          onPrevious={() => {
            userRequestedPlayRef.current = true;
            playPrevious();
          }}
          onVolumeChange={setVolume}
        />
      )}
    </div>
  );
}
