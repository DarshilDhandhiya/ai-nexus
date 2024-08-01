"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { MessageSquare, ImageIcon, VideoIcon, Music, Code, ArrowRight } from "lucide-react";

const tools = [
    {
        label: "Conversation",
        icon: MessageSquare,
        href: "/conversation",
        color: "text-violet-500",
        bgColor: "bg-violet-500/10"
    },
    {
        label: "Image Generation",
        icon: ImageIcon,
        href: "/Image",
        color: "text-pink-700",
        bgColor: "bg-pink-700/10"
    },
    {
        label: "Video Generation",
        icon: VideoIcon,
        href: "/Video",
        color: "text-orange-700",
        bgColor: "bg-orange-700/10"
    },
    {
        label: "Music Generation",
        icon: Music,
        href: "/Music",
        color: "text-emerald-700",
        bgColor: "bg-emerald-700/10"
    },
    {
        label: "Code Generation",
        icon: Code,
        href: "/Code",
        color: "text-green-700",
        bgColor: "bg-green-700/10"
    }
];


const DashboardPage = () => {
  const router = useRouter();
    return (
      <div>
        <div className="mb-8 space-y-4">
          {/* <h2 className="text-2xl md:text-4xl font-bold text-center">Explore the power of AI</h2> */}
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">Explore the power of AI</h2>

          <p className="text-muted-foreground font-light text-sm md:text-lg text-center">Chat with the smartest AI - Experience the power of AI</p>
        </div>
        <div className="px-4 md:px-20 lg:px-32 space-y-4">
          {tools.map((tool) => ((
            <Card onClick={() => router.push(tool.href)} key={tool.href} className="p-4 boarder-black/5 flex item-center justify-between hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div className="font-semibold">
                  {tool.label}
                </div>
              </div>
              <ArrowRight className="w-5 h-5"/>
            </Card>
          )))}
        </div>
        <p className="text-muted-foreground font-light text-sm md:text-sm text-center italic">copyright</p>

      </div>
      );
}

export default DashboardPage;