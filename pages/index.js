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
import Logo from "@/components/logo";
import Head from "next/head";


export default function Home() {
  return (
    <>
      <Head>
        <title>GardenR</title>
      </Head>
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
            buttonVariants({}),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          <UserCheck className="mr-2" />
          Log in
        </Link>

        <div className="hidden lg:block relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center">
            <Logo />
          </div>
          <div className="relative z-20 flex items-center">
            <img src="/illustration.svg" alt="Illustration" className="mx-auto h-[28rem]" />
          </div>
        </div>
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <span className="text-4xl font-bold">From</span>
            <Logo/>
            <span className="text-4xl">For</span>
            <Logo/>
        </div>
      </div>
    </>
  );
}
