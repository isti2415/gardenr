import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Eye, Plus, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Icons } from "@/components/ui/icons";

export default function Dashboard() {

    const [devices, setDevices] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const supabase = useSupabaseClient();

    const user = useUser();

    const getDevices = async () => {
        try {
            const { data, error } = await supabase
                .from('Device_Users')
                .select('*')
                .eq('user', user.id);

            if (error) {
                throw error;
            }
            setDevices(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDevices();
    }, [user, supabase]);

    async function addDevice(event) {
        event.preventDefault();

        setIsLoading(true);

        const device_name = event.target.device_name.value;
        const device_id = event.target.device_id.value;
        const password = event.target.password.value;

        const { data, error } = await supabase
            .from("Devices")
            .select("*")
            .eq("id", device_id)
            .limit(1);

        if (error) {
            console.log(error);
            setIsLoading(false);
        }

        if (data.length == 1) {
            if (data[0].password != password) {
                console.log("Incorrect password");
                setIsLoading(false);
            } else {
                const { data, error } = await supabase
                    .from("Device_Users")
                    .insert([{ device_name: device_name, device: device_id, user: user.id }])
                    .select();
                if (error) {
                    console.log(error);
                    setIsLoading(false);
                }
                console.log(data);
                setIsLoading(false);
            }
        } else {
            console.log("Device not found");
            setIsLoading(false);
        }
    }

    return (
        <div className="flex">
            <Sidebar className="w-[16rem] lg:relative fixed bg-background left-0 top-0"/>
            <div className="flex flex-col w-full mt-2 px-12 gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Dashboard</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2" />
                                Add Device
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add a new device</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={addDevice}>
                                <div className="grid gap-4">
                                    <Label htmlFor="device_name">
                                        Device Name
                                    </Label>
                                    <Input
                                        id="device_name"
                                        name="device_name"
                                        placeholder="Name to identify device"
                                        type="text"
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="device_id">
                                        Device ID
                                    </Label>
                                    <Input
                                        id="device_id"
                                        name="device_id"
                                        placeholder="Device ID on arduino serial monitor"
                                        type="text"
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="password">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password of wifi network"
                                        disabled={isLoading}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button disabled={isLoading} type="submit">
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        <Plus className="mr-2" />
                                        Add device
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {devices.map((device) => (
                        <Card key={device}>
                            <CardHeader>
                                <CardTitle>{device.device_name}</CardTitle>
                                <CardDescription>Online</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold">Device ID</label>
                                        <p className="text-sm">{device.device}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Eye className="mr-2" />
                                    View
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}