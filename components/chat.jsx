import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useChat } from "ai/react";
import { useUser } from "@supabase/auth-helpers-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Urbanist } from "next/font/google";
import { Capacitor } from "@capacitor/core";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap"
});

export function ChatBot() {
  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      api: Capacitor.getPlatform() === "web"
        ? "/api/chat"
        : "https://gardenr.vercel.app/api/chat",
    });

  const user = useUser();

  if (messages.length === 0) {
    messages.push({
      content: "Hi, I am GardenR AI. Ask me all your gardening questions",
      role: "assistant",
    });
  }

  return (
    <Sheet>
      <SheetTrigger>
        <div
          className={cn(
            buttonVariants({ variant: "outline" }),
            "flex items-center justify-center"
          )}
        >
          <span>GardenR AI</span>
          <Bot className="ml-2" />
        </div>
      </SheetTrigger>
      <SheetContent className={urbanist.className}>
        <SheetHeader>
          <SheetTitle>Chat with GardenR AI</SheetTitle>
          <SheetDescription>Ask all your gardening questions</SheetDescription>
          <Separator className="h-1" />
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-15rem)] mt-4">
          {messages.map((message, i) => (
            <div key={i} className="flex gap-3 text-sm mb-4">
              {message.role === "user" && (
                <Avatar>
                  <AvatarFallback>{user?.user_metadata.name[0]}</AvatarFallback>
                </Avatar>
              )}
              {message.role === "assistant" && (
                <Avatar className="dark:bg-foreground bg-background">
                  <AvatarImage src="/ai.svg" />
                  <AvatarFallback>GardenR AI</AvatarFallback>
                </Avatar>
              )}
              <div className="leading-relaxed">
                <span className="block font-bold">
                  {message.role === "user" && user?.user_metadata.name}
                  {message.role === "assistant" && "GardenR AI"}
                </span>
                {message.content.split("\n").map((currentTextBlock, index) => {
                  if (currentTextBlock === "") {
                    return <p key={message.id + index}>&nbsp;</p>;
                  } else {
                    return <p key={message.id + index}>{currentTextBlock}</p>;
                  }
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
        <SheetFooter>
          <form className="flex-1 space-y-4" onSubmit={handleSubmit}>
            <Separator className="h-1" />
            <Textarea
              placeholder="Type in your query"
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              Ask Ai
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
