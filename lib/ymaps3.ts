// lib/ymaps3.ts
import React from "react";
import ReactDom from "react-dom";

// Ждем загрузки скрипта в браузере
if (typeof window !== "undefined") {
  // Ждем появления ymaps3
  await new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if ((window as any).ymaps3) {
        clearInterval(checkInterval);
        resolve(null);
      }
    }, 50);
  });
}

const ymaps3 = (window as any).ymaps3;

const [ymaps3React] = await Promise.all([
  ymaps3.import("@yandex/ymaps3-reactify"),
  ymaps3.ready,
]);

export const reactify = ymaps3React.reactify.bindTo(React, ReactDom);
export const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } =
  reactify.module(ymaps3);

// Export additional components
export const { YMapMarker, YMapClusterer, YMapListener } = reactify.module(ymaps3);
