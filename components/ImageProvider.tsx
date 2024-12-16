'use client'

import React, { createContext, useState, ReactNode } from 'react';

interface ImageContextType {
  imageCount: number;
  setImageCount: React.Dispatch<React.SetStateAction<number>>;
}

export const ImageContext = createContext<ImageContextType | undefined>(undefined);

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [imageCount, setImageCount] = useState(0);

  const value = {
    imageCount,
    setImageCount,
  };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};

