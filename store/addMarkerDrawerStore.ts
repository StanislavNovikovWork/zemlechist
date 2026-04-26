import { create } from 'zustand';

interface AddMarkerDrawerStore {
  isOpen: boolean;
  coordinates: [number, number] | null;
  onSuccess?: () => void;
  open: (coordinates?: [number, number], onSuccess?: () => void) => void;
  close: () => void;
}

export const useAddMarkerDrawerStore = create<AddMarkerDrawerStore>((set: any) => ({
  isOpen: false,
  coordinates: null,
  onSuccess: undefined,
  open: (coordinates?: [number, number], onSuccess?: () => void) => set({ isOpen: true, coordinates: coordinates || null, onSuccess }),
  close: () => set({ isOpen: false, coordinates: null, onSuccess: undefined }),
}));
