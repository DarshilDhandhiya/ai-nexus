"use client";

import React, { useState, useEffect } from "react";
import { fetchImages } from "../../../api/image_g/route";
import Image from "next/image";
import type { StaticImageData } from 'next/image';

import City from '/public/images/City.jpeg';
import Underwater from '/public/images/Underwater.jpeg';
import Magical from '/public/images/Magical.jpeg';
import Time from '/public/images/Time.jpeg';
import Celebration from '/public/images/Celebration.jpeg';
import historyIcon from '/public/images/history.png';

type Option = {
  name: string;
  src: StaticImageData;
};

// Utility Functions
const getRandom = (items: string[]): string => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

const promptIdeas = [
  "calico cat wearing a cosmonaut suit, 3d render, pixar style, 8k, high resolution",
  "An armchair in the shape of an avocado  3d render, pixar style, 8k, high resolution",
  "A 3D render of an astronaut walking in a green desert",
  "An abstract oil painting of a river",
  "A Shiba Inu dog wearing a beret and black",
  "Enchanted Forest",
  "Underwater Paradise",
  "Cosmic Dreams",
];

// ChooseResults Component
const ChooseResults = ({ onSelect }: { onSelect: (value: string) => void }) => {
  const handleClick = (value: string) => {
    onSelect(value);
  };

  const availableOptions: Option[] = [
    { name: "City of Tomorrow", src: City },
    { name: "Underwater Paradise", src: Underwater },
    { name: "Magical Creatures", src: Magical },
    { name: "Time Travel Adventure", src: Time },
    { name: "Celebration of Life", src: Celebration },
  ];

  return (
    <>
      <div className="text-center mt-5">Choose from the below ideas</div>
      <div className="flex overflow-x-auto space-x-4 justify-center items-center mt-2 pb-4">
        {availableOptions.map((value) => (
          <div key={value.name} className="flex-shrink-0 text-center" onClick={() => handleClick(value.name)}>
            <Image
              className="rounded-lg cursor-pointer"
              src={value.src}
              alt={value.name}
              width={150} // Adjust width for horizontal layout
              height={100} // Adjust height for horizontal layout
            />
            <div className="mt-1">{value.name}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// ImageBox Component
const ImageBox = (props: { imageResult: string | null; promptQuery: string }) => {
  return (
    <>
      {props.imageResult ? (
        <div className="text-center mt-4">
          <div className="flex justify-center">
            <div className="imageBox">
              <Image 
                src={props.imageResult} 
                alt={props.promptQuery} 
                width={500} // Adjust width as needed
                height={500} // Adjust height as needed
                className="object-cover" // Ensures the image covers the given dimensions
              />
            </div>
          </div>
          <div className="mt-2">
            <a 
              download={props.promptQuery} 
              href={props.imageResult} 
              className="text-blue-500 underline"
            >
              Download
            </a>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};


// RecentResults Component
const RecentResults = (props: { promptQuery: string; imageResult: string | null; onSelect: (value: string) => void }) => {
  const recentImages = JSON.parse(localStorage.getItem("genAIRecentKey") || "[]");
  const [recentImagesStored, setRecentImagesStored] = useState(recentImages);

  const handleClick = (value: string) => {
    props.onSelect(value);
  };

  useEffect(() => {
    if (props.promptQuery && props.imageResult) {
      const updatedImages = [...recentImagesStored];
      const imageExists = recentImages.some((local: { src: string }) => local.src === props.imageResult);

      if (!imageExists) {
        if (recentImagesStored.length === 5) {
          updatedImages.shift();
        }
        updatedImages.push({
          src: props.imageResult,
          name: props.promptQuery,
        });
        localStorage.setItem("genAIRecentKey", JSON.stringify(updatedImages));
        setRecentImagesStored(updatedImages);
      }
    }
  }, [props.promptQuery, props.imageResult, recentImages, recentImagesStored]); // Added dependencies

  return (
    <>
      {recentImagesStored.length > 0 && (
        <>
          <div className="flex items-center justify-center mt-5">
            <span className="text-center mr-2">Recent</span>
            <Image src={historyIcon} width={15} height={15} alt="history" />
          </div>

          <div className="flex overflow-x-auto space-x-6 justify-center items-center mt-2 pb-4">
            {recentImagesStored.map((value: { src: string; name: string }) => (
              <div
                key={value.src}
                className="flex-shrink-0 text-center"
                onClick={() => handleClick(value.name)}
                style={{ maxWidth: '150px' }}
              >
                <Image
                  className="rounded-lg cursor-pointer"
                  src={value.src}
                  alt={value.name}
                  width={150} // Adjust width for horizontal layout
                  height={100} // Adjust height for horizontal layout
                />
                <div className="mt-1 text-xs md:text-base truncate">{value.name}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

// Home Component
const Home = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [promptQuery, setPromptQuery] = useState("");
  const [radioValue, setRadioValue] = useState("20");
  const [dropDownValue, setDropDownValue] = useState("DDIM");
  const [seedValue, setSeedValue] = useState(17123564234);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromptQuery(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (event.target.name === "radio") {
      setRadioValue(event.target.value);
    } else if (event.target.name === "dropdown") {
      setDropDownValue(event.target.value);
    } else {
      setSeedValue(Number(event.target.value));
    }
  };

  const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    try {
      setShowLoader(true);
      const imageBlob = await fetchImages(promptQuery, seedValue, dropDownValue, radioValue);
      
      if (imageBlob) {
        const fileReaderInstance = new FileReader();
        fileReaderInstance.onload = () => {
          let base64data = fileReaderInstance.result as string;
          setImageResult(base64data);
        };
        fileReaderInstance.readAsDataURL(imageBlob);
      } else {
        console.error("Image blob is undefined.");
      }
      setShowLoader(false);
    } catch (error) {
      console.error("Error fetching images from API:", error);
      setShowLoader(false);
    }
  };

  const handleSurpriseMe = () => {
    setPromptQuery(getRandom(promptIdeas));
  };

  const handleAvailOptions = (value: string) => {
    setPromptQuery(value);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Image Generator</h1>
      <button onClick={handleSurpriseMe} className="bg-black text-white py-2 px-4 rounded mx-auto block">
        Surprise Me!
      </button>
      <div className="text-center mt-4">
        <input
          type="text"
          name="prompt"
          value={promptQuery}
          onChange={handleSearch}
          className="promptInput mt-2 p-2 border border-gray-300 rounded w-full md:w-1/2 mx-auto"
        />
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
          <select
            name="dropdown"
            value={dropDownValue}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="DDIM">Denoising Diffusion Implicit Models (DDIM)</option>
            <option value="Euler">Euler Method</option>
            <option value="LMS">Laplacian Method (LMS)</option>
          </select>
          {/* <input
            type="number"
            name="seed"
            value={seedValue}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            placeholder="Enter seed value"
          /> */}
        </div>

      </div>
      <form onSubmit={handleGenerate} className="text-center mt-4">
        <button type="submit" className="bg-black text-white py-2 px-4 rounded">
          Generate
        </button>
      </form>
      {showLoader && <div className="text-center mt-4">Loading...</div>}
      <ImageBox imageResult={imageResult} promptQuery={promptQuery} />
      <ChooseResults onSelect={handleAvailOptions} />
      <RecentResults
        promptQuery={promptQuery}
        imageResult={imageResult}
        onSelect={handleAvailOptions}
      />
    </div>
  );
};

export default Home;
