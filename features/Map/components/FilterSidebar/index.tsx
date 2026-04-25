"use client";

import { Checkbox } from "antd";

/**
 * Пропсы компонента FilterSidebar
 * @property selectedTypes - Выбранные типы маркеров для фильтрации
 * @property onTypeChange - Callback при изменении выбранных типов
 */
interface FilterSidebarProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export function FilterSidebar({ selectedTypes, onTypeChange }: FilterSidebarProps) {
  const options = [
    { label: "Спецтехника", value: "specialTechnique" },
    { label: "Вывоз мусора", value: "garbageCollection" },
  ];

  return (
    <div className="w-[300px] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Фильтры</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Тип маркера</h4>
        <Checkbox.Group
          options={options}
          value={selectedTypes}
          onChange={onTypeChange}
          className="flex flex-col gap-2"
        />
      </div>
    </div>
  );
}
