"use client";

import { Form, Input, Button, Space, Select, DatePicker, Rate, Descriptions, Typography, Modal } from "antd";
import { PhoneInput } from "@/ui/PhoneInput";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { SupplierProperties, SupplierFormValues } from "@/types/supplier.types";

const { Text, Link } = Typography;

/**
 * Пропсы компонента AddSupplierForm
 * @property onSave - Callback при сохранении нового поставщика/маркера
 * @property onCancel - Callback при отмене создания/редактирования
 * @property loading - Состояние загрузки для кнопки сохранения
 * @property initialCoordinates - Начальные координаты для предзаполнения [долгота, широта]
 * @property onSuccess - Callback при успешном создании
 * @property properties - Свойства для режима просмотра/редактирования
 * @property isEditing - Режим редактирования
 * @property isViewMode - Режим просмотра
 * @property onDelete - Callback при удалении
 * @property deleteLoading - Состояние загрузки для кнопки удаления
 * @property onEdit - Callback при переходе в режим редактирования
 */
interface AddSupplierFormProps {
  onSave?: (values: SupplierProperties) => void;
  onCancel?: () => void;
  loading?: boolean;
  initialCoordinates?: [number, number] | null;
  onSuccess?: () => void;
  properties?: SupplierProperties;
  isEditing?: boolean;
  isViewMode?: boolean;
  onDelete?: () => void;
  deleteLoading?: boolean;
  onEdit?: () => void;
}

export function AddSupplierForm({ onSave, onCancel, loading, initialCoordinates, onSuccess, properties, isEditing, isViewMode, onDelete, deleteLoading, onEdit }: AddSupplierFormProps) {
  const [form] = Form.useForm();
  const [shouldReset, setShouldReset] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isViewMode) return; // Не работаем с формой в режиме просмотра

    if (initialCoordinates && initialCoordinates[0] !== undefined && initialCoordinates[1] !== undefined) {
      // Конвертируем из [долгота, широта] в строку "широта, долгота" с округлением до 6 знаков
      const lat = initialCoordinates[1].toFixed(6);
      const lng = initialCoordinates[0].toFixed(6);
      const coordinatesString = `${lat}, ${lng}`;
      form.setFieldsValue({ coordinates: coordinatesString });
    } else if (initialCoordinates === null) {
      // Если координаты null, сбрасываем форму
      form.resetFields();
    }
  }, [initialCoordinates, form, isViewMode]);

  useEffect(() => {
    if (isViewMode) return; // Не работаем с формой в режиме просмотра

    if (shouldReset) {
      form.resetFields();
      setShouldReset(false);
      // После сброса снова заполняем координаты, если они есть
      if (initialCoordinates && initialCoordinates[0] !== undefined && initialCoordinates[1] !== undefined) {
        const lat = initialCoordinates[1].toFixed(6);
        const lng = initialCoordinates[0].toFixed(6);
        const coordinatesString = `${lat}, ${lng}`;
        form.setFieldsValue({ coordinates: coordinatesString });
      }
    }
  }, [shouldReset, form, initialCoordinates, isViewMode]);

  useEffect(() => {
    if (isViewMode) return; // Не работаем с формой в режиме просмотра

    if (onSuccess) {
      setShouldReset(true);
    }
  }, [onSuccess, isViewMode]);

  // Заполняем форму при редактировании
  useEffect(() => {
    if (isViewMode) return; // Не работаем с формой в режиме просмотра

    if (properties && isEditing) {
      const formValues: SupplierFormValues = { ...properties };
      if (properties.updatedAt && properties.updatedAt !== 'Invalid Date') {
        const parsedDate = dayjs(properties.updatedAt, 'DD.MM.YYYY');
        if (parsedDate.isValid()) {
          formValues.updatedAt = parsedDate;
        } else {
          formValues.updatedAt = null;
        }
      } else {
        formValues.updatedAt = null;
      }
      form.setFieldsValue(formValues);
    }
  }, [properties, form, isEditing, isViewMode]);

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
      {isViewMode ? (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <Descriptions column={1} size="small" layout="vertical">
              {properties?.phone !== undefined && (
                <Descriptions.Item label="Телефон">
                  <Text>{properties.phone}</Text>
                </Descriptions.Item>
              )}
              {properties?.email !== undefined && properties.email && (
                <Descriptions.Item label="Почта">
                  <Link href={`mailto:${properties.email}`}>{properties.email}</Link>
                </Descriptions.Item>
              )}
              {properties?.name !== undefined && (
                <Descriptions.Item label="Имя">
                  <Text>{properties.name}</Text>
                </Descriptions.Item>
              )}
              {properties?.organizationName !== undefined && properties.organizationName && (
                <Descriptions.Item label="Название организации">
                  <Text>{properties.organizationName}</Text>
                </Descriptions.Item>
              )}
              {properties?.description !== undefined && (
                <Descriptions.Item label="Описание">
                  <Text>{properties.description}</Text>
                </Descriptions.Item>
              )}
              {properties?.website !== undefined && properties.website && (
                <Descriptions.Item label="Сайт">
                  <Link href={properties.website} target="_blank">{properties.website}</Link>
                </Descriptions.Item>
              )}
              {properties?.inn !== undefined && properties.inn && (
                <Descriptions.Item label="ИНН">
                  <Text>{properties.inn}</Text>
                </Descriptions.Item>
              )}
              {properties?.updatedAt !== undefined && properties.updatedAt && (
                <Descriptions.Item label="Дата обновления информации">
                  <Text>{dayjs(properties.updatedAt, 'DD.MM.YYYY').format('DD.MM.YYYY')}</Text>
                </Descriptions.Item>
              )}
              {properties?.reliability !== undefined && (
                <Descriptions.Item label="Надежность">
                  <Rate disabled value={properties.reliability} />
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
          <div className="pt-4 mt-auto space-y-2">
            {onEdit && (
              <Button type="primary" block onClick={onEdit}>
                Редактировать
              </Button>
            )}
            <Button danger type="default" block onClick={handleDeleteClick} loading={deleteLoading}>
              Удалить
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4">
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                const submitValues = { ...values };
                if (values.updatedAt) {
                  submitValues.updatedAt = values.updatedAt.format('DD.MM.YYYY');
                }
                onSave?.(submitValues);
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
                label="Почта"
                name="email"
              >
                <Input placeholder="example@mail.com" />
              </Form.Item>
              <Form.Item
                label="Название организации"
                name="organizationName"
              >
                <Input placeholder="ООО Рога и копыта" />
              </Form.Item>
              <Form.Item
                label="Описание"
                name="description"
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Сайт"
                name="website"
              >
                <Input placeholder="https://example.com" />
              </Form.Item>
              <Form.Item
                label="ИНН"
                name="inn"
              >
                <Input placeholder="123456789012" />
              </Form.Item>
              <Form.Item
                label="Дата обновления информации"
                name="updatedAt"
              >
                <DatePicker format="DD.MM.YYYY" placeholder="ДД.ММ.ГГГГ" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Надежность" name="reliability" initialValue={3}>
                <Rate />
              </Form.Item>
            </Form>
          </div>
          <div className="pt-4 mt-auto">
            <Space className="w-full" style={{ justifyContent: 'flex-end' }}>
              <Button type="primary" htmlType="submit" loading={loading} onClick={() => form.submit()}>
                Сохранить
              </Button>
              <Button onClick={onCancel}>
                Отмена
              </Button>
            </Space>
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
        <p>Вы уверены, что хотите удалить?</p>
      </Modal>
    </>
  );
}
