import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { UserCheck, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

function UserAuthForm(props) {

    const { toast } = useToast();
    const router = useRouter();
    const supabase = useSupabaseClient();
    const user = useUser();
    const [isLoading, setIsLoading] = React.useState(false);

    async function onSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        const email = event.target.email.value;
        const password = event.target.password.value;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        } else {
            router.push('/dashboard');
            console.log(error);
        }

        setIsLoading(false);
    }

    return (
        <div className="grid gap-6" {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-4">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Label className="sr-only" htmlFor="password">
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        disabled={isLoading}
                    />
                    <Button disabled={isLoading} type="submit">
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <UserCheck className="mr-2" />
                        Log in
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default function Signup() {
    return (
        <>
            <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href="./signup"
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    <UserPlus className="mr-2" />
                    Create an account
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
                <div className="lg:p-8 h-screen flex items-center justify-center">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Log in to the account
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email and password
                            </p>
                        </div>
                        <div className="max-w-lg"> {/* Apply centering styles */}
                            <UserAuthForm />
                        </div>
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            Forgot your password?{" "}
                            <Link
                                href="./forgot-password"
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "text-sm"
                                )}
                            >
                                Reset it
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}
