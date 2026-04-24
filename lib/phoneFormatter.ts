/**
 * Форматирует номер телефона в формат 8 (999) 999-99-99
 * @param input - Входная строка с номером телефона
 * @returns Отформатированный номер телефона
 */
export function formatPhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, "");
  
  if (digits.length === 0) return "";
  
  if (digits.length <= 1) {
    return `8 (${digits}`;
  }
  
  if (digits.length <= 4) {
    return `8 (${digits.slice(1, 4)}`;
  }
  
  if (digits.length <= 7) {
    return `8 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}`;
  }
  
  if (digits.length <= 9) {
    return `8 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}`;
  }
  
  return `8 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
}
