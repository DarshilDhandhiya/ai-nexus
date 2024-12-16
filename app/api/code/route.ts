import { NextResponse } from "next/server";
import axios from "axios";

// Make this a private function by removing the 'export' keyword
const generateAnswerFromApi = async (question: string, apiKey: string): Promise<string> => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: question }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('[API_ERROR]', error.response?.data || error.message || error);
    return "Sorry - Something went wrong. Please try again!";
  }
};

// Only export the route handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse("Gemini API Key not configured.", { status: 500 });
    }

    if (!question) {
      return new NextResponse("Question is required", { status: 400 });
    }

    const answer = await generateAnswerFromApi(question, process.env.GEMINI_API_KEY);

    return NextResponse.json({ answer });
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}