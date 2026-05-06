// Supplier-related types
export interface Supplier {
  id: number;
  company: string;
  productCategory: string;
  phone: string;
  website: string;
  reliability: number; // 1-5
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierRequest {
  company: string;
  productCategory?: string;
  phone: string;
  website?: string;
  reliability?: number;
  description?: string;
  duration?: [string, string];
}

export interface SupplierProperties {
  phone?: string;
  email?: string;
  name?: string;
  organizationName?: string;
  description?: string;
  website?: string;
  inn?: string;
  updatedAt?: string | null;
  reliability?: number;
  type?: 'specialTechnique' | 'garbageCollection' | 'constructionSite' | 'nonMetallicMaterials';
  duration?: [string, string];
}

// Тип для значений формы (включая Dayjs для DatePicker)
export interface SupplierFormValues extends Omit<SupplierProperties, 'updatedAt' | 'duration'> {
  coordinates?: string;
  updatedAt?: string | null | any; // any для поддержки Dayjs в DatePicker
  duration?: [any, any]; // any для поддержки Dayjs в DatePicker
}
