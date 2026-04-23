"use client";

import { useEffect } from "react";

interface MarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  marker: {
    phone: string;
    name: string;
    description: string;
  } | null;
}

export default function MarkerModal({ isOpen, onClose, marker }: MarkerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !marker) return null;

  return (
    <div className="fixed inset-0 z-[2000]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Информация о маркере
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {marker.phone && (
            <div>
              <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Телефон
              </span>
              <span className="text-gray-900 dark:text-white">{marker.phone}</span>
            </div>
          )}
          {marker.name && (
            <div>
              <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Имя
              </span>
              <span className="text-gray-900 dark:text-white">{marker.name}</span>
            </div>
          )}
          {marker.description && (
            <div>
              <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Описание
              </span>
              <span className="text-gray-900 dark:text-white">{marker.description}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
