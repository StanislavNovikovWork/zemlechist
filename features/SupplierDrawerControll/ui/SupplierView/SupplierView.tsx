import { Descriptions, Typography, Rate, Button, Modal } from "antd";
import { useState } from "react";
import type { SupplierForm } from "@/features/SupplierDrawerControll/model/supplier.types";

const { Text, Link } = Typography;

/** Пропсы компонента SupplierView */
type SupplierViewProps = {
  /** Данные поставщика для отображения */
  initialValues: SupplierForm;
  /** Callback при нажатии кнопки "Редактировать" */
  onEdit?: () => void;
  /** Callback при подтверждении удаления */
  onDelete?: () => Promise<void>;
  /** Флаг загрузки удаления */
  deleteLoading?: boolean;
};

export function SupplierView({
  initialValues,
  onEdit,
  onDelete,
  deleteLoading,
}: SupplierViewProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <Descriptions column={1} size="small" layout="vertical">
            {initialValues.phone && (
              <Descriptions.Item label="Телефон">
                <Text>{initialValues.phone}</Text>
              </Descriptions.Item>
            )}

            {initialValues.email && (
              <Descriptions.Item label="Почта">
                <Link href={`mailto:${initialValues.email}`}>
                  {initialValues.email}
                </Link>
              </Descriptions.Item>
            )}

            {initialValues.name && (
              <Descriptions.Item label="Имя">
                <Text>{initialValues.name}</Text>
              </Descriptions.Item>
            )}

            {initialValues.organizationName && (
              <Descriptions.Item label="Организация">
                <Text>{initialValues.organizationName}</Text>
              </Descriptions.Item>
            )}

            {initialValues.description && (
              <Descriptions.Item label="Описание">
                <Text>{initialValues.description}</Text>
              </Descriptions.Item>
            )}

            {initialValues.website && (
              <Descriptions.Item label="Сайт">
                <Link href={initialValues.website} target="_blank">
                  {initialValues.website}
                </Link>
              </Descriptions.Item>
            )}

            {initialValues.inn && (
              <Descriptions.Item label="ИНН">
                <Text>{initialValues.inn}</Text>
              </Descriptions.Item>
            )}

            {initialValues.updatedAt && (
              <Descriptions.Item label="Дата">
                <Text>{initialValues.updatedAt}</Text>
              </Descriptions.Item>
            )}

            {initialValues.reliability !== undefined && (
              <Descriptions.Item label="Надежность">
                <Rate disabled value={initialValues.reliability} />
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>

        <div className="pt-4 space-y-2">
            <Button type="primary" block onClick={onEdit}>
              Редактировать
            </Button>
            <Button
              danger
              block
              onClick={() => setIsDeleteModalOpen(true)}
              loading={deleteLoading}
            >
              Удалить
            </Button>
        </div>
      </div>

      <Modal
        title="Удалить?"
        open={isDeleteModalOpen}
        onOk={async () => {
          await onDelete?.();
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true, loading: deleteLoading }}
      >
        <p>Вы уверены?</p>
      </Modal>
    </>
  );
}
