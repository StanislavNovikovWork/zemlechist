"use client";

import React, { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { foremenConfig, Foreman } from "../../config/foremen";

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

  return (
    <div className="h-full overflow-auto bg-white">
      {/* Заголовок с навигацией по месяцам */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
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
                    isToday(date) ? 'border-l-4 border-l-blue-500 border-r-4 border-r-blue-500' : ''
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
                {dates.map((date, index) => (
                  <td
                    key={index}
                    className={`w-40 min-w-40 h-16 p-1 border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                      isToday(date) ? 'border-l-4 border-l-blue-500 border-r-4 border-r-blue-500' : ''
                    }`}
                  >
                    {/* Здесь будут размещаться заказы */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
