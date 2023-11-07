import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { BellIcon, LayoutDashboard, LogOut, MenuIcon, Radio, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Sidebar({ className }) {

    const router = useRouter();

    const supabase = useSupabaseClient();

    const user = useUser();

    const [devices, setDevices] = useState([])

    const [active, setActive] = useState(null)

    const [isOpen, setIsOpen] = useState(false);

    const logout = () => {
        supabase.auth.signOut()
        router.push('/login')
    }

    const getDevices = async () => {
        try {
            const { data, error } = await supabase
                .from('Device_Users')
                .select('device')
                .eq('user', user?.id);

            if (error) {
                throw error;
            }
            setDevices(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {

        getDevices()

        setActive(window.location.pathname)

        const setInitialWidth = () => {
            setIsOpen(window.innerWidth > 1024);
        };

        setInitialWidth(); // Set initial width

        // Set resize listener to update width
        window.addEventListener('resize', setInitialWidth);

        // Clean up the listener on component unmount
        return () => {
            window.removeEventListener('resize', setInitialWidth);
        };
    }, [user, supabase]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <div className="fixed top-4 left-4 z-10">
                <MenuIcon
                    className="h-6 w-6 cursor-pointer"
                    onClick={toggleSidebar}
                />
            </div>
            <div className={`pb-12 h-screen ${isOpen ? 'ml-0 transition-all' : '-ml-64 transition-all'} ${cn(className)}`}>
                <div className="space-y-4 py-4 mt-8">
                    <div className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            General
                        </h2>
                        <div className="space-y-1">
                            <Button variant={active === '/dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start" asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                            <Button variant={active === '/notifications' ? 'secondary' : 'ghost'} className="w-full justify-start" asChild>
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
                                <Button key={device} variant="ghost" className="w-full justify-start">
                                    <Radio className="mr-2 h-4 w-4" />
                                    {device.device}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            Profile
                        </h2>
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/account">
                                    <User className="mr-2 h-4 w-4" />
                                    Account
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start hover:bg-destructive" onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}