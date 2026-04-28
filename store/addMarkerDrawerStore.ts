import { create } from 'zustand';

interface AddSupplierDrawerStore {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  coordinates: [number, number] | null;
  properties?: any;
  onSuccess?: () => void;
  onSave?: (values: any) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  deleteLoading?: boolean;
  open: (mode: 'create' | 'edit' | 'view', options?: {
    coordinates?: [number, number];
    properties?: any;
    onSuccess?: () => void;
    onSave?: (values: any) => void;
    onDelete?: () => void;
    onCancel?: () => void;
    loading?: boolean;
    deleteLoading?: boolean;
  }) => void;
  setMode: (mode: 'create' | 'edit' | 'view', options?: {
    onSave?: (values: any) => void;
    onDelete?: () => void;
    onCancel?: () => void;
    loading?: boolean;
    deleteLoading?: boolean;
  }) => void;
  close: () => void;
  clearCoordinates: () => void;
}

export const useAddSupplierDrawerStore = create<AddSupplierDrawerStore>((set: any) => ({
  isOpen: false,
  mode: 'create',
  coordinates: null,
  properties: undefined,
  onSuccess: undefined,
  onSave: undefined,
  onDelete: undefined,
  onCancel: undefined,
  loading: false,
  deleteLoading: false,
  open: (mode: 'create' | 'edit' | 'view', options = {}) => set({
    isOpen: true,
    mode,
    coordinates: options.coordinates || null,
    properties: mode === 'create' ? undefined : options.properties,
    onSuccess: options.onSuccess,
    onSave: options.onSave,
    onDelete: options.onDelete,
    onCancel: options.onCancel,
    loading: options.loading,
    deleteLoading: options.deleteLoading,
  }),
  setMode: (mode: 'create' | 'edit' | 'view', options = {}) => set((state: any) => ({
    mode,
    onSave: options.onSave !== undefined ? options.onSave : state.onSave,
    onDelete: options.onDelete !== undefined ? options.onDelete : state.onDelete,
    onCancel: options.onCancel !== undefined ? options.onCancel : state.onCancel,
    loading: options.loading !== undefined ? options.loading : state.loading,
    deleteLoading: options.deleteLoading !== undefined ? options.deleteLoading : state.deleteLoading,
  })),
  close: () => set({
    isOpen: false,
    coordinates: null,
    properties: undefined,
    onSuccess: undefined,
    onSave: undefined,
    onDelete: undefined,
    onCancel: undefined,
    loading: false,
    deleteLoading: false,
  }),
  clearCoordinates: () => set({ coordinates: null }),
}));
