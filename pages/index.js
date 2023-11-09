import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { RotateCcw, TimerReset, UserCheck, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <>
      <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="./signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-32 top-4 md:right-36 md:top-8"
          )}
        >
          <UserPlus className="mr-2" />
          Create account
        </Link>
        <Link
          href={"./login"}
          className={cn(
            buttonVariants({  }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          <UserCheck className="mr-2" />
          Log in
        </Link>

        <div className="hidden lg:block relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            GardenR
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 h-screen flex items-center justify-center"></div>
      </div>
    </>
  );
}
