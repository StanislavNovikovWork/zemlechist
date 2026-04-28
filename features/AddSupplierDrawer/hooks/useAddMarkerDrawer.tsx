import { useAddSupplierDrawerStore } from '@/store/addMarkerDrawerStore';

/**
 * Хук для управления drawer поставщиков
 * @returns Объект с функциями управления drawer
 */
export function useSupplierDrawer() {
  return {
    open: useAddSupplierDrawerStore((state: any) => state.open),
    close: useAddSupplierDrawerStore((state: any) => state.close),
    clearCoordinates: useAddSupplierDrawerStore((state: any) => state.clearCoordinates),
    isOpen: useAddSupplierDrawerStore((state: any) => state.isOpen),
  };
}
