import type { SupplierForm } from '../../model/supplier.types';
import type { Dayjs } from 'dayjs';

export type SupplierFormValues = Omit<SupplierForm, 'coordinates' | 'updatedAt' | 'duration'> & {
  coordinates: string;
  updatedAt?: Dayjs;
  duration?: [Dayjs, Dayjs];
};

type FieldType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'date'
  | 'dateRange'
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