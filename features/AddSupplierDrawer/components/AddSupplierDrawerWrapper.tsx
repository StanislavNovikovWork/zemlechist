"use client";

import { AddSupplierDrawer } from "./AddSupplierDrawer";
import { useAddSupplierDrawerStore } from "@/store/addMarkerDrawerStore";

/**
 * Компонент-обертка для глобального рендеринга AddSupplierDrawer
 * Подписывается на Zustand store и рендерит drawer
 */
export function AddSupplierDrawerWrapper() {
  const isOpen = useAddSupplierDrawerStore((state: any) => state.isOpen);
  const close = useAddSupplierDrawerStore((state: any) => state.close);

  return (
    <AddSupplierDrawer
      open={isOpen}
      onClose={close}
    />
  );
}
