import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { SupplierWithId } from './supplier.types';


type AddSupplierDrawerState =
  | {
      isOpen: boolean;
      mode: 'create';
      data: null;
    }
  | {
      isOpen: boolean;
      mode: 'edit' | 'view';
      data: SupplierWithId;
    };

type AddSupplierDrawerActions = {
  openCreateSupplier: () => void;
  openEditSupplier: (data: SupplierWithId) => void;
  openViewSupplier: (data: SupplierWithId) => void;
  closeSupplierDrawer: () => void;
  reset: () => void;
};

type AddSupplierDrawerStore =
  AddSupplierDrawerState & AddSupplierDrawerActions;

const initialState: AddSupplierDrawerState = {
  isOpen: false,
  mode: 'create',
  data: null,
};

export const useSupplierDrawerStore = create<AddSupplierDrawerStore>((set) => ({
  ...initialState,

  openCreateSupplier: () =>
    set({
      isOpen: true,
      mode: 'create',
      data: null,
    }),

  openEditSupplier: (data) =>
    set({
      isOpen: true,
      mode: 'edit',
      data,
    }),

  openViewSupplier: (data) =>
    set({
      isOpen: true,
      mode: 'view',
      data,
    }),

  closeSupplierDrawer: () =>
    set((state) => ({
      ...state,
      isOpen: false,
    })),

  reset: () => set(initialState),
}));

export const useSupplierDrawerController = () => {
  return useSupplierDrawerStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      mode: s.mode,
      data: s.data,

      openCreateSupplier: s.openCreateSupplier,
      openEditSupplier: s.openEditSupplier,
      openViewSupplier: s.openViewSupplier,
      closeSupplierDrawer: s.closeSupplierDrawer,
      reset: s.reset,
    }))
  );
};