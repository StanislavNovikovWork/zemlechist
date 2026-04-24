import { Input } from "antd";
import { ChangeEvent } from "react";
import { formatPhoneNumber } from "@/lib/phoneFormatter";

/**
 * Пропсы компонента PhoneInput
 * @property value - Значение телефона
 * @property onChange - Callback при изменении значения
 */
interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Компонент для ввода телефона с маской 8 (999) 999-99-99
 */
export function PhoneInput({ value = "", onChange }: PhoneInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange?.(formatted);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const formatted = formatPhoneNumber(pastedText);
    onChange?.(formatted);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      onPaste={handlePaste}
      placeholder="+7 (___) ___-__-__"
    />
  );
}
