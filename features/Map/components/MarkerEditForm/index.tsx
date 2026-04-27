import { Form, Input, Button, Space, Modal, Typography, Descriptions } from "antd";
import { useEffect, useState } from "react";
import { PhoneInput } from "@/ui/PhoneInput";

const { Text, Link } = Typography;

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
          <Form.Item label="Почта" name="email">
            <Input placeholder="example@mail.com" />
          </Form.Item>
          <Form.Item label="Имя" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Название организации" name="organizationName">
            <Input placeholder="ООО Рога и копыта" />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Сайт" name="website">
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="ИНН" name="inn">
            <Input placeholder="123456789012" />
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
          <div className="flex-1 overflow-y-auto">
            <Descriptions column={1} size="small" layout="vertical">
              {properties.phone !== undefined && (
                <Descriptions.Item label="Телефон">
                  <Text>{properties.phone}</Text>
                </Descriptions.Item>
              )}
              {properties.email !== undefined && properties.email && (
                <Descriptions.Item label="Почта">
                  <Link href={`mailto:${properties.email}`}>{properties.email}</Link>
                </Descriptions.Item>
              )}
              {properties.name !== undefined && (
                <Descriptions.Item label="Имя">
                  <Text>{properties.name}</Text>
                </Descriptions.Item>
              )}
              {properties.organizationName !== undefined && properties.organizationName && (
                <Descriptions.Item label="Название организации">
                  <Text>{properties.organizationName}</Text>
                </Descriptions.Item>
              )}
              {properties.description !== undefined && (
                <Descriptions.Item label="Описание">
                  <Text>{properties.description}</Text>
                </Descriptions.Item>
              )}
              {properties.website !== undefined && properties.website && (
                <Descriptions.Item label="Сайт">
                  <Link href={properties.website} target="_blank">{properties.website}</Link>
                </Descriptions.Item>
              )}
              {properties.inn !== undefined && properties.inn && (
                <Descriptions.Item label="ИНН">
                  <Text>{properties.inn}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
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
