import { create } from 'zustand';

interface AddMarkerDrawerStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useAddMarkerDrawerStore = create<AddMarkerDrawerStore>((set: any) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

/**
 * Хук для управления drawer добавления маркера
 * @returns Объект с функциями управления drawer
 */
export function useAddMarkerDrawer() {
  return {
    open: useAddMarkerDrawerStore((state: any) => state.open),
    close: useAddMarkerDrawerStore((state: any) => state.close),
    isOpen: useAddMarkerDrawerStore((state: any) => state.isOpen),
  };
}

export { useAddMarkerDrawerStore };
