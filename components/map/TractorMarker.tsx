import React from 'react';
import { TractorIcon } from '@/components/icons/TractorIcon';

interface TractorMarkerProps {
  size?: number;
  color?: string;
  className?: string;
}

export function TractorMarker({ 
  size = 40, 
  color = '#FF6B35',
  className = '' 
}: TractorMarkerProps) {
  return (
    <div 
      className={`relative flex items-center justify-center bg-white rounded-full shadow-lg border-2 border-orange-500 ${className}`}
      style={{ 
        width: size, 
        height: size,
        backgroundColor: '#ffffff'
      }}
    >
      <TractorIcon 
        size={size * 0.6} 
        color={color}
      />
      {/* Добавляем пульсирующую анимацию для маркера */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-orange-400 opacity-75 animate-ping"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
