"use client";

import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Code } from "lucide-react";
import { generateAnswerFromApi } from "../../../api/code/route";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

const apiKey = process.env.NEXT_PUBLIC_API_GENERATIVE_LANGUAGE_CLIENT as string;

function CodePage() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [generatingAnswer, setGeneratingAnswer] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string>("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("");

    const answer = await generateAnswerFromApi(question, apiKey);
    setAnswer(answer);
    setGeneratingAnswer(false);
  }

  const handleCopy = () => {
    setCopySuccess("Code copied to clipboard!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div>
      <Heading 
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
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
                  "p-8 w-full flex items-start gap-x-8 rounded-lg bg-white border border-black/10"
                )}
              >
                <CopyToClipboard text={answer} onCopy={handleCopy}>
                  <div className="relative w-full">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={codeStyle as any} // Cast to `any` to bypass type errors
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code
                              className={cn(
                                "bg-black text-white rounded p-1",
                                className
                              )}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                      className="text-sm overflow-hidden leading-7"
                    >
                      {answer}
                    </ReactMarkdown>
                    {copySuccess && (
                      <div className="absolute right-0 bottom-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        {copySuccess}
                      </div>
                    )}
                  </div>
                </CopyToClipboard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodePage;
