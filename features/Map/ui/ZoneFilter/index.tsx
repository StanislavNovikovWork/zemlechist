"use client";

import { Collapse, Checkbox } from "antd";

/**
 * Пропсы компонента ZoneFilter
 * @property visibleZones - Объект с видимостью зон (ключ - номер зоны, значение - boolean)
 * @property onZoneToggle - Callback при изменении видимости зоны
 */
interface ZoneFilterProps {
  visibleZones: Record<number, boolean>;
  onZoneToggle: (zoneNumber: number, visible: boolean) => void;
}

export function ZoneFilter({ visibleZones, onZoneToggle }: ZoneFilterProps) {
  const zones = [
    { id: 1, name: 'Зона работ' },
    { id: 2, name: 'Зона 1' },
    { id: 3, name: 'Зона 2' },
    { id: 4, name: 'Зона 3' },
    { id: 5, name: 'Зона 4' },
    { id: 6, name: 'Зона 5' },
    { id: 7, name: 'Зона 6' },
    { id: 8, name: 'Зона 7' },
    { id: 9, name: 'Зона 8' },
  ];

  const handleCheckboxChange = (zoneNumber: number, checked: boolean) => {
    onZoneToggle(zoneNumber, checked);
  };

  const handleSelectAll = () => {
    zones.forEach(zone => {
      onZoneToggle(zone.id, true);
    });
  };

  const handleDeselectAll = () => {
    zones.forEach(zone => {
      onZoneToggle(zone.id, false);
    });
  };

  const allSelected = zones.every(zone => visibleZones[zone.id]);
  const someSelected = zones.some(zone => visibleZones[zone.id]);

  return (
    <div className="absolute top-2 left-80 z-[1000]">
      <Collapse 
        size="small" 
        style={{ width: 180, backgroundColor: 'white' }}
        ghost={false}
        items={[
          {
            key: 'zones',
            label: 'Фильтр зон',
            children: (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleSelectAll();
                      } else {
                        handleDeselectAll();
                      }
                    }}
                  >
                    Выбрать все
                  </Checkbox>
                </div>
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center">
                    <Checkbox
                      checked={visibleZones[zone.id] || false}
                      onChange={(e) => handleCheckboxChange(zone.id, e.target.checked)}
                    >
                      {zone.name}
                    </Checkbox>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
