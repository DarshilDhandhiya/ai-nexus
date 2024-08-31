// app/api.tsx
import axios from "axios";

export const fetchImages = async (
  promptCall: string,
  seedValue: number,
  dropDownValue: string,
  radioValue: string
): Promise<Blob | undefined> => {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const options = {
    method: "POST",
    url: "https://api.segmind.com/v1/sdxl1.0-txt2img",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    responseType: "arraybuffer" as const,
    data: {
      prompt: promptCall,
      seed: seedValue,
      scheduler: dropDownValue,
      num_inference_steps: radioValue,
      negative_prompt: "NONE",
      samples: "1",
      guidance_scale: "7.5",
      strength: "1",
      shape: 512,
    },
  };

  try {
    const response = await axios.request(options);
    const imageBlob = new Blob([response.data], { type: "image/jpeg" });
    return imageBlob;
  } catch (error) {
    console.error("Error while fetching Gen AI model API", error);
    return undefined;
  }
};
