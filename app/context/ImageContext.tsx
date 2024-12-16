"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface ImageContextType {
  response: any[];
  isLoading: boolean;
  error: string;
  fetchData: (url: string) => void;
  searchImage: string;
  setSearchImage: (value: string) => void;
  imageCount: number;
  setImageCount: (count: number) => void;
}

export const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [searchImage, setSearchImage] = useState<string>('');
  const [response, setResponse] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imageCount, setImageCount] = useState<number>(10); // Default image count

  const fetchData = async (url: string) => {
    try {
      setIsLoading(true);
      setError('');
      console.log(`Fetching data from: ${url}`); // Debugging log
      const res = await axios.get(url, {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`,
        },
      });
      console.log('Response data:', res.data); // Debugging log
      setResponse(res.data.results || []); // Ensure results are set correctly
    } catch (err) {
      console.error('Fetch error:', err); // Debugging log
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchImage) {
      fetchData(`https://api.unsplash.com/search/photos?page=1&query=${searchImage}`);
    }
  }, [searchImage]);

  const value: ImageContextType = {
    response,
    isLoading,
    error,
    fetchData,
    searchImage,
    setSearchImage,
    imageCount,
    setImageCount,
  };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};