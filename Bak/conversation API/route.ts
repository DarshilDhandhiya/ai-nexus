import { NextResponse } from "next/server";
import axios from "axios";

// Export function if you want to use it elsewhere
export async function generateAnswerFromApi(question: string, apiKey: string): Promise<string> {
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
  } catch (error) {
    console.error('[API_ERROR]', error.response?.data || error.message || error);
    return "Sorry - Something went wrong. Please try again!";
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { question } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse("Gemini API Key not configured.", { status: 500 });
    }

    if (!question) {
      return new NextResponse("Question is required", { status: 400 });
    }

    const answer = await generateAnswerFromApi(question, process.env.GEMINI_API_KEY);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('[CODE_ERROR]', error.response?.data || error.message || error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
