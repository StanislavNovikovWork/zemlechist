"use client";

import {
  Form,
  Input,
  Button,
  Space,
  Select,
  DatePicker,
  Rate,
  Descriptions,
  Typography,
  Modal,
} from "antd";
import { PhoneInput } from "@/ui/PhoneInput";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { SupplierForm } from "@/store/addMarkerDrawerStore";

type AddSupplierFormProps = {
  initialValues?: SupplierForm | null;
  mode: 'create' | 'edit' | 'view';

  loading?: boolean;
  deleteLoading?: boolean;

  onSubmit: (values: SupplierForm) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

const { Text, Link } = Typography;

export function AddSupplierForm({
  initialValues,
  mode,
  loading,
  deleteLoading,
  onSubmit,
  onCancel,
  onDelete,
  onEdit,
}: AddSupplierFormProps) {
  const [form] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isView = mode === "view";

  // 👉 заполняем форму ОДИН раз при смене данных
  useEffect(() => {
    if (!initialValues || isView) return;

    const values: any = { ...initialValues };

    if (values.updatedAt) {
      const parsed = dayjs(values.updatedAt, "DD.MM.YYYY");
      values.updatedAt = parsed.isValid() ? parsed : undefined;
    }

    if (values.coordinates && Array.isArray(values.coordinates)) {
      const [lng, lat] = values.coordinates;
      values.coordinates = `${lat}, ${lng}`;
    }

    form.setFieldsValue(values);
  }, [initialValues, form, isView]);

  useEffect(() => {
  if (mode === "create") {
    form.resetFields();
  }
}, [mode, form]);

  // 👉 submit
  const handleFinish = (values: any) => {
    const result: any = { ...values };

    if (values.updatedAt) {
      result.updatedAt = values.updatedAt.format("DD.MM.YYYY");
    }

    if (values.coordinates && typeof values.coordinates === "string") {
      const [lat, lng] = values.coordinates.split(",").map(Number);
      result.coordinates = [lng, lat];
    }

    onSubmit(result);
  };

  // 👉 VIEW MODE
  if (isView) {
    return (
      <>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <Descriptions column={1} size="small" layout="vertical">
              {initialValues?.phone && (
                <Descriptions.Item label="Телефон">
                  <Text>{initialValues.phone}</Text>
                </Descriptions.Item>
              )}

              {initialValues?.email && (
                <Descriptions.Item label="Почта">
                  <Link href={`mailto:${initialValues.email}`}>
                    {initialValues.email}
                  </Link>
                </Descriptions.Item>
              )}

              {initialValues?.name && (
                <Descriptions.Item label="Имя">
                  <Text>{initialValues.name}</Text>
                </Descriptions.Item>
              )}

              {initialValues?.organizationName && (
                <Descriptions.Item label="Организация">
                  <Text>{initialValues.organizationName}</Text>
                </Descriptions.Item>
              )}

              {initialValues?.description && (
                <Descriptions.Item label="Описание">
                  <Text>{initialValues.description}</Text>
                </Descriptions.Item>
              )}

              {initialValues?.website && (
                <Descriptions.Item label="Сайт">
                  <Link href={initialValues.website} target="_blank">
                    {initialValues.website}
                  </Link>
                </Descriptions.Item>
              )}

              {initialValues?.inn && (
                <Descriptions.Item label="ИНН">
                  <Text>{initialValues.inn}</Text>
                </Descriptions.Item>
              )}

              {initialValues?.updatedAt && (
                <Descriptions.Item label="Дата">
                  <Text>{initialValues.updatedAt}</Text>
                </Descriptions.Item>
              )}

              {initialValues?.reliability !== undefined && (
                <Descriptions.Item label="Надежность">
                  <Rate disabled value={initialValues.reliability} />
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          <div className="pt-4 space-y-2">
            {isView && (
              <Button type="primary" block onClick={onEdit}>
                Редактировать
              </Button>
            )}

            {onDelete && (
              <Button
                danger
                block
                onClick={() => setIsDeleteModalOpen(true)}
                loading={deleteLoading}
              >
                Удалить
              </Button>
            )}
          </div>
        </div>

        <Modal
          title="Удалить?"
          open={isDeleteModalOpen}
          onOk={() => {
            setIsDeleteModalOpen(false);
            onDelete?.();
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
          okText="Удалить"
          cancelText="Отмена"
          okButtonProps={{ danger: true }}
        >
          <p>Вы уверены?</p>
        </Modal>
      </>
    );
  }

  // 👉 FORM MODE
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Тип"
            name="type"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "specialTechnique", label: "Спецтехника" },
                { value: "garbageCollection", label: "Вывоз мусора" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Координаты"
            name="coordinates"
            rules={[
              { required: true },
              {
                pattern: /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/,
                message: "Формат: 55.37, 35.85",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Телефон" rules={[{ required: true }]}>
            <PhoneInput />
          </Form.Item>

          <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="organizationName" label="Организация">
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="website" label="Сайт">
            <Input />
          </Form.Item>

          <Form.Item name="inn" label="ИНН">
            <Input />
          </Form.Item>

          <Form.Item name="updatedAt" label="Дата">
            <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="reliability" label="Надежность" initialValue={3}>
            <Rate />
          </Form.Item>
        </Form>
      </div>

      <div className="pt-4">
        <Space className="w-full justify-end">
          <Button type="primary" loading={loading} onClick={() => form.submit()}>
            Сохранить
          </Button>
          <Button onClick={onCancel}>Отмена</Button>
        </Space>
      </div>
    </div>
  );
}