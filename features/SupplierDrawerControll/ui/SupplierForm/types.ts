import type { SupplierForm } from '../../model/supplier.types';
import type { Dayjs } from 'dayjs';

export type SupplierFormValues = Omit<SupplierForm, 'coordinates' | 'updatedAt' | 'duration'> & {
  coordinates: string;
  updatedAt?: Dayjs;
  duration?: {
    period1: [Dayjs, Dayjs];
    period2?: [Dayjs, Dayjs];
  };
};

type FieldType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'date'
  | 'dateRange'
  | 'rate'
  | 'phone'
  | 'zones';

export type FieldSchema = {
  name: keyof SupplierForm | string[];
  label: string;
  type: FieldType;
  rules?: any[];
  initialValue?: any;
  placeholder?: string;
  options?: { label: string; value: string }[];
};