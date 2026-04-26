import { useAddMarkerDrawerStore } from '@/store/addMarkerDrawerStore';

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
