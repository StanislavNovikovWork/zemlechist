"use client";

import { Button, Tree } from "antd";
import { useState } from "react";
import { MarkerFeature, MarkersGeoJSON } from "../../types";
import { FilterCard } from "@/ui";
import {
  TruckOutlined,
  DeleteOutlined,
  HomeOutlined,
  GoldOutlined,
} from "@ant-design/icons";

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
    { 
      label: "Спецтехника", 
      value: "specialTechnique",
      icon: <TruckOutlined />,
      color: 'blue' as const,
    },
    { 
      label: "Вывоз мусора", 
      value: "garbageCollection",
      icon: <DeleteOutlined />,
      color: 'blue' as const,
    },
    { 
      label: "Строй площадки", 
      value: "constructionSite",
      icon: <HomeOutlined />,
      color: 'blue' as const,
    },
    { 
      label: "Нерудные материалы", 
      value: "nonMetallicMaterials",
      icon: <GoldOutlined />,
      color: 'blue' as const,
    },
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
          children: constructionSites.map((site: MarkerFeature) => {
            const orderNum = site.properties.orderNumber;
            const responsible = site.properties.responsible;
            let title: string;
            
            if (orderNum && responsible) {
              title = `${orderNum} ${responsible}`;
            } else if (orderNum) {
              title = orderNum;
            } else if (responsible) {
              title = responsible;
            } else {
              title = `Строй площадка #${site.id}`;
            }
            
            return {
              key: `cs-${site.id}`,
              title,
            };
          }),
        },
      ],
    },
  ];

  const handleSelect = (selectedKeys: React.Key[]) => {
    const key = selectedKeys[0] as string;
    if (!key) return;
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

  const handleReset = () => {
    setCheckedTypes(['specialTechnique', 'garbageCollection', 'constructionSite', 'nonMetallicMaterials']);
    onFilterChange?.(null);
  };

  return (
    <div className="w-[300px] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-900">Быстрые фильтры</h4>
          <button 
            onClick={handleReset}
            className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Сбросить
          </button>
        </div>
        <div className="mb-3 flex-shrink-0 space-y-2">
          {filterOptions.map((option) => (
            <FilterCard
              key={option.value}
              icon={option.icon}
              label={option.label}
              count={markersByType[option.value]?.length || 0}
              checked={checkedTypes.includes(option.value)}
              onChange={(checked) => {
                const newChecked = checked
                  ? [...checkedTypes, option.value]
                  : checkedTypes.filter((t) => t !== option.value);
                handleFilterChange(newChecked);
              }}
              color={option.color}
            />
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
