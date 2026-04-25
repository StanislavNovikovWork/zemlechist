"use client";

import { Checkbox } from "antd";
import { useState, useEffect } from "react";

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
  const [selectAll, setSelectAll] = useState(true);

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

  return (
    <div className="w-[300px] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Фильтры</h3>
      
      <div className="mb-6">
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
    </div>
  );
}
