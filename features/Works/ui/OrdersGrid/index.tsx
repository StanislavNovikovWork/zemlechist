"use client";

import React, { useState, useMemo } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { foremenConfig, Foreman } from "../../config/foremen";
import { useMarkersQuery } from "@/features/Map/hooks/queries/useMarkersQuery";
import { useSupplierDrawerController } from "@/features/SupplierDrawerControll/model/supplierDrawer.store";
import dayjs from 'dayjs';
import type { MarkerFeature } from "@/features/Map/types";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

interface OrdersGridProps {}

/**
 * Компонент сетки заказов
 * Отображает прорабов слева и календарь с датами сверху
 */
export const OrdersGrid: React.FC<OrdersGridProps> = () => {
  // Данные прорабов из конфига
  const foremen = foremenConfig;

  // Состояние для текущего отображаемого месяца
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Получаем данные маркеров с бэкенда
  const { data: markersData, isLoading } = useMarkersQuery();

  // Контроллер для открытия формы создания поставщика
  const { openCreateSupplier, openViewSupplier } = useSupplierDrawerController();

  // Фильтруем и группируем строй площадки по прорабам и датам
  const constructionSitesByForeman = useMemo(() => {
    if (!markersData?.features) return {};

    const filtered = markersData.features.filter(
      (feature: MarkerFeature) => feature.properties.type === 'constructionSite' && 
                  feature.properties.responsible && 
                  feature.properties.duration
    );

    const grouped: Record<string, Record<string, any[]>> = {};

    filtered.forEach((site: MarkerFeature) => {
      const responsible = site.properties.responsible;
      const duration = site.properties.duration;
      
      if (duration && duration.length === 2 && duration[0] && duration[1] && responsible) {
        const startDate = dayjs(duration[0], 'DD.MM.YYYY');
        const endDate = dayjs(duration[1], 'DD.MM.YYYY');
        
        // Создаем все даты в диапазоне
        let currentDate = startDate;
        while (currentDate.isSameOrBefore(endDate)) {
          const dateKey = currentDate.format('YYYY-MM-DD');
          
          if (!grouped[responsible]) {
            grouped[responsible] = {};
          }
          if (!grouped[responsible][dateKey]) {
            grouped[responsible][dateKey] = [];
          }
          
          grouped[responsible][dateKey].push({
            id: site.id,
            orderNumber: site.properties.orderNumber,
            name: site.properties.name,
          });
          
          currentDate = currentDate.add(1, 'day');
        }
      }
    });

    return grouped;
  }, [markersData]);

  // Генерация дат для указанного месяца
  const generateDatesForMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const dates = [];
    for (let day = 1; day <= lastDay.getDate(); day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
  };

  // Навигация по месяцам
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Форматирование названия месяца
  const formatMonthYear = (date: Date) => {
    const monthYear = date.toLocaleDateString('ru-RU', { 
      month: 'long', 
      year: 'numeric'
    });
    // Делаем первую букву заглавной
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
  };

  // Проверка, является ли день выходным
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 - воскресенье, 6 - суббота
  };

  // Проверка, является ли день текущим
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const dates = generateDatesForMonth(currentMonth);

  // Получаем строй площадки для конкретной ячейки
  const getConstructionSitesForCell = (foreman: Foreman, date: Date) => {
    const dateKey = dayjs(date).format('YYYY-MM-DD');
    return constructionSitesByForeman[foreman.name]?.[dateKey] || [];
  };

  // Обработчик клика по строй площадке
  const handleSiteClick = (site: { id: number; orderNumber?: string; name?: string }) => {
    // Находим полный объект поставщика по ID
    const supplier = markersData?.features?.find((marker: MarkerFeature) => marker.id === site.id);
    if (supplier) {
      // Преобразуем в формат SupplierForm
      const supplierData: any = {
        id: supplier.id,
        ...supplier.properties
      };
      
      // Конвертируем duration из строк в Dayjs объекты, если это стройплощадка
      if (supplierData.type === 'constructionSite' && supplierData.duration && Array.isArray(supplierData.duration)) {
        supplierData.duration = supplierData.duration.map((dateStr: string) => dayjs(dateStr, 'DD.MM.YYYY'));
      }
      
      openViewSupplier(supplierData);
    }
  };

  // Обработчик клика по кнопке добавления точки
  const handleAddMarker = () => {
    openCreateSupplier({ type: 'constructionSite' });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white">
      {/* Заголовок с навигацией по месяцам */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">Работы</h1>
            <button
              onClick={handleAddMarker}
              className="w-6 h-6 bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-colors flex-shrink-0 rounded-md cursor-pointer"
              title="Добавить точку"
            >
              <span className="text-[16px] leading-none relative top-[-1px]">+</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Предыдущий месяц"
            >
              <LeftOutlined className="text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-800 min-w-48 text-center">
              {formatMonthYear(currentMonth)}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Следующий месяц"
            >
              <RightOutlined className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Таблица с фиксированным столбцом */}
      <div className="overflow-x-auto bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {/* Заголовок прорабов */}
              <th className="w-48 min-w-48 h-16 p-2 bg-gray-50 border border-gray-200 text-left font-semibold text-gray-700 sticky left-0 z-10">
                Прораб
              </th>
              {/* Заголовки дат */}
              {dates.map((date, index) => (
                <th
                  key={index}
                  className={`w-40 min-w-40 h-16 p-2 border border-gray-200 text-center ${
                    isToday(date) ? 'border-l-2 border-l-blue-400 border-r-2 border-r-blue-400' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {date.getDate()}.{String(date.getMonth() + 1).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foremen.map((foreman: Foreman) => (
              <tr key={foreman.id}>
                {/* Ячейка с именем прораба */}
                <td className="w-48 min-w-48 h-16 p-3 bg-gray-50 border border-gray-200 font-medium text-gray-700 sticky left-0 z-10">
                  {foreman.name}
                </td>
                {/* Ячейки для заказов */}
                {dates.map((date, index) => {
                  const sites = getConstructionSitesForCell(foreman, date);
                  return (
                    <td
                      key={index}
                      className={`w-40 min-w-40 h-16 p-1 border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                        isToday(date) ? 'border-l-2 border-l-blue-400 border-r-2 border-r-blue-400' : ''
                      }`}
                    >
                      <div className="space-y-1">
                        {sites.map((site) => (
                          <div
                            key={site.id}
                            onClick={() => handleSiteClick(site)}
                            className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs font-medium text-blue-800 cursor-pointer transition-colors truncate"
                            title={site.orderNumber || site.name}
                          >
                            {site.orderNumber || site.name}
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
