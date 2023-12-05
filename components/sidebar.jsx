import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  BellIcon,
  LayoutDashboard,
  LogOut,
  MenuIcon,
  Radio,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "./logo";

export function Sidebar({ className }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [devices, setDevices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(null);

  const logout = () => {
    supabase.auth.signOut();
    router.push("/login");
  };

  const getDevices = async () => {
    try {
      const { data, error } = await supabase
        .from("Device_Users")
        .select("device")
        .eq("user", user.id);

      if (error) {
        throw error;
      }
      setDevices(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const updateActiveState = () => {
      // Perform logic to update active state
    };

    const setInitialWidth = () => setIsOpen(window.innerWidth > 1024);

    setInitialWidth();
    window.addEventListener("resize", setInitialWidth);

    return () => {
      window.removeEventListener("resize", setInitialWidth);
    };
  }, []); // No dependencies, so this runs once on mount

  useEffect(() => {
    function onMount() {
      getDevices();
      const currentPath = window.location.pathname;
      setActive(currentPath);

      return () => {
        // Cleanup function to remove listeners etc.
      };
    }

    onMount();
  }, [user, devices]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-20">
        <MenuIcon className="h-6 w-6 cursor-pointer" onClick={toggleSidebar} />
      </div>
      <div
        className={`pb-12 h-screen z-10 ${isOpen ? "ml-0 transition-all" : "-ml-64 transition-all"
          } ${cn(className)}`}
      >
        <div className="space-y-4 py-4 mt-14">
          <Logo />
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              General
            </h2>
            <div className="space-y-1">
              <Button
                variant={active === "/dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={active === "/notifications" ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/notifications">
                  <BellIcon className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </Button>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Devices
            </h2>
            <div className="space-y-1">
              {devices.map((device) => (
                <Link href={`/device/${device.device}`} key={device.device}>
                  <Button
                    variant={
                      active === `/device/${device.device}`
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-start"
                  >
                    <Radio className="mr-2 h-4 w-4" />
                    {device.device}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Profile
            </h2>
            <div className="space-y-1">
              <Link href="/profile">
                <Button
                  variant={active === "/profile" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-destructive"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
