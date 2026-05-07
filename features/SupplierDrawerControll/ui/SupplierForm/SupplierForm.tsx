'use client';

import { Form, Input, Button, Space, Select, DatePicker, Rate } from 'antd';
import ruRU from 'antd/locale/ru_RU';
const { RangePicker } = DatePicker;
import { PhoneInput } from '@/ui/PhoneInput';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
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
  const [showPeriod2, setShowPeriod2] = useState(false);
  const typeValue = Form.useWatch('type', form);

  // Фильтруем поля формы в зависимости от типа
  const filteredSchema = useMemo(() => {
    if (typeValue === 'constructionSite') {
      // Для строительной площадки показываем только type, orderNumber, responsible, coordinates и duration
      return supplierFormSchema.filter(
        (field) => field.name === 'type' || field.name === 'orderNumber' || field.name === 'responsible' || field.name === 'coordinates' || field.name === 'duration'
      );
    }
    // Для остальных типов показываем все поля кроме orderNumber, responsible и duration
    return supplierFormSchema.filter(
      (field) => field.name !== 'orderNumber' && field.name !== 'responsible' && field.name !== 'duration'
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

    // Обработка поля duration - конвертируем строки в dayjs объекты для двух периодов
    if (values.duration && values.duration.period1) {
      const convertPeriod = (period: any) => {
        if (Array.isArray(period)) {
          return period.map((date: any) => {
            if (typeof date === 'string') {
              const parsed = dayjs(date, 'DD.MM.YYYY');
              return parsed.isValid() ? parsed : undefined;
            }
            return date;
          });
        }
        return period;
      };
      
      values.duration = {
        period1: convertPeriod(values.duration.period1),
        period2: values.duration.period2 ? convertPeriod(values.duration.period2) : undefined
      };
    }

    form.setFieldsValue(values);
    
    // Устанавливаем состояние для второго периода
    if (values.duration && values.duration.period2) {
      setShowPeriod2(true);
    } else {
      setShowPeriod2(false);
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(toSubmitValues(values));
  };

  type SchemaFormProps = {
    schema: FieldSchema[];
  };

  // Кастомный компонент для поля диапазона дат с поддержкой двух периодов
  const DateRangeInput = () => {
    const duration = Form.useWatch('duration', form);
    const period1Start = duration?.period1?.[0];
    const period1End = duration?.period1?.[1];
    const period2Start = duration?.period2?.[0];
    const period2End = duration?.period2?.[1];

    const updatePeriod1 = (start: any, end: any) => {
      const currentDuration = form.getFieldValue('duration') || { period1: [] };
      form.setFieldValue('duration', {
        ...currentDuration,
        period1: [start, end]
      });
    };

    const updatePeriod2 = (start: any, end: any) => {
      const currentDuration = form.getFieldValue('duration') || { period1: [] };
      form.setFieldValue('duration', {
        ...currentDuration,
        period2: [start, end]
      });
      // Принудительно обновляем форму чтобы перерисовать компонент
      form.validateFields();
    };

    const removePeriod2 = () => {
      const currentDuration = form.getFieldValue('duration') || { period1: [] };
      const { period2, ...rest } = currentDuration;
      form.setFieldValue('duration', rest);
      setShowPeriod2(false);
    };

    return (
      <div style={{ width: '100%' }}>
        {/* Первый период */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Период 1:</div>
          <Space.Compact style={{ width: '100%' }}>
            <DatePicker 
              style={{ width: 'calc(50% - 15px)', borderRadius: '6px' }} 
              format="DD.MM.YYYY"
              placeholder="Начало"
              value={period1Start}
              onChange={(date) => updatePeriod1(date, period1End)}
            />
            <Input 
              style={{ 
                width: '30px', 
                pointerEvents: 'none', 
                textAlign: 'center', 
                backgroundColor: 'transparent',
                fontSize: '16px',
                fontWeight: 'bold',
                borderTop: 'none',
                borderBottom: 'none'
              }} 
              value="-" 
              readOnly 
            />
            <DatePicker 
              style={{ width: 'calc(50% - 15px)', borderRadius: '6px' }} 
              format="DD.MM.YYYY"
              placeholder="Конец"
              value={period1End}
              onChange={(date) => updatePeriod1(period1Start, date)}
            />
          </Space.Compact>
        </div>

        {/* Второй период */}
        <div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            Период 2:
            {period2Start && period2End && (
              <Button 
                type="link" 
                size="small" 
                style={{ padding: '0', height: 'auto', marginLeft: '8px' }}
                onClick={removePeriod2}
              >
                Удалить
              </Button>
            )}
          </div>
          {showPeriod2 ? (
            <Space.Compact style={{ width: '100%' }}>
              <DatePicker 
                style={{ width: 'calc(50% - 15px)', borderRadius: '6px' }} 
                format="DD.MM.YYYY"
                placeholder="Начало"
                value={period2Start}
                onChange={(date) => updatePeriod2(date, period2End)}
              />
              <Input 
                style={{ 
                  width: '30px', 
                  pointerEvents: 'none', 
                  textAlign: 'center', 
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  borderTop: 'none',
                  borderBottom: 'none'
                }} 
                value="-" 
                readOnly 
              />
              <DatePicker 
                style={{ width: 'calc(50% - 15px)', borderRadius: '6px' }} 
                format="DD.MM.YYYY"
                placeholder="Конец"
                value={period2End}
                onChange={(date) => updatePeriod2(period2Start, date)}
              />
            </Space.Compact>
          ) : (
            !showPeriod2 && (
              <Button 
                type="dashed" 
                style={{ width: '100%' }}
                onClick={() => {
                  setShowPeriod2(true);
                  const currentDuration = form.getFieldValue('duration') || { period1: [] };
                  form.setFieldValue('duration', {
                    ...currentDuration,
                    period2: [null, null]
                  });
                }}
              >
                + Добавить второй период
              </Button>
            )
          )}
        </div>
      </div>
    );
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
        return <DatePicker style={{ width: '100%' }} />;

      case 'dateRange':
        return <DateRangeInput />;

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
