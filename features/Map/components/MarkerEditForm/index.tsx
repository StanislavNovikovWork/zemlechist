import { Form, Input, Button, Space, Modal } from "antd";
import { useEffect, useState } from "react";
import { PhoneInput } from "@/components/ui/PhoneInput";

/**
 * Пропсы компонента MarkerEditForm
 * @property properties - Свойства маркера
 * @property isEditing - Режим редактирования
 * @property onSave - Callback при сохранении изменений
 * @property onCancel - Callback при отмене редактирования
 * @property loading - Состояние загрузки для кнопки сохранения
 * @property onDelete - Callback при удалении маркера
 * @property deleteLoading - Состояние загрузки для кнопки удаления
 */
interface MarkerEditFormProps {
  properties: any;
  isEditing: boolean;
  onSave?: (values: any) => void;
  onCancel?: () => void;
  loading?: boolean;
  onDelete?: () => void;
  deleteLoading?: boolean;
}

export function MarkerEditForm({ properties, isEditing, onSave, onCancel, loading, onDelete, deleteLoading }: MarkerEditFormProps) {
  const [form] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (properties && isEditing) {
      form.setFieldsValue(properties);
    }
  }, [properties, form, isEditing]);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    onDelete?.();
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {isEditing ? (
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
              <Button type="primary" htmlType="submit" loading={loading}>
                Сохранить
              </Button>
              <Button onClick={onCancel}>
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-4">
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
          <div className="pt-4 mt-auto">
            <Button danger type="default" block onClick={handleDeleteClick} loading={deleteLoading}>
              Удалить маркер
            </Button>
          </div>
        </div>
      )}

      <Modal
        title="Подтверждение удаления"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true, loading: deleteLoading }}
      >
        <p>Вы уверены, что хотите удалить этот маркер?</p>
      </Modal>
    </>
  );
}
