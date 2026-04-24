import { Form, Input, Button, Space } from "antd";
import { useEffect } from "react";
import { PhoneInput } from "@/components/ui/PhoneInput";

/**
 * Пропсы компонента MarkerEditForm
 * @property properties - Свойства маркера
 * @property isEditing - Режим редактирования
 * @property onSave - Callback при сохранении изменений
 * @property onCancel - Callback при отмене редактирования
 */
interface MarkerEditFormProps {
  properties: any;
  isEditing: boolean;
  onSave?: (values: any) => void;
  onCancel?: () => void;
}

export function MarkerEditForm({ properties, isEditing, onSave, onCancel }: MarkerEditFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (properties && isEditing) {
      form.setFieldsValue(properties);
    }
  }, [properties, form, isEditing]);

  if (isEditing) {
    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("Saving changes:", values);
          onSave?.(values);
        }}
      >
        <Form.Item
          label="Телефон"
          name="phone"
          trigger="onChange"
          valuePropName="value"
        >
          <PhoneInput />
        </Form.Item>
        <Form.Item label="Имя" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Описание" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
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

  return (
    <div className="space-y-4">
      {properties.phone !== undefined && (
        <div>
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Телефон
          </span>
          <span className="text-gray-900">{properties.phone}</span>
        </div>
      )}
      {properties.name !== undefined && (
        <div>
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Имя
          </span>
          <span className="text-gray-900">{properties.name}</span>
        </div>
      )}
      {properties.description !== undefined && (
        <div>
          <span className="block text-sm font-semibold text-gray-700 mb-1">
            Описание
          </span>
          <span className="text-gray-900">{properties.description}</span>
        </div>
      )}
    </div>
  );
}
