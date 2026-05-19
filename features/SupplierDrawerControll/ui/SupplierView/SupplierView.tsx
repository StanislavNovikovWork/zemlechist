import { Descriptions, Typography, Rate, Drawer } from 'antd';
import { useState } from 'react';
import type { SupplierForm } from '@/features/SupplierDrawerControll/model/supplier.types';

const { Text, Link } = Typography;

type InvoiceItem = {
  num: number;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  status: 'В работе' | 'Ожидание счета' | 'Ожидание поставки' | 'Поставлено';
};

export type { InvoiceItem };
export const INVOICE_DATA: InvoiceItem[] = [
  {
    num: 1,
    name: 'Песок карьерный',
    unit: 'куб.м*',
    quantity: 20,
    price: 1598,
    total: 31960,
    status: 'В работе',
  },
  {
    num: 2,
    name: 'Доставка гусеничной техники < 10 тонн',
    unit: 'рейс',
    quantity: 1,
    price: 22400,
    total: 22400,
    status: 'Ожидание счета',
  },
  {
    num: 3,
    name: 'Щебень гравийный фр.20-40',
    unit: 'куб.м*',
    quantity: 20,
    price: 4500,
    total: 90000,
    status: 'Ожидание счета',
  },
  {
    num: 4,
    name: 'Труба дренажная в геотекстиле Ø 110',
    unit: 'пог.м',
    quantity: 100,
    price: 168,
    total: 16800,
    status: 'Ожидание счета',
  },
  {
    num: 5,
    name: 'Геотекстиль нетканый иглопробивной 200 г/м2',
    unit: 'кв.м',
    quantity: 200,
    price: 40,
    total: 8000,
    status: 'Поставлено',
  },
  {
    num: 6,
    name: 'Песок карьерный',
    unit: 'куб.м*',
    quantity: 5,
    price: 1598,
    total: 7990,
    status: 'Ожидание счета',
  },
  {
    num: 7,
    name: 'Муфта соединительная Ø110 ПВХ',
    unit: 'шт.',
    quantity: 4,
    price: 120,
    total: 480,
    status: 'Ожидание счета',
  },
  {
    num: 8,
    name: 'Смотровой колодец Ø315 мм в сборе',
    unit: 'шт.',
    quantity: 2,
    price: 4250,
    total: 8500,
    status: 'Ожидание счета',
  },
  {
    num: 9,
    name: 'Переход для врезки в колодец Ø110',
    unit: 'шт.',
    quantity: 3,
    price: 569,
    total: 1707,
    status: 'Ожидание счета',
  },
  {
    num: 10,
    name: 'Смотровой колодец Ø500 мм в сборе',
    unit: 'шт.',
    quantity: 1,
    price: 11350,
    total: 11350,
    status: 'Ожидание счета',
  },
  {
    num: 11,
    name: 'Доставка материалов автомобилем',
    unit: 'рейс',
    quantity: 1,
    price: 10440,
    total: 10440,
    status: 'Ожидание счета',
  },
  {
    num: 12,
    name: 'Песок карьерный',
    unit: 'куб.м*',
    quantity: 5,
    price: 1598,
    total: 7990,
    status: 'В работе',
  },
  {
    num: 13,
    name: 'Щебень гравийный фр.5-20',
    unit: 'куб.м*',
    quantity: 5,
    price: 4500,
    total: 22500,
    status: 'Ожидание счета',
  },
  {
    num: 14,
    name: 'Геотекстиль нетканый иглопробивной 200 г/м2',
    unit: 'кв.м',
    quantity: 200,
    price: 40,
    total: 8000,
    status: 'Ожидание счета',
  },
  {
    num: 15,
    name: 'Решетка газонная пласт черн ECORASTER S50 330х330х50 мм',
    unit: 'кв.м',
    quantity: 14.63,
    price: 1515,
    total: 22164.45,
    status: 'Ожидание счета',
  },
  {
    num: 16,
    name: 'Грунт плодородный',
    unit: 'куб.м*',
    quantity: 5,
    price: 2400,
    total: 12000,
    status: 'Ожидание счета',
  },
  {
    num: 17,
    name: 'Травосмесь газонная партерная',
    unit: 'кг',
    quantity: 5,
    price: 675,
    total: 3375,
    status: 'Ожидание счета',
  },
  {
    num: 18,
    name: 'Камень плитняк 80-100мм',
    unit: 'кв.м',
    quantity: 11,
    price: 5000,
    total: 55000,
    status: 'Ожидание счета',
  },
  {
    num: 19,
    name: 'Доставка материалов манипулятором',
    unit: 'рейс',
    quantity: 1,
    price: 19140,
    total: 19140,
    status: 'Ожидание счета',
  },
  {
    num: 20,
    name: 'Доставка материалов автомобилем',
    unit: 'рейс',
    quantity: 2,
    price: 10440,
    total: 20880,
    status: 'Ожидание счета',
  },
];

/**
 * Пропсы компонента SupplierView
 * @property initialValues - Данные поставщика или строй площадки для отображения
 * @property onEdit - Callback при нажатии кнопки "Редактировать"
 * @property allMarkers - Все маркеры для поиска поставщика по ID
 */
type SupplierViewProps = {
  initialValues: SupplierForm;
  onEdit?: () => void;
  allMarkers?: any[];
};

export function SupplierView({
  initialValues,
  onEdit,
  allMarkers,
}: SupplierViewProps) {
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
      </div>
    </>
  );
}
