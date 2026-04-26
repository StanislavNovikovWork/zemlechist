"use client";

import { Checkbox, Button, Menu } from "antd";
import { useState, useEffect } from "react";
import { MarkerFeature, MarkersGeoJSON } from "../../types";

/**
 * Пропсы компонента FilterSidebar
 * @property selectedTypes - Выбранные типы маркеров для фильтрации
 * @property onTypeChange - Callback при изменении выбранных типов
 * @property onAddMarker - Callback при нажатии на кнопку добавления маркера
 * @property markers - Массив маркеров для отображения в дереве
 * @property onMarkerClick - Callback при клике на маркер в дереве
 */
interface FilterSidebarProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  onAddMarker?: () => void;
  markers: MarkersGeoJSON | null;
  onMarkerClick?: (marker: MarkerFeature) => void;
}

export function FilterSidebar({ selectedTypes, onTypeChange, onAddMarker, markers, onMarkerClick }: FilterSidebarProps) {
  const [selectAll, setSelectAll] = useState(true);
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);

  const options = [
    { label: "Спецтехника", value: "specialTechnique" },
    { label: "Вывоз мусора", value: "garbageCollection" },
  ];

  const allTypes = options.map((opt) => opt.value);

  useEffect(() => {
    if (selectedTypes.length === allTypes.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedTypes, allTypes.length]);

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      onTypeChange(allTypes);
    } else {
      onTypeChange([]);
    }
  };

  const handleTypeChange = (value: string, checked: boolean) => {
    if (checked) {
      onTypeChange([...selectedTypes, value]);
    } else {
      onTypeChange(selectedTypes.filter((type) => type !== value));
    }
  };

  // Группируем маркеры по типу
  const markersByType = markers?.features?.reduce((acc: Record<string, MarkerFeature[]>, marker) => {
    const type = marker.properties.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(marker);
    return acc;
  }, {}) || {};

  // Генерируем элементы меню для Ant Design Menu
  const menuItems = options.map((option) => ({
    key: option.value,
    label: option.label,
    children: markersByType[option.value]?.map((marker) => ({
      key: String(marker.id),
      label: marker.properties.name || `Маркер #${marker.id}`,
      onClick: () => onMarkerClick?.(marker),
    })) || [],
  }));

  return (
    <div className="w-[300px] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Фильтры</h3>
      
      <div className="mb-6 flex-shrink-0">
        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Тип маркера</h4>
        <ul className="space-y-2">
          <li>
            <Checkbox
              checked={selectAll}
              onChange={(e) => handleSelectAllChange(e.target.checked)}
            >
              Выбрать все
            </Checkbox>
          </li>
          {options.map((option) => (
            <li key={option.value}>
              <Checkbox
                checked={selectedTypes.includes(option.value)}
                onChange={(e) => handleTypeChange(option.value, e.target.checked)}
              >
                {option.label}
              </Checkbox>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300 flex-shrink-0">Дерево маркеров</h4>
        <div className="flex-1 overflow-y-auto">
          <Menu
            mode="inline"
            openKeys={menuOpenKeys}
            onOpenChange={setMenuOpenKeys}
            items={menuItems}
            style={{ borderRight: 0 }}
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
