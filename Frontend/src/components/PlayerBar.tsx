import { useLocation } from 'react-router-dom';
import { Volume2, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Track } from '../lib/supabase';

interface PlayerBarProps {
  currentTrack: Track;
  isPlaying: boolean;
  volume: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
}

export default function PlayerBar({ 
  currentTrack, 
  isPlaying, 
  volume,
  audioRef,
  onPlayPause, 
  onNext, 
  onPrevious,
  onVolumeChange 
}: PlayerBarProps) {
  const location = useLocation();
  const isVisible = !location.pathname.includes('/player');

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    onVolumeChange(newVolume);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-16 bg-[#1E293B]/95 backdrop-blur-lg border-t border-[#1E3A8A]/30 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3 w-1/3 min-w-0">
            <img
              src={currentTrack.album_art_url}
              alt={currentTrack.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="min-w-0">
              <h3 className="text-[#E2E8F0] text-sm font-semibold truncate">{currentTrack.title}</h3>
              <p className="text-[#94A3B8] text-xs truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={onPrevious}
              className="p-1.5 text-[#E2E8F0] hover:text-[#3B82F6] transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onPlayPause}
              className="p-2 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] rounded-full hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-[#E2E8F0]" />
              ) : (
                <Play className="w-4 h-4 text-[#E2E8F0] ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-1.5 text-[#E2E8F0] hover:text-[#3B82F6] transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 justify-end w-1/3">
            <Volume2 className="w-3.5 h-3.5 text-[#94A3B8]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-20 h-1.5 bg-[#1E3A8A] rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                  volume * 100
                }%, #1E3A8A ${volume * 100}%, #1E3A8A 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
