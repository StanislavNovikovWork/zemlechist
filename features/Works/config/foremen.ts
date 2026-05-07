/**
 * Конфигурация данных прорабов
 */

export interface Foreman {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
}

/**
 * Список прорабов для использования в системе заказов
 */
export const foremenConfig: Foreman[] = [
   {
    id: 1,
    name: "Абрамов Алексей",
    firstName: "Алексей",
    lastName: "Абрамов",
  },
    {
    id: 2,
    name: "Липаткин Максим",
    firstName: "Максим",
    lastName: "Липаткин",
  },
  {
    id: 3,
    name: "Гулин Георгий",
    firstName: "Георгий",
    lastName: "Гулин",
  },
  {
    id: 4,
    name: "Ломакин Александр",
    firstName: "Александр",
    lastName: "Ломакин",
  },
  {
    id: 5,
    name: "Орлов Максим",
    firstName: "Максим",
    lastName: "Орлов",
  },
    {
    id: 6,
    name: "Добросол Андрей",
    firstName: "Андрей",
    lastName: "Добросол",
  },
];

/**
 * Функция для получения прораба по ID
 */
export const getForemanById = (id: number): Foreman | undefined => {
  return foremenConfig.find(foreman => foreman.id === id);
};

/**
 * Функция для получения всех прорабов
 */
export const getAllForemen = (): Foreman[] => {
  return foremenConfig;
};
