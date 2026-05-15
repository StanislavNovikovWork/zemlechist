import type { SupplierForm } from './supplier.types';
import { foremenConfig } from '@/features/Works/config/foremen';

type FieldType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'dateRange'
  | 'rate'
  | 'phone'
  | 'zones';

type FieldSchema = {
  name: keyof SupplierForm | string[];
  label: string;
  type: FieldType;
  rules?: any[];
  initialValue?: any;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

export const constructionSiteFormSchema: FieldSchema[] = [
  {
    name: 'type',
    label: 'Тип',
    type: 'select',
    rules: [{ required: true, message: 'Выберите тип' }],
    options: [{ value: 'constructionSite', label: 'Строительная площадка' }],
  },
  {
    name: 'orderNumber',
    label: 'Заказ',
    type: 'input',
    placeholder: 'Номер заказа',
  },
  {
    name: 'responsible',
    label: 'Ответственный',
    type: 'select',
    placeholder: 'Выберите ответственного',
    options: foremenConfig.map((foreman) => ({
      label: foreman.name,
      value: foreman.name,
    })),
  },
  {
    name: 'coordinates',
    label: 'Координаты',
    type: 'input',
    placeholder: '55.370000, 35.850000',
    rules: [
      { required: true, message: 'Введите координаты' },
      {
        pattern: /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/,
        message: 'Неверный формат. Пример: 55.370000, 35.850000',
      },
    ],
  },
  {
    name: ['duration', 'period1'],
    label: 'Первый период',
    type: 'dateRange',
    placeholder: 'Выберите период',
  },
  {
    name: ['duration', 'period2'],
    label: 'Второй период',
    type: 'dateRange',
    placeholder: 'Выберите период',
  },
  {
    name: 'garbageCollectionSupplier',
    label: 'Поставщики',
    type: 'multiselect',
    placeholder: 'Выберите поставщиков',
    options: [], // Будет заполнено динамически
    initialValue: [],
  },
];

export const supplierFormSchema: FieldSchema[] = [
  {
    name: 'type',
    label: 'Тип',
    type: 'select',
    rules: [{ required: true, message: 'Выберите тип' }],
    options: [
      { value: 'garbageCollection', label: 'Вывоз мусора' },
      { value: 'nonMetallicMaterials', label: 'Нерудные материалы' },
      { value: 'constructionSite', label: 'Строительная площадка' },
      { value: 'specialTechnique', label: 'Спецтехника' },
    ],
  },
  {
    name: 'zones',
    label: 'Зоны работ',
    type: 'zones',
    placeholder: 'Выберите зоны',
    options: [
      { value: 'all', label: 'Все зоны' },
      { value: '1', label: 'Зона 1' },
      { value: '2', label: 'Зона 2' },
      { value: '3', label: 'Зона 3' },
      { value: '4', label: 'Зона 4' },
      { value: '5', label: 'Зона 5' },
      { value: '6', label: 'Зона 6' },
      { value: '7', label: 'Зона 7' },
      { value: '8', label: 'Зона 8' },
    ],
  },
  {
    name: 'coordinates',
    label: 'Координаты',
    type: 'input',
    placeholder: '55.370000, 35.850000',
    rules: [
      { required: true, message: 'Введите координаты' },
      {
        pattern: /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/,
        message: 'Неверный формат. Пример: 55.370000, 35.850000',
      },
    ],
  },
  {
    name: 'phone',
    label: 'Телефон',
    type: 'phone',
    rules: [{ required: true, message: 'Введите телефон' }],
  },
  {
    name: 'name',
    label: 'Имя',
    type: 'input',
    placeholder: 'Имя',
    rules: [{ required: true, message: 'Введите имя' }],
  },
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    placeholder: 'email@example.com',
  },
  {
    name: 'organizationName',
    label: 'Организация',
    type: 'input',
    placeholder: 'Название организации',
  },
  {
    name: 'description',
    label: 'Описание',
    type: 'textarea',
    placeholder: 'Подробное описание услуги или компании',
  },
  {
    name: 'website',
    label: 'Сайт',
    type: 'input',
    placeholder: 'https://example.com',
  },
  {
    name: 'inn',
    label: 'ИНН',
    type: 'input',
    placeholder: '1234567890',
  },
  {
    name: 'paymentMethod',
    label: 'Способ оплаты',
    type: 'select',
    options: [
      { value: 'cash', label: 'Нал' },
      { value: 'cashless', label: 'Без нал' },
      { value: 'both', label: 'Оба варианта' },
    ],
  },
  {
    name: 'updatedAt',
    label: 'Дата',
    type: 'date',
  },
  {
    name: 'reliability',
    label: 'Надежность',
    type: 'rate',
    initialValue: 3,
  },
];
