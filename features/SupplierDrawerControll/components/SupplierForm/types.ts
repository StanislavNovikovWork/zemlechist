import type { SupplierForm } from '@/store/addMarkerDrawerStore';
import type { Dayjs } from 'dayjs';

/** Значения формы поставщика (до конвертации) */
export type SupplierFormValues = Omit<SupplierForm, 'coordinates' | 'updatedAt'> & {
  coordinates: string;
  updatedAt?: Dayjs;
};

type FieldType =
  | "input"
  | "textarea"
  | "select"
  | "date"
  | "rate"
  | "phone";

export type FieldSchema = {
  name: keyof SupplierForm;
  label: string;
  type: FieldType;
  rules?: any[];
  initialValue?: any;
  options?: { label: string; value: string }[];
};