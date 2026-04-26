"use client";

import { AddMarkerDrawer } from "./AddMarkerDrawer";
import { useAddMarkerDrawerStore } from "../hooks/useAddMarkerDrawer";

/**
 * Компонент-обертка для глобального рендеринга AddMarkerDrawer
 * Подписывается на Zustand store и рендерит drawer
 */
export function AddMarkerDrawerWrapper() {
  const isOpen = useAddMarkerDrawerStore((state: any) => state.isOpen);
  const close = useAddMarkerDrawerStore((state: any) => state.close);

  return (
    <AddMarkerDrawer
      open={isOpen}
      onClose={close}
    />
  );
}
