"use client";

import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { generateAnswerFromApi } from "../../../api/conversation/route";

import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

const apiKey = process.env.NEXT_PUBLIC_API_GENERATIVE_LANGUAGE_CLIENT as string;

function ConversationPage() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [generatingAnswer, setGeneratingAnswer] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("");

    const answer = await generateAnswerFromApi(question, apiKey);
    setAnswer(answer);
    setGeneratingAnswer(false);
  }

  return (
    <div>
      <Heading 
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <div className="col-span-12 lg:col-span-10">
              <textarea
                required
                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent w-full min-h-[100px] p-3 transition-all duration-300 focus:border-blue-400 focus:shadow-lg"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything"
              ></textarea>
            </div>
            <Button
              type="submit"
              className="col-span-12 lg:col-span-2 w-full"
              disabled={generatingAnswer}
            >
              {generatingAnswer ? "Generating..." : "Generate"}
            </Button>
          </form>
        </div>
        <div className="space-y-4 mt-4">
          {generatingAnswer && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {answer === "" && !generatingAnswer && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {answer && (
              <div
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg bg-white border border-black/10",
                )}
              >
                <ReactMarkdown className="text-sm">
                  {answer}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationPage;
