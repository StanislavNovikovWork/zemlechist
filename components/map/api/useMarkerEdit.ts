import { useState } from "react";

/**
 * Хук для управления режимом редактирования маркера
 * @returns Объект с состоянием и функциями для редактирования
 */
export function useMarkerEdit() {
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Начать редактирование маркера
   * @param properties - Свойства маркера для редактирования
   */
  const startEditing = (properties: any) => {
    setIsEditing(false);
  };

  /**
   * Переключить режим редактирования
   */
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  /**
   * Сохранить изменения
   */
  const saveChanges = () => {
    // TODO: отправить изменения на сервер
    setIsEditing(false);
  };

  /**
   * Сбросить состояние редактирования
   */
  const resetEditing = () => {
    setIsEditing(false);
  };

  return {
    isEditing,
    startEditing,
    toggleEdit,
    saveChanges,
    resetEditing,
  };
}
