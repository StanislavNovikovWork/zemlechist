'use client';

import { Form, Input, Button, Space, Select, DatePicker, Rate, ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
const { RangePicker } = DatePicker;
import { PhoneInput } from '@/ui/PhoneInput';
import { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import type { SupplierForm } from '../../model/supplier.types';
import { toSubmitValues } from '../../model/supplierForm.mapper';
import { FieldSchema } from './types';
import { supplierFormSchema, constructionSiteFormSchema } from '../../model/supplierForm.schema';

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

  // Получаем схему в зависимости от типа
  const currentSchema = useMemo(() => {
    return typeValue === 'constructionSite' ? constructionSiteFormSchema : supplierFormSchema;
  }, [typeValue]);

  useEffect(() => {
      form.resetFields();
  }, [form]);

  useEffect(() => {
    console.log(initialValues)
    if (!initialValues) return;

    const values: any = { ...initialValues };

    if (values.updatedAt) {
      const parsed = dayjs(values.updatedAt, 'DD.MM.YYYY');
      values.updatedAt = parsed.isValid() ? parsed : undefined;
    }

    if (values.duration?.period1) {
      const startDate = dayjs(values.duration.period1[0], 'DD.MM.YYYY');
      const endDate = dayjs(values.duration.period1[1], 'DD.MM.YYYY');
      values.duration = [
        startDate.isValid() ? startDate : null,
        endDate.isValid() ? endDate : null,
      ];
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
        return <Input placeholder={field.placeholder} style={{ width: '100%' }} />;

      case 'textarea':
        return <Input.TextArea rows={4} placeholder={field.placeholder} style={{ width: '100%' }} />;

      case 'select':
        return <Select options={field.options} style={{ width: '100%' }} />;

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
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
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
