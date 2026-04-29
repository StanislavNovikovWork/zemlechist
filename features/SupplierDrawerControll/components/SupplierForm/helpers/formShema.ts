import type { SupplierForm } from "@/store/addMarkerDrawerStore";

type FieldType =
  | "input"
  | "textarea"
  | "select"
  | "date"
  | "rate"
  | "phone";

type FieldSchema = {
  name: keyof SupplierForm;
  label: string;
  type: FieldType;
  rules?: any[];
  initialValue?: any;
  options?: { label: string; value: string }[];
};

export const supplierFormSchema: FieldSchema[] = [
  {
    name: "type",
    label: "Тип",
    type: "select",
    rules: [{ required: true }],
    options: [
      { value: "specialTechnique", label: "Спецтехника" },
      { value: "garbageCollection", label: "Вывоз мусора" },
    ],
  },
  {
    name: "coordinates",
    label: "Координаты",
    type: "input",
    rules: [
      { required: true },
      {
        pattern: /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/,
        message: "Формат: 55.37, 35.85",
      },
    ],
  },
  {
    name: "phone",
    label: "Телефон",
    type: "phone",
    rules: [{ required: true }],
  },
  {
    name: "name",
    label: "Имя",
    type: "input",
    rules: [{ required: true }],
  },
  {
    name: "email",
    label: "Email",
    type: "input",
  },
  {
    name: "organizationName",
    label: "Организация",
    type: "input",
  },
  {
    name: "description",
    label: "Описание",
    type: "textarea",
  },
  {
    name: "website",
    label: "Сайт",
    type: "input",
  },
  {
    name: "inn",
    label: "ИНН",
    type: "input",
  },
  {
    name: "updatedAt",
    label: "Дата",
    type: "date",
  },
  {
    name: "reliability",
    label: "Надежность",
    type: "rate",
    initialValue: 3,
  },
];