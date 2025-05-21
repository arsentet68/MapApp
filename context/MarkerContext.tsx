import React, { createContext, useContext, useState } from 'react';
import { ImageData, MarkerData } from '../types';

type MarkerContextType = {
  markers: MarkerData[];
  addMarker: (marker: MarkerData) => void;
  updateMarker: (id: string, updatedFields: Partial<MarkerData>) => void;
  images: ImageData[];
  addImage: (uri: string) => string;
  removeImage: (imageId: string) => void;
};

const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

export const MarkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);

  // Добавление маркера
  const addMarker = (marker: MarkerData) => {
    console.log('🧩 Добавление маркера в контекст:', marker); //отладочный вывод, удалить
    setMarkers((prev) => [...prev, marker]);
  };

  // Обновление маркера по id
  const updateMarker = (id: string, updatedFields: Partial<MarkerData>) => {
    setMarkers((prev) =>
      prev.map((marker) =>
        marker.id === id ? { ...marker, ...updatedFields } : marker
      )
    );
  };

  // Функция для добавления нового изображения и возврата его id
  const addImage = (uri: string): string => {
    const newImage: ImageData = {
      id: Date.now().toString(),
      uri,
    };
    setImages(prev => [...prev, newImage]);
    return newImage.id;
  };

  // Удаление изображения
  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  return (
    <MarkerContext.Provider value={{ markers, addMarker, updateMarker, images, addImage, removeImage }}>
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarkers = () => {
  const context = useContext(MarkerContext);
  if (!context) throw new Error('useMarkers must be used within MarkerProvider');
  return context;
};