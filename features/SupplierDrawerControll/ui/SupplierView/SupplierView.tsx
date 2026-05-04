import { Descriptions, Typography, Rate, Button, Modal } from "antd";
import { useState } from "react";
import type { SupplierForm } from "@/features/SupplierDrawerControll/model/supplier.types";

const { Text, Link } = Typography;

/**
 * Пропсы компонента SupplierView
 * @property initialValues - Данные поставщика или строй площадки для отображения
 * @property onEdit - Callback при нажатии кнопки "Редактировать"
 * @property onDelete - Callback при подтверждении удаления
 * @property deleteLoading - Флаг загрузки удаления
 */
type SupplierViewProps = {
  initialValues: SupplierForm;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
  deleteLoading?: boolean;
};

export function SupplierView({
  initialValues,
  onEdit,
  onDelete,
  deleteLoading,
}: SupplierViewProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isConstructionSite = initialValues.type === 'constructionSite';

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <Descriptions 
            column={1} 
            size="small" 
            layout="vertical"
            style={{ marginBottom: '8px' }}
            colon={true}
          >
            <>
              {/* Тип */}
              <Descriptions.Item label="Тип" style={{ paddingBottom: '4px' }}>
                <Text>
                  {initialValues.type === 'constructionSite' ? 'Строительная площадка' :
                   initialValues.type === 'specialTechnique' ? 'Спецтехника' :
                   initialValues.type === 'nonMetallicMaterials' ? 'Нерудные материалы' : 'Вывоз мусора'}
                </Text>
              </Descriptions.Item>

              {/* Заказ (только для стройплощадок) */}
              {initialValues.orderNumber && (
                <Descriptions.Item label="Заказ" style={{ paddingBottom: '4px' }}>
                  <Text>{initialValues.orderNumber}</Text>
                </Descriptions.Item>
              )}

              {/* Ответственный (только для стройплощадок) */}
              {initialValues.responsible && (
                <Descriptions.Item label="Ответственный" style={{ paddingBottom: '4px' }}>
                  <Text>{initialValues.responsible}</Text>
                </Descriptions.Item>
              )}

              {/* Телефон (кроме стройплощадок) */}
              {!isConstructionSite && initialValues.phone && (
                <Descriptions.Item label="Телефон" style={{ paddingBottom: '4px' }}>
                  <Text>{initialValues.phone}</Text>
                </Descriptions.Item>
              )}

              {/* Имя (кроме стройплощадок) */}
              {!isConstructionSite && initialValues.name && (
                <Descriptions.Item label="Имя" style={{ paddingBottom: '4px' }}>
                  <Text>{initialValues.name}</Text>
                </Descriptions.Item>
              )}

              {/* Email */}
              {initialValues.email && (
                <Descriptions.Item label="Почта" style={{ paddingBottom: '4px' }}>
                  <Link href={`mailto:${initialValues.email}`}>
                    {initialValues.email}
                  </Link>
                </Descriptions.Item>
              )}

              {/* Организация */}
              {initialValues.organizationName && (
                <Descriptions.Item label="Организация" style={{ paddingBottom: '4px' }}>
                  <Text>{initialValues.organizationName}</Text>
                </Descriptions.Item>
              )}

              {/* Описание */}
              {initialValues.description && (
                <Descriptions.Item label="Описание" style={{ paddingBottom: '4px' }}>
                  <Text>{initialValues.description}</Text>
                </Descriptions.Item>
              )}

              {/* Сайт */}
              {initialValues.website && (
                <Descriptions.Item label="Сайт" style={{ paddingBottom: '4px' }}>
                  <Link href={initialValues.website} target="_blank">
                    {initialValues.website}
                  </Link>
                </Descriptions.Item>
              )}

              {/* ИНН */}
              {initialValues.inn && (
                <Descriptions.Item label="ИНН" style={{ paddingBottom: '4px' }}>
                  <Text>{initialValues.inn}</Text>
                </Descriptions.Item>
              )}

              {/* Способ оплаты */}
              {initialValues.paymentMethod && (
                <Descriptions.Item label="Оплата" style={{ paddingBottom: '4px' }}>
                  <Text>
                    {initialValues.paymentMethod === 'cash' ? 'Нал' : 
                     initialValues.paymentMethod === 'cashless' ? 'Без нал' : 
                     'Оба варианта'}
                  </Text>
                </Descriptions.Item>
              )}

              {/* Надежность */}
              {initialValues.reliability !== undefined && (
                <Descriptions.Item label="Надежность" style={{ paddingBottom: '4px' }}>
                  <Rate disabled value={initialValues.reliability} />
                </Descriptions.Item>
              )}

              {/* Дата обновления */}
              {initialValues.updatedAt && (
                <Descriptions.Item label="Дата" style={{ paddingBottom: '4px' }}>
                  <Text>{initialValues.updatedAt}</Text>
                </Descriptions.Item>
              )}
            </>
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
