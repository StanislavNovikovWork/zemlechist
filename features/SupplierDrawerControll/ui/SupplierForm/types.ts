import type { SupplierForm } from '../../model/supplier.types';
import type { Dayjs } from 'dayjs';

export type SupplierFormValues = Omit<SupplierForm, 'coordinates' | 'updatedAt'> & {
  coordinates: string;
  updatedAt?: Dayjs;
};

type FieldType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'date'
  | 'rate'
  | 'phone';

export type FieldSchema = {
  name: keyof SupplierForm;
  label: string;
  type: FieldType;
  rules?: any[];
  initialValue?: any;
  placeholder?: string;
  options?: { label: string; value: string }[];
};