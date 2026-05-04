"use client";

import { Button, Tree, Checkbox } from "antd";
import { useState } from "react";
import { MarkerFeature, MarkersGeoJSON } from "../../types";

/**
 * Пропсы компонента FilterSidebar
 * @property onAddMarker - Callback при нажатии на кнопку добавления маркера
 * @property markers - Массив всех маркеров (поставщики и строй площадки) для отображения в дереве
 * @property onMarkerClick - Callback при клике на маркер в дереве
 * @property onFilterChange - Callback при изменении фильтрации по типам
 */
interface FilterSidebarProps {
  onAddMarker?: () => void;
  markers: MarkersGeoJSON | null;
  onMarkerClick?: (marker: MarkerFeature) => void;
  onFilterChange?: (types: string[] | null) => void;
}

export function FilterSidebar({ onAddMarker, markers, onMarkerClick, onFilterChange }: FilterSidebarProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['objects', 'suppliers']);
  const [checkedTypes, setCheckedTypes] = useState<string[]>(['specialTechnique', 'garbageCollection', 'constructionSite', 'nonMetallicMaterials']);

  const filterOptions = [
    { label: "Спецтехника", value: "specialTechnique" },
    { label: "Вывоз мусора", value: "garbageCollection" },
    { label: "Строй площадки", value: "constructionSite" },
    { label: "Нерудные материалы", value: "nonMetallicMaterials" },
  ];

  const supplierOptions = [
    { label: "Спецтехника", value: "specialTechnique" },
    { label: "Вывоз мусора", value: "garbageCollection" },
    { label: "Нерудные материалы", value: "nonMetallicMaterials" },
  ];

  // Группируем маркеры по типу
  const markersByType = markers?.features?.reduce((acc: Record<string, MarkerFeature[]>, marker) => {
    const type = marker.properties.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(marker);
    return acc;
  }, {}) || {};

  // Фильтруем строй площадки
  const constructionSites = markers?.features?.filter((m: MarkerFeature) => m.properties.type === 'constructionSite') || [];

  // Обработчик изменения чекбоксов
  const handleFilterChange = (checkedValues: string[]) => {
    setCheckedTypes(checkedValues);
    onFilterChange?.(checkedValues.length === 0 ? null : checkedValues);
  };

  // Генерируем элементы дерева для Ant Design Tree
  const treeData = [
    {
      key: 'objects',
      title: 'Объекты',
      children: [
        {
          key: 'suppliers',
          title: 'Поставщики',
          children: supplierOptions.map((option) => ({
            key: option.value,
            title: option.label,
            children: markersByType[option.value]?.map((marker) => ({
              key: String(marker.id),
              title: marker.properties.name || `Маркер #${marker.id}`,
            })) || [],
          })),
        },
        {
          key: 'constructionSite',
          title: 'Строй площадки',
          children: constructionSites.map((site: MarkerFeature) => ({
            key: `cs-${site.id}`,
            title: site.properties.orderNumber ? `Заказ ${site.properties.orderNumber}` : `Строй площадка #${site.id}`,
          })),
        },
      ],
    },
  ];

  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    const key = selectedKeys[0] as string;
    if (!key) return;
    // При клике по дереву сбрасываем фильтрацию
    if (key !== 'objects' && key !== 'suppliers' && key !== 'constructionSite') {
      // Это конкретный маркер — сбрасываем фильтрацию
      setCheckedTypes(['specialTechnique', 'garbageCollection', 'constructionSite', 'nonMetallicMaterials']);
      onFilterChange?.(null);
    }
    if (key.startsWith('cs-')) {
      const siteId = parseInt(key.replace('cs-', ''));
      const site = markers?.features?.find((m: MarkerFeature) => m.id === siteId);
      if (site) {
        onMarkerClick?.(site);
      }
    } else {
      const marker = markers?.features?.find((m: MarkerFeature) => String(m.id) === key);
      if (marker) {
        onMarkerClick?.(marker);
      }
    }
  };

  return (
    <div className="w-[300px] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">      
      <div className="flex-1 overflow-hidden flex flex-col">
        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300 flex-shrink-0">Дерево объектов</h4>
        <div className="mb-3 flex-shrink-0">
          {filterOptions.map((option) => (
            <div key={option.value} className="mb-2">
              <Checkbox
                checked={checkedTypes.includes(option.value)}
                onChange={(e) => {
                  const newChecked = e.target.checked
                    ? [...checkedTypes, option.value]
                    : checkedTypes.filter((t) => t !== option.value);
                  handleFilterChange(newChecked);
                }}
              >
                {option.label}
              </Checkbox>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          <Tree
            className="my-tree"
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            onSelect={handleSelect}
            treeData={treeData}
          />
        </div>
      </div>

      <Button
        type="primary"
        block
        onClick={onAddMarker}
        className="flex-shrink-0 mt-4"
      >
        Добавить точку
      </Button>
    </div>
  );
}
