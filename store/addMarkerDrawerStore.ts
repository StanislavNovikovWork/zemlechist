import { create } from 'zustand';

interface AddMarkerDrawerStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useAddMarkerDrawerStore = create<AddMarkerDrawerStore>((set: any) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
