'use client';

import { Form, Input, Button, Space, Select, DatePicker, Rate } from 'antd';
import { PhoneInput } from '@/ui/PhoneInput';
import { useEffect } from 'react';
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
        return <Input {...field.initialValue} />;

      case 'textarea':
        return <Input.TextArea rows={4} {...field.initialValue} />;

      case 'select':
        return <Select options={field.options} {...field.initialValue} />;

      case 'date':
        return <DatePicker style={{ width: '100%' }} {...field.initialValue} />;

      case 'rate':
        return <Rate {...field.initialValue} />;

      case 'phone':
        return <PhoneInput {...field.initialValue} />;

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
        >
          {renderFormItems({ schema: supplierFormSchema })}
        </Form>
      </div>
      <div className="pt-4">
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
