import { useRouter } from "next/router";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RefreshCcw, UserPlus } from "lucide-react";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);

  const supabase = useSupabaseClient();

  const user = useUser();

  const updateName = async (event) => {
    const name = event.target.name.value;

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        user_metadata: { name: name },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    document.getElementById("name").value = null;
  };

  const updatePassword = async (event) => {
    const password = event.target.password.value;

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    document.getElementById("password").value = null;
  };

  return (
    <div className="flex">
      <Head>
        <title>GardenR - Profile</title>
      </Head>
      <Sidebar className="w-[16rem] lg:relative fixed bg-background left-0 top-0 pb-8" />
      <div className="flex flex-col w-screen mt-4 gap-4 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold ml-10">
            Profile
          </h1>
        </div>
        <div className="m-2 flex flex-col gap-8">
          <form onSubmit={updateName} className="flex flex-col gap-4">
            <Label>Name</Label>
            <div className="flex flex-row gap-4">
              <Input
                id="name"
                name="name"
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                placeholder={user?.user_metadata.name}
              />
              <Button type="submit">
                <RefreshCcw className="mr-2" />
                Update Name
              </Button>
            </div>
          </form>
          <div className="flex flex-col gap-4">
            <Label>Email</Label>
            <div className="flex flex-row gap-4">
              <Input
                id="email"
                name="email"
                type="email"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                placeholder={user?.email}
                disabled
                className="w-full"
              />
              <Button disabled type="submit" className="cursor-not-allowed">
                <RefreshCcw className="mr-2" />
                Email Verified
              </Button>
            </div>
          </div>
          <form onSubmit={updatePassword} className="flex flex-col gap-4">
            <Label>Password</Label>
            <div className="flex flex-row gap-4">
              <Input
                id="password"
                name="password"
                type="password"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                disabled={isLoading}
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              />
              <Button type="submit">
                <RefreshCcw className="mr-2" />
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
