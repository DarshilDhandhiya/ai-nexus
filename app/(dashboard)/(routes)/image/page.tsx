"use client"; // Ensure this file is treated as a client component

import React, { createContext, useContext, useState, useEffect } from 'react';
import Image from 'next/image';

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
      // Replace `url` with the actual endpoint path for Unsplash API
      const res = await fetch(`https://api.unsplash.com/${url}`);
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
  <div className="bg-gray-900 flex items-center py-10">
    <div className='max-w-md mx-auto w-full'>
      <h1 className='text-white text-center text-2xl font-bold mb-5'>Search You Want</h1>
      {children}
    </div>
  </div>
);

// LDMode Component
const LDMode = () => <div className='light'><p></p></div>;

// SearchField Component
const SearchField = () => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const context = useContext(ImageContext);

  if (!context) {
    return null; // or handle error
  }

  const { fetchData, setSearchImage } = context;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
  const handleButtonSearch = () => {
    const searchTerm = prompt("Enter your search term:");
    if (searchTerm && searchTerm.trim()) {
      fetchData(`search/photos?page=1&query=${searchTerm}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`);
      setSearchImage(searchTerm);
    }
  };

  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      fetchData(`search/photos?page=1&query=${searchValue}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}`);
      setSearchImage(searchValue);
      setSearchValue('');
    }
  };

  return (
    <div className="flex">
      <input
        className="bg-gray-50 border border-gray-300 text-sm w-full indent-2 p-2.5 outline-none focus:border-blue-500 focus:ring-2 rounded-tl rounded-bl"
        type="search"
        placeholder="Search Anything..."
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleEnterSearch}
      />
      <button
        onClick={handleButtonSearch}
        disabled={!searchValue.trim()}
        className="bg-blue-600 px-6 py-2.5 text-white rounded-tr rounded-br focus:ring-2 focus:ring-blue-300 disabled:bg-gray-400"
      >Search</button>
    </div>
  );
};

// Image Component
const ImageComponent = ({ data }: { data: { urls: { regular: string; small: string }; alt_description: string } }) => {
  return (
    <a href={data.urls.regular} target="_blank" rel="noreferrer">
      <Image
        className="h-72 w-full object-cover rounded-lg shadow-md"
        src={data.urls.small}
        alt={data.alt_description || 'Image'} // Ensure alt text is provided
        width={500} // Provide an appropriate width
        height={500} // Provide an appropriate height
      />
    </a>
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
    <>
      {!noImagesFound && (
        <h1 className="text-center mt-6 underline text-2xl">
          Results for {searchImage || 'Ai Nexus'}
        </h1>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-10 max-w-7xl mx-auto px-4">
        {isLoading ? (
          <Skeleton item={imageCount || 10} /> // Default to 10 if imageCount is undefined
        ) : noImagesFound ? (
          <div className="text-center text-xl col-span-full">No images found</div>
        ) : (
          response.slice(0, imageCount).map((data: any, key: number) => <ImageComponent key={key} data={data} />)
        )}
      </div>
    </>
  );
};

// Page Component
const Page = () => {
  return (
    <API>
      <Jumbutron>
        <SearchField />
      </Jumbutron>
      <LDMode />
      <Images />
    </API>
  );
};

export default Page;
