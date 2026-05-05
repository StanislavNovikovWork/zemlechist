'use client';

import { Form, Input, Button, Space, Select, DatePicker, Rate } from 'antd';
import { PhoneInput } from '@/ui/PhoneInput';
import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import type { SupplierForm } from '../../model/supplier.types';
import { toSubmitValues } from '../../model/supplierForm.mapper';
import { FieldSchema } from './types';
import { supplierFormSchema } from '../../model/supplierForm.schema';

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

  // Фильтруем поля формы в зависимости от типа
  const filteredSchema = useMemo(() => {
    if (typeValue === 'constructionSite') {
      // Для строительной площадки показываем только type, orderNumber, responsible и coordinates
      return supplierFormSchema.filter(
        (field) => field.name === 'type' || field.name === 'orderNumber' || field.name === 'responsible' || field.name === 'coordinates'
      );
    }
    // Для остальных типов показываем все поля кроме orderNumber и responsible
    return supplierFormSchema.filter(
      (field) => field.name !== 'orderNumber' && field.name !== 'responsible'
    );
  }, [typeValue]);

  useEffect(() => {
      form.resetFields();
  }, [form]);

  useEffect(() => {
    if (!initialValues) return;

    const values: any = { ...initialValues };

    if (values.updatedAt) {
      const parsed = dayjs(values.updatedAt, 'DD.MM.YYYY');
      values.updatedAt = parsed.isValid() ? parsed : undefined;
    }

    if (values.coordinates && Array.isArray(values.coordinates)) {
      const [lng, lat] = values.coordinates;
      values.coordinates = `${lat}, ${lng}`;
    }

    form.setFieldsValue(values);
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(toSubmitValues(values));
  };

  type SchemaFormProps = {
    schema: FieldSchema[];
  };

  const renderField = (field: FieldSchema) => {
    switch (field.type) {
      case 'input':
        return <Input placeholder={field.placeholder} {...field.initialValue} style={{ width: '100%' }} />;

      case 'textarea':
        return <Input.TextArea rows={4} placeholder={field.placeholder} {...field.initialValue} style={{ width: '100%' }} />;

      case 'select':
        return <Select options={field.options} {...field.initialValue} style={{ width: '100%' }} />;

      case 'date':
        return <DatePicker style={{ width: '100%' }} {...field.initialValue} />;

      case 'rate':
        return <Rate {...field.initialValue} />;

      case 'phone':
        return <PhoneInput {...field.initialValue} style={{ width: '100%' }} />;

      default:
        return null;
    }
  };

  const renderFormItems = ({ schema }: SchemaFormProps) => {
    return (
      <>
        {schema.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
            initialValue={field.initialValue}
            style={{ marginBottom: '8px' }}
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="px-4"
        >
          {renderFormItems({ schema: filteredSchema })}
        </Form>
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
