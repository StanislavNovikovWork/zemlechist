import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';


export type SupplierForm = {
  id?: number;
  phone: string;
  coordinates: [number, number];
  name: string;
  description: string;
  iconCaption: string;
  "marker-color": string;
  type: 'specialTechnique' | 'garbageCollection';
  reliability?: number;

  website?: string;
  inn?: string;
  organizationName?: string;
  updatedAt?: string;
  email?: string;
};

type SupplierWithId = SupplierForm & { id: number };

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
  close: () => void;
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

  close: () =>
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
      close: s.close,
      reset: s.reset,
    }))
  );
};