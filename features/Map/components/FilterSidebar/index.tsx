"use client";

import { Button, Tree } from "antd";
import { useState } from "react";
import { MarkerFeature, MarkersGeoJSON } from "../../types";

/**
 * Пропсы компонента FilterSidebar
 * @property onAddMarker - Callback при нажатии на кнопку добавления маркера
 * @property markers - Массив маркеров для отображения в дереве
 * @property onMarkerClick - Callback при клике на маркер в дереве
 * @property onTypeSelect - Callback при выборе типа маркера для фильтрации
 * @property onAllTypesSelect - Callback при выборе всех типов
 */
interface FilterSidebarProps {
  onAddMarker?: () => void;
  markers: MarkersGeoJSON | null;
  onMarkerClick?: (marker: MarkerFeature) => void;
  onTypeSelect?: (type: string) => void;
  onAllTypesSelect?: () => void;
}

export function FilterSidebar({ onAddMarker, markers, onMarkerClick, onTypeSelect, onAllTypesSelect }: FilterSidebarProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['suppliers']);

  const options = [
    { label: "Спецтехника", value: "specialTechnique" },
    { label: "Вывоз мусора", value: "garbageCollection" },
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

  // Генерируем элементы дерева для Ant Design Tree
  const treeData = [
    {
      key: 'suppliers',
      title: 'Поставщики',
      children: options.map((option) => ({
        key: option.value,
        title: option.label,
        children: markersByType[option.value]?.map((marker) => ({
          key: String(marker.id),
          title: marker.properties.name || `Маркер #${marker.id}`,
        })) || [],
      })),
    },
  ];

  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    const key = selectedKeys[0] as string;
    if (key === 'suppliers') {
      onAllTypesSelect?.();
    } else if (options.some(opt => opt.value === key)) {
      onTypeSelect?.(key);
    } else {
      // Это маркер
      const marker = markers?.features?.find((m: MarkerFeature) => String(m.id) === key);
      if (marker) {
        onMarkerClick?.(marker);
      }
    }
  };

  return (
    <div className="w-[300px] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">      
      <div className="flex-1 overflow-hidden flex flex-col">
        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300 flex-shrink-0">Дерево маркеров</h4>
        <div className="flex-1 overflow-y-auto">
          <Tree
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
