"use client";

import React, { createContext, useContext, useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";

// Define the API context
const ImageContext = createContext<any>(null);

const API = ({ children }: { children: React.ReactNode }) => {
  const [response, setResponse] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchImage, setSearchImage] = useState<string>('');
  const [imageCount, setImageCount] = useState<number>(10);

  // Function to fetch data from the Unsplash API
  const fetchData = async (url: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.unsplash.com/${url}`, {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`,
        },
      });
      const data = await res.json();
      setResponse(data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageContext.Provider value={{ response, isLoading, searchImage, imageCount, fetchData, setSearchImage }}>
      {children}
    </ImageContext.Provider>
  );
};

// Jumbutron Component
const Jumbutron = ({ children }: { children: React.ReactNode }) => (
  <div>
    <Heading 
      title="Image Generation"
      description="Turn your prompt into an image."
      icon={ImageIcon}
      iconColor="text-pink-600"
      bgColor="bg-pink-600/10"
    />
    {children}
  </div>
);

// Updated SearchField Component
const SearchField = () => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const context = useContext(ImageContext);

  if (!context) {
    return null; // or handle error
  }

  const { fetchData, setSearchImage } = context;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
  const handleButtonSearch = () => {
    if (searchValue.trim()) {
      fetchData(`search/photos?page=1&query=${searchValue}`);
      setSearchImage(searchValue);
      setSearchValue('');
    }
  };

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      fetchData(`search/photos?page=1&query=${searchValue}`);
      setSearchImage(searchValue);
      setSearchValue('');
    }
  };

  return (
    <div className="bg-white rounded-lg border w-full p-4 flex items-center space-x-4">
      <Input
        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent flex-1"
        type="search"
        placeholder="Search Anything..."
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleEnterSearch}
      />
      <Button
        onClick={handleButtonSearch}
        disabled={!searchValue.trim()}
        className="w-32"
      >
        Search
      </Button>
    </div>
  );
};

// Image Component
const ImageComponent = ({ data }: { data: { urls: { regular: string; small: string }; alt_description: string } }) => {
  // Handle download functionality
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation(); // Prevents the image click action from being triggered
    const a = document.createElement('a');
    a.href = data.urls.regular;
    a.download = 'image'; // or any specific filename if needed
    a.click();
  };

  return (
    <Card key={data.urls.regular} className="rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
      {/* Make image clickable to open in a new tab */}
      <a href={data.urls.regular} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-square cursor-pointer">
          <Image
            alt={data.alt_description || 'Image'}
            src={data.urls.small}
            fill
            className="object-cover"
          />
        </div>
      </a>
      <CardFooter className="p-2 bg-gray-50 border-t">
        <Button 
          onClick={handleDownload} 
          variant="secondary" 
          className="w-full"
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

// Skeleton Component
const Skeleton = ({ item }: { item: number }) => {
  const skeletonArray = Array.from({ length: item });

  return (
    <>
      {skeletonArray.map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col gap-4">
          <div className="bg-gray-300 rounded-lg h-72"></div>
          <div className="bg-gray-300 h-4 rounded w-3/4"></div>
        </div>
      ))}
    </>
  );
};

// Images Component
const Images = () => {
  const context = useContext(ImageContext);

  if (!context) {
    return <div>No context found</div>;
  }

  const { response, isLoading, searchImage, imageCount } = context;
  const noImagesFound = !isLoading && response.length === 0;

  return (
    <div className="px-4 lg:px-8 mt-4">
      {isLoading && (
        <div className="p-20">
          <Loader />
        </div>
      )}
      {noImagesFound && !isLoading && (
        <Empty label="No images found." />
      )}
      {!noImagesFound && (
        <h1 className="text-center mt-6 underline text-2xl">
          Results for {searchImage || 'Ai Nexus'}
        </h1>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {isLoading ? (
          <Skeleton item={imageCount || 10} />
        ) : (
          response.slice(0, imageCount).map((data: any, key: number) => <ImageComponent key={key} data={data} />)
        )}
      </div>
    </div>
  );
};

// Page Component
const Page = () => {
  return (
    <API>
      <Jumbutron>
        <SearchField />
      </Jumbutron>
      <Images />
    </API>
  );
};

export default Page;
