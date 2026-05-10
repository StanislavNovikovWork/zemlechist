import React from 'react';
import { TractorIcon } from '@/components/icons/TractorIcon';

interface SpecialTechniqueMarkerProps {
  color: string;
  size?: number;
  hasGoldBorder?: boolean;
}

/**
 * Компонент маркера для спецтехники с иконкой трактора
 * @param color - цвет маркера
 * @param size - размер маркера
 * @param hasGoldBorder - флаг золотого бордера для высокой надежности
 */
export function SpecialTechniqueMarker({ color, size = 42, hasGoldBorder = false }: SpecialTechniqueMarkerProps) {
  return (
    <svg 
      width={size} 
      height={size * 1.14} 
      viewBox="0 0 60 68" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Золотой бордер для надежности 5 */}
      {hasGoldBorder && (
        <g transform="translate(7 5)" fill="none" stroke="#FFD700" strokeWidth="4">
          <path d="M23.51 51.523c-.01.267-.23.477-.52.477a.5.5 0 0 1-.5-.477c-.145-3.168-1.756-5.217-4.832-6.147C7.53 42.968 0 33.863 0 23 0 10.297 10.297 0 23 0s23 10.297 23 23c0 10.863-7.53 19.968-17.658 22.376-3.076.93-4.687 2.98-4.83 6.147z"/>
        </g>
      )}
      
      <g transform="translate(7 5)" fill={color}>
        <path d="M23.51 51.523c-.01.267-.23.477-.52.477a.5.5 0 0 1-.5-.477c-.145-3.168-1.756-5.217-4.832-6.147C7.53 42.968 0 33.863 0 23 0 10.297 10.297 0 23 0s23 10.297 23 23c0 10.863-7.53 19.968-17.658 22.376-3.076.93-4.687 2.98-4.83 6.147z"/>
      </g>

      <circle cx="30" cy="64" r="4" fill="#FFFFFF"/>
      <circle cx="30" cy="64" r="2" fill={color}/>

      {/* Иконка трактора */}
      <g transform="translate(14, 13) scale(1.3)">
        <TractorIcon size={24} color="#FFFFFF" />
      </g>
    </svg>
  );
}
