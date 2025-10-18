import { create } from 'zustand';
import { Track } from '../lib/supabase';

type PlayerState = {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  setCurrentTrack: (track: Track) => void;
  setPlaylist: (tracks: Track[]) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',

  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  setPlaylist: (tracks) => set({ playlist: tracks }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  cycleRepeat: () => set((state) => ({
    repeat: state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off'
  })),

  playNext: () => {
    const { playlist, currentTrack, shuffle, repeat } = get();
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    let nextIndex: number;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else if (repeat === 'one') {
      nextIndex = currentIndex;
    } else if (currentIndex === playlist.length - 1) {
      nextIndex = repeat === 'all' ? 0 : currentIndex;
    } else {
      nextIndex = currentIndex + 1;
    }

    set({ currentTrack: playlist[nextIndex], isPlaying: true, currentTime: 0 });
  },

  playPrevious: () => {
    const { playlist, currentTrack, currentTime } = get();
    if (!currentTrack || playlist.length === 0) return;

    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;

    set({ currentTrack: playlist[prevIndex], isPlaying: true, currentTime: 0 });
  },
}));
