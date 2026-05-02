import type { SupplierForm } from "./supplier.types";

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
  placeholder?: string;
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
      { value: "constructionSite", label: "Строительная площадка" },
    ],
  },
  {
    name: "orderNumber",
    label: "Заказ",
    type: "input",
    placeholder: "Номер заказа",
  },
  {
    name: "responsible",
    label: "Ответственный",
    type: "input",
    placeholder: "ФИО ответственного",
  },
  {
    name: "coordinates",
    label: "Координаты",
    type: "input",
    placeholder: "55.370000, 35.850000",
    rules: [
      { required: true },
      {
        pattern: /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/,
        message: "Формат: 55.370000, 35.850000",
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
    placeholder: "Название компании или услуги",
    rules: [{ required: true }],
  },
  {
    name: "email",
    label: "Email",
    type: "input",
    placeholder: "email@example.com",
  },
  {
    name: "organizationName",
    label: "Организация",
    type: "input",
    placeholder: "Название организации",
  },
  {
    name: "description",
    label: "Описание",
    type: "textarea",
    placeholder: "Подробное описание услуги или компании",
  },
  {
    name: "website",
    label: "Сайт",
    type: "input",
    placeholder: "https://example.com",
  },
  {
    name: "inn",
    label: "ИНН",
    type: "input",
    placeholder: "1234567890",
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