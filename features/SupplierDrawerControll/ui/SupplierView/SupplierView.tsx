import { Descriptions, Typography, Rate, Button, Modal, Drawer } from 'antd';
import { useState } from 'react';
import type { SupplierForm } from '@/features/SupplierDrawerControll/model/supplier.types';

const { Text, Link } = Typography;

/**
 * Пропсы компонента SupplierView
 * @property initialValues - Данные поставщика или строй площадки для отображения
 * @property onEdit - Callback при нажатии кнопки "Редактировать"
 * @property onDelete - Callback при подтверждении удаления
 * @property deleteLoading - Флаг загрузки удаления
 * @property allMarkers - Все маркеры для поиска поставщика по ID
 */
type SupplierViewProps = {
  initialValues: SupplierForm;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
  deleteLoading?: boolean;
  allMarkers?: any[];
};

export function SupplierView({
  initialValues,
  onEdit,
  onDelete,
  deleteLoading,
  allMarkers,
}: SupplierViewProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSupplierDrawerOpen, setIsSupplierDrawerOpen] = useState(false);
  const isConstructionSite = initialValues.type === 'constructionSite';

  // Находим поставщиков по ID из всех маркеров
  const garbageSuppliers =
    allMarkers?.filter((marker: any) =>
      initialValues.garbageCollectionSupplier?.includes(marker.id)
    ) || [];
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
                  {initialValues.type === 'constructionSite'
                    ? 'Строительная площадка'
                    : initialValues.type === 'specialTechnique'
                      ? 'Спецтехника'
                      : initialValues.type === 'nonMetallicMaterials'
                        ? 'Нерудные материалы'
                        : 'Вывоз мусора'}
                </Text>
              </Descriptions.Item>

              {!isConstructionSite &&
                initialValues.zones &&
                initialValues.zones.length > 0 && (
                  <Descriptions.Item
                    label="Зоны работ"
                    style={{ paddingBottom: '4px' }}
                  >
                    <Text>
                      {initialValues.zones[0] === 'all'
                        ? 'Все зоны'
                        : initialValues.zones.join(', ')}
                    </Text>
                  </Descriptions.Item>
                )}

              {/* Заказ (только для стройплощадок) */}
              {initialValues.orderNumber && (
                <Descriptions.Item
                  label="Заказ"
                  style={{ paddingBottom: '4px' }}
                >
                  <Text>{initialValues.orderNumber}</Text>
                </Descriptions.Item>
              )}

              {/* Ответственный (только для стройплощадок) */}
              {initialValues.responsible && (
                <Descriptions.Item
                  label="Ответственный"
                  style={{ paddingBottom: '4px' }}
                >
                  <Text>{initialValues.responsible}</Text>
                </Descriptions.Item>
              )}

              {/* Продолжительность (только для стройплощадок) */}
              {isConstructionSite &&
                initialValues.duration &&
                initialValues.duration.period1 && (
                  <Descriptions.Item
                    label="Продолжительность"
                    style={{ paddingBottom: '4px' }}
                  >
                    <Text>
                      {(() => {
                        const formatDate = (dateValue: any) => {
                          if (typeof dateValue === 'string') {
                            // Проверяем формат дд.мм.гггг
                            if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateValue)) {
                              return dateValue;
                            }
                            // Пробуем распарсить другие строки
                            const parsed = new Date(dateValue);
                            if (!isNaN(parsed.getTime())) {
                              return parsed.toLocaleDateString();
                            }
                            return dateValue; // возвращаем как есть если не удалось распарсить
                          }

                          if (dateValue instanceof Date) {
                            if (!isNaN(dateValue.getTime())) {
                              return dateValue.toLocaleDateString();
                            }
                            return 'Некорректная дата';
                          }

                          if (dateValue && typeof dateValue === 'object') {
                            // Проверяем на Dayjs объект
                            if ('$L' in dateValue && '$d' in dateValue) {
                              const dayjsDate = (dateValue as any).$d;
                              if (
                                dayjsDate instanceof Date &&
                                !isNaN(dayjsDate.getTime())
                              ) {
                                return dayjsDate.toLocaleDateString();
                              }
                            }
                            // Проверяем наличие метода toLocaleDateString
                            if ('toLocaleDateString' in dateValue) {
                              try {
                                return (dateValue as any).toLocaleDateString();
                              } catch {
                                return 'Некорректная дата';
                              }
                            }
                          }

                          return 'Некорректная дата';
                        };
                        return `${formatDate(initialValues.duration.period1[0])} - ${formatDate(initialValues.duration.period1[1])}`;
                      })()}
                      {initialValues.duration.period2 && (
                        <>
                          <br />
                          {(() => {
                            const formatDate = (dateValue: any) => {
                              if (typeof dateValue === 'string') {
                                // Проверяем формат дд.мм.гггг
                                if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateValue)) {
                                  return dateValue;
                                }
                                // Пробуем распарсить другие строки
                                const parsed = new Date(dateValue);
                                if (!isNaN(parsed.getTime())) {
                                  return parsed.toLocaleDateString();
                                }
                                return dateValue; // возвращаем как есть если не удалось распарсить
                              }

                              if (dateValue instanceof Date) {
                                if (!isNaN(dateValue.getTime())) {
                                  return dateValue.toLocaleDateString();
                                }
                                return 'Некорректная дата';
                              }

                              if (dateValue && typeof dateValue === 'object') {
                                // Проверяем на Dayjs объект
                                if ('$L' in dateValue && '$d' in dateValue) {
                                  const dayjsDate = (dateValue as any).$d;
                                  if (
                                    dayjsDate instanceof Date &&
                                    !isNaN(dayjsDate.getTime())
                                  ) {
                                    return dayjsDate.toLocaleDateString();
                                  }
                                }
                                // Проверяем наличие метода toLocaleDateString
                                if ('toLocaleDateString' in dateValue) {
                                  try {
                                    return (
                                      dateValue as any
                                    ).toLocaleDateString();
                                  } catch {
                                    return 'Некорректная дата';
                                  }
                                }
                              }

                              return 'Некорректная дата';
                            };
                            return `${formatDate(initialValues.duration.period2[0])} - ${formatDate(initialValues.duration.period2[1])}`;
                          })()}
                        </>
                      )}
                    </Text>
                  </Descriptions.Item>
                )}

              {/* Координаты (только для стройплощадок) */}
              {isConstructionSite && initialValues.coordinates && (
                <Descriptions.Item
                  label="Координаты"
                  style={{ paddingBottom: '4px' }}
                >
                  <Text>{`${initialValues.coordinates[1]}, ${initialValues.coordinates[0]}`}</Text>
                </Descriptions.Item>
              )}

              {/* Телефон (кроме стройплощадок) */}
              {!isConstructionSite && initialValues.phone && (
                <Descriptions.Item
                  label="Телефон"
                  style={{ paddingBottom: '4px' }}
                >
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
                <Descriptions.Item
                  label="Почта"
                  style={{ paddingBottom: '4px' }}
                >
                  <Link href={`mailto:${initialValues.email}`}>
                    {initialValues.email}
                  </Link>
                </Descriptions.Item>
              )}

              {/* Организация */}
              {initialValues.organizationName && (
                <Descriptions.Item
                  label="Организация"
                  style={{ paddingBottom: '4px' }}
                >
                  <Text>{initialValues.organizationName}</Text>
                </Descriptions.Item>
              )}

              {/* Описание */}
              {initialValues.description && (
                <Descriptions.Item
                  label="Описание"
                  style={{ paddingBottom: '4px' }}
                >
                  <Text>{initialValues.description}</Text>
                </Descriptions.Item>
              )}

              {/* Зоны (только для не-строительных площадок) */}

              {/* Сайт */}
              {initialValues.website && (
                <Descriptions.Item
                  label="Сайт"
                  style={{ paddingBottom: '4px' }}
                >
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
                <Descriptions.Item
                  label="Оплата"
                  style={{ paddingBottom: '4px' }}
                >
                  <Text>
                    {initialValues.paymentMethod === 'cash'
                      ? 'Нал'
                      : initialValues.paymentMethod === 'cashless'
                        ? 'Без нал'
                        : 'Оба варианта'}
                  </Text>
                </Descriptions.Item>
              )}

              {/* Надежность (кроме стройплощадок) */}
              {!isConstructionSite &&
                initialValues.reliability !== undefined && (
                  <Descriptions.Item
                    label="Надежность"
                    style={{ paddingBottom: '4px' }}
                  >
                    <Rate disabled value={initialValues.reliability} />
                  </Descriptions.Item>
                )}

              {/* Дата обновления */}
              {initialValues.updatedAt && (
                <Descriptions.Item
                  label="Дата"
                  style={{ paddingBottom: '4px' }}
                >
                  <Text>{initialValues.updatedAt}</Text>
                </Descriptions.Item>
              )}
            </>
          </Descriptions>

          {/* Блок Поставщики (только для стройплощадок) */}
          {isConstructionSite && garbageSuppliers.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Поставщики
              </h4>
              <div className="space-y-2">
                {garbageSuppliers.map((supplier: any) => (
                  <div key={supplier.id}>
                    <span className="text-xs text-gray-500">
                      {supplier.properties.type === 'garbageCollection'
                        ? 'Вывоз мусора'
                        : supplier.properties.type === 'specialTechnique'
                          ? 'Спецтехника'
                          : 'Нерудные материалы'}
                    </span>
                    <div className="ml-2">
                      <Text
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                        onClick={() => setIsSupplierDrawerOpen(true)}
                      >
                        {supplier.properties.name ||
                          `Поставщик #${supplier.id}`}
                      </Text>
                      {supplier.properties.phone && (
                        <Text style={{ marginLeft: '4px' }}>
                          {supplier.properties.phone}
                        </Text>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Вложенный drawer с информацией о поставщике */}
        <Drawer
          title="Информация о поставщике"
          placement="right"
          open={isSupplierDrawerOpen}
          onClose={() => setIsSupplierDrawerOpen(false)}
          size={420}
          rootClassName="glass-drawer"
        >
          {garbageSuppliers.map((garbageSupplier: any) => (
            <Descriptions
              key={garbageSupplier.id}
              column={1}
              size="small"
              layout="vertical"
              colon={true}
            >
              <Descriptions.Item label="Тип">
                <Text>
                  {garbageSupplier.properties.type === 'garbageCollection'
                    ? 'Вывоз мусора'
                    : garbageSupplier.properties.type === 'specialTechnique'
                      ? 'Спецтехника'
                      : 'Нерудные материалы'}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Название">
                <Text>
                  {garbageSupplier.properties.name ||
                    `Поставщик #${garbageSupplier.id}`}
                </Text>
              </Descriptions.Item>

              {garbageSupplier.properties.phone && (
                <Descriptions.Item label="Телефон">
                  <Text>{garbageSupplier.properties.phone}</Text>
                </Descriptions.Item>
              )}

              {garbageSupplier.properties.description && (
                <Descriptions.Item label="Описание">
                  <Text>{garbageSupplier.properties.description}</Text>
                </Descriptions.Item>
              )}

              {garbageSupplier.properties.website && (
                <Descriptions.Item label="Сайт">
                  <Link
                    href={garbageSupplier.properties.website}
                    target="_blank"
                  >
                    {garbageSupplier.properties.website}
                  </Link>
                </Descriptions.Item>
              )}

              {garbageSupplier.properties.email && (
                <Descriptions.Item label="Email">
                  <Text>{garbageSupplier.properties.email}</Text>
                </Descriptions.Item>
              )}

              {garbageSupplier.properties.inn && (
                <Descriptions.Item label="ИНН">
                  <Text>{garbageSupplier.properties.inn}</Text>
                </Descriptions.Item>
              )}

              {garbageSupplier.properties.organizationName && (
                <Descriptions.Item label="Организация">
                  <Text>{garbageSupplier.properties.organizationName}</Text>
                </Descriptions.Item>
              )}

              {garbageSupplier.properties.reliability !== undefined && (
                <Descriptions.Item label="Надежность">
                  <Rate
                    disabled
                    value={garbageSupplier.properties.reliability}
                  />
                </Descriptions.Item>
              )}

              {garbageSupplier.properties.updatedAt && (
                <Descriptions.Item label="Дата обновления">
                  <Text>{garbageSupplier.properties.updatedAt}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          ))}
        </Drawer>

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
