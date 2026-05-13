'use client';

import {
  Form,
  Input,
  Button,
  Space,
  Select,
  DatePicker,
  Rate,
  ConfigProvider,
} from 'antd';
import ruRU from 'antd/locale/ru_RU';
const { RangePicker } = DatePicker;
import { PhoneInput } from '@/ui/PhoneInput';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type { SupplierForm } from '../../model/supplier.types';
import { toSubmitValues } from '../../model/supplierForm.mapper';
import { FieldSchema } from './types';
import {
  supplierFormSchema,
  constructionSiteFormSchema,
  specialTechniqueFormSchema,
} from '../../model/supplierForm.schema';
import { useGarbageSuppliersQuery } from '../../hooks/queries/useSuppliersQuery';

/**
 * @interface AddSupplierFormProps
 * @description Свойства компонента формы добавления поставщика
 * @property {SupplierForm | null} initialValues - Начальные значения формы или null для создания новой записи
 * @property {boolean} [loading] - Флаг загрузки для отображения состояния ожидания
 * @property {(values: SupplierForm) => void} onSubmit - Callback-функция при отправке формы
 * @property {() => void} onCancel - Callback-функция при отмене формы
 */
type AddSupplierFormProps = {
  initialValues?: SupplierForm | null;
  loading?: boolean;
  onSubmit: (values: SupplierForm) => void;
  onCancel: () => void;
};

export function AddSupplierForm({
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: AddSupplierFormProps) {
  const [form] = Form.useForm();
  const typeValue = Form.useWatch('type', form);
  const { data: garbageSuppliers = [] } = useGarbageSuppliersQuery();

  // Получаем опции для селекта поставщиков
  const supplierOptions = useMemo(() => {
    const options = garbageSuppliers.map((supplier: any) => {
      const typeLabels: Record<string, string> = {
        garbageCollection: 'Вывоз мусора',
        specialTechnique: 'Спецтехника',
        nonMetallicMaterials: 'Нерудные материалы',
      };
      const typeLabel =
        typeLabels[supplier.properties.type] || supplier.properties.type;
      return {
        value: supplier.id,
        label: `${supplier.properties.organizationName || `Маркер #${supplier.id}`} (${typeLabel})`,
      };
    });
    return options;
  }, [garbageSuppliers]);

  // Получаем схему в зависимости от типа
  const currentSchema = useMemo(() => {
    let schema;

    if (typeValue === 'constructionSite') {
      schema = constructionSiteFormSchema;
    } else if (typeValue === 'specialTechnique') {
      schema = specialTechniqueFormSchema;
    } else {
      schema = supplierFormSchema;
    }

    // Обновляем опции для селекта поставщиков
    if (typeValue === 'constructionSite') {
      schema = schema.map((field) => {
        if (field.name === 'garbageCollectionSupplier') {
          return {
            ...field,
            options: supplierOptions,
          };
        }
        return field;
      });
    }

    return schema;
  }, [typeValue, supplierOptions]);

  useEffect(() => {
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (!initialValues) return;

    const values: any = { ...initialValues };

    // Обрабатываем updatedAt только для не-строительных площадок
    if (values.updatedAt && values.type !== 'constructionSite') {
      const parsed = dayjs(values.updatedAt, 'DD.MM.YYYY');
      values.updatedAt = parsed.isValid() ? parsed : undefined;
    } else if (values.type === 'constructionSite') {
      // Для строй площадок удаляем поле updatedAt чтобы избежать ошибок
      delete values.updatedAt;
    }

    if (values.duration) {
      // Игнорируем старый формат массива, работаем только с period1/period2
      if (values.duration.period1) {
        values.duration.period1 = values.duration.period1.map((d: string) =>
          dayjs(d, 'DD.MM.YYYY')
        );
      }
      if (values.duration.period2) {
        values.duration.period2 = values.duration.period2.map((d: string) =>
          dayjs(d, 'DD.MM.YYYY')
        );
      }
    }
    if (values.coordinates && Array.isArray(values.coordinates)) {
      const [lng, lat] = values.coordinates;
      values.coordinates = `${lat}, ${lng}`;
    }

    // Обрабатываем zones - убеждаемся что это массив
    if (values.zones && !Array.isArray(values.zones)) {
      // Если zones пришел как строка или другой формат, преобразуем в массив
      if (typeof values.zones === 'string') {
        values.zones = [values.zones];
      } else {
        values.zones = [];
      }
    } else if (!values.zones) {
      values.zones = [];
    }

    // Обрабатываем garbageCollectionSupplier - преобразуем строку в массив
    if (
      values.garbageCollectionSupplier &&
      !Array.isArray(values.garbageCollectionSupplier)
    ) {
      if (typeof values.garbageCollectionSupplier === 'string') {
        values.garbageCollectionSupplier = values.garbageCollectionSupplier
          .split(',')
          .map(Number)
          .filter(Boolean);
      } else {
        values.garbageCollectionSupplier = [];
      }
    } else if (!values.garbageCollectionSupplier) {
      values.garbageCollectionSupplier = [];
    }

    form.setFieldsValue(values);
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    const submitValues = toSubmitValues(values);
    onSubmit(submitValues);
  };

  type SchemaFormProps = {
    schema: FieldSchema[];
  };

  const renderField = (field: FieldSchema) => {
    switch (field.type) {
      case 'input':
        return (
          <Input placeholder={field.placeholder} style={{ width: '100%' }} />
        );

      case 'textarea':
        return (
          <Input.TextArea
            rows={4}
            placeholder={field.placeholder}
            style={{ width: '100%' }}
          />
        );

      case 'select':
        return <Select options={field.options} style={{ width: '100%' }} />;

      case 'multiselect':
        return (
          <Select
            mode="multiple"
            showSearch
            options={field.options}
            placeholder={field.placeholder}
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          />
        );

      case 'zones':
        return (
          <Select
            mode="multiple"
            options={field.options}
            placeholder={field.placeholder}
            style={{ width: '100%' }}
          />
        );

      case 'date':
        return <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />;

      case 'dateRange':
        return <RangePicker style={{ width: '100%' }} format="DD.MM.YYYY" />;

      case 'rate':
        return <Rate />;

      case 'phone':
        return <PhoneInput />;

      default:
        return null;
    }
  };

  const renderFormItems = ({ schema }: SchemaFormProps) => {
    return (
      <>
        {schema.map((field) => (
          <Form.Item
            key={Array.isArray(field.name) ? field.name.join('.') : field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
            style={{ marginBottom: '8px' }}
            initialValue={field.initialValue}
          >
            {renderField(field)}
          </Form.Item>
        ))}
      </>
    );
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4">
        <ConfigProvider locale={ruRU}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="px-4"
          >
            {renderFormItems({ schema: currentSchema })}
          </Form>
        </ConfigProvider>
      </div>
      <div className="pt-4 px-4 bg-inherit w-full">
        <Space className="w-full justify-end">
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Сохранить
          </Button>
          <Button onClick={onCancel}>Отмена</Button>
        </Space>
      </div>
    </div>
  );
}
