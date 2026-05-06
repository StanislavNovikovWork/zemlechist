import type { Dayjs } from 'dayjs';

export type SupplierForm = {
  id?: number;
  phone: string;
  coordinates: [number, number];
  name: string;
  description: string;
  iconCaption: string;
  "marker-color": string;
  type: 'specialTechnique' | 'garbageCollection' | 'constructionSite' | 'nonMetallicMaterials';
  reliability?: number;

  website?: string;
  inn?: string;
  organizationName?: string;
  updatedAt?: string;
  email?: string;
  orderNumber?: string;
  responsible?: string;
  paymentMethod?: 'cash' | 'cashless' | 'both';
  duration?: [Dayjs, Dayjs];
};

export type SupplierWithId = SupplierForm & { id: number };




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
  options?: { label: string; value: string }[];
};