import { useRouter } from 'next/router';
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Device() {

    const [device, setDevice] = useState([]);
    const router = useRouter();

    const deviceID = router.query.device;

    const supabase = useSupabaseClient();

    const user = useUser();

    const getDevice = async () => {
        try {
            const { data, error } = await supabase
                .from("Device_Users")
                .select("*")
                .eq("user", user.id)
                .eq("device", deviceID);

            if (error) {
                throw error;
            }

            setDevice(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDevice();
    }, [deviceID, user, supabase]);

    return (
        <div className="flex">
            <Head>
                <title>GardenR {device[0] ? " - " + device[0].device_name : ""}</title>
            </Head>
            <Sidebar className="w-[16rem] lg:relative fixed bg-background left-0 top-0 pb-8" />
            <div className="flex flex-col w-screen mt-4 gap-4 px-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold ml-10">
                        {device[0]?.device_name}
                    </h1>
                    <div>
                        <Button>
                            <RefreshCcw className='mr-2' />
                            Reload
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

}