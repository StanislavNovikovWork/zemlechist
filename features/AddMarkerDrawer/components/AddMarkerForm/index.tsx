"use client";

import { Form, Input, Button, Space, Select } from "antd";
import { PhoneInput } from "@/ui/PhoneInput";

/**
 * Пропсы компонента AddMarkerForm
 * @property onSave - Callback при сохранении нового маркера
 * @property onCancel - Callback при отмене создания маркера
 * @property loading - Состояние загрузки для кнопки сохранения
 */
interface AddMarkerFormProps {
  onSave?: (values: any) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function AddMarkerForm({ onSave, onCancel, loading }: AddMarkerFormProps) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        console.log("Creating marker:", values);
        onSave?.(values);
      }}
    >
      <Form.Item
        label="Тип маркера"
        name="type"
        rules={[{ required: true, message: 'Выберите тип маркера' }]}
      >
        <Select placeholder="Выберите тип">
          <Select.Option value="specialTechnique">Спецтехника</Select.Option>
          <Select.Option value="garbageCollection">Вывоз мусора</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Координаты (широта, долгота)"
        name="coordinates"
        rules={[
          { required: true, message: 'Введите координаты' },
          {
            pattern: /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/,
            message: 'Используйте формат: широта, долгота (например: 55.376861, 35.850685)'
          }
        ]}
      >
        <Input placeholder="55.376861, 35.850685" />
      </Form.Item>
      <Form.Item
        label="Телефон"
        name="phone"
        trigger="onChange"
        valuePropName="value"
        rules={[{ required: true, message: 'Введите телефон' }]}
      >
        <PhoneInput />
      </Form.Item>
      <Form.Item
        label="Имя"
        name="name"
        rules={[{ required: true, message: 'Введите имя' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Описание"
        name="description"
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Сохранить
          </Button>
          <Button onClick={onCancel}>
            Отмена
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
