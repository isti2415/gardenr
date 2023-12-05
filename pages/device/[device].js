import { useRouter } from 'next/router';
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Switch } from "@/components/ui/switch";
import { Card, CardTitle, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AreaChart } from "@tremor/react";
import {ChatBot} from "@/components/chat"

export default function Device() {
    const router = useRouter();
    const deviceID = router.query.device;
    const supabase = useSupabaseClient();
    const user = useUser();

    const [device, setDevice] = useState([]);
    const [sensorData, setSensorData] = useState([]);
    const [currentSensorValues, setCurrentSensorValues] = useState({});
    const [pumpStatus, setPumpStatus] = useState(false);

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
            console.error(error);
        }
    };

    const getSensorValues = async () => {
        try {
            const { data, error } = await supabase
                .from("Sensors")
                .select("*")
                .order("created_at", {ascending:false})
                .eq("device", deviceID)
                .limit(10);
            if (error) {
                throw error;
            }
            setSensorData(data);
        } catch (error) {
            console.error(error);
        }
    }

    const getCurrentSensorValues = async () => {
        try {
            const { data, error } = await supabase
                .from("Current_Sensor_Values")
                .select("*")
                .eq("device", deviceID);

            if (error) {
                throw error;
            }

            setCurrentSensorValues(data[0] || {});
            setPumpStatus(data[0]?.pump || false);
        } catch (error) {
            console.error(error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${month} ${day} ${hours}.${minutes < 10 ? '0' : ''}${minutes}${hours >= 12 ? 'pm' : 'am'}`;
    };

    const handleSwitchChange = async () => {
        try {
            const { error } = await supabase
                .from("Current_Sensor_Values")
                .update({ pump: !pumpStatus })
                .eq("device", deviceID);

            if (error) {
                throw error;
            }

            setPumpStatus((prevStatus) => !prevStatus);
        } catch (error) {
            console.error(error);
        }
    };

    const mappedSensorData = sensorData.map(({ created_at, temperature, humidity, moisture }) => ({
        Date: formatTimestamp(created_at),
        Temperature: temperature,
        Humidity: humidity,
        Moisture: moisture,
    }));

    const mappedPumpData = sensorData.map(({ created_at, pump }) => (
        {
            Date: formatTimestamp(created_at),
            Pump: pump
        }
    ));

    useEffect(() => {
        getDevice();
        getSensorValues();
        getCurrentSensorValues();
    }, [deviceID, user, supabase]);

    return (
        <div className="flex">
            <Head>
                <title>GardenR {device[0] ? " - " + device[0].device_name : ""}</title>
            </Head>
            <Sidebar className="w-[16rem] lg:relative fixed bg-background left-0 top-0 pb-8" />
            <div className="fixed bottom-4 right-4 z-20">
        <ChatBot />
      </div>
            <div className="flex flex-col w-screen mt-4 gap-4 px-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold ml-10">
                        {device[0]?.device_name}
                    </h1>
                    <div>
                        <Button onClick={getCurrentSensorValues}>
                            <RefreshCcw className='mr-2' />
                            Reload
                        </Button>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-col lg:flex-row justify-between items-center">
                            <div>
                                Temperature: {currentSensorValues.temperature}°C
                            </div>
                            <div>
                                Humidity: {currentSensorValues.humidity}%
                            </div>
                            <div>
                                Soil Moisture: {currentSensorValues.moisture}%
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <AreaChart
                        className='h-72'
                        data={mappedSensorData}
                        index='Date'
                        categories={["Temperature", "Humidity", "Moisture"]}
                        colors={["temperature", "humidity", "soilMoisture"]}
                    />
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex flex-row justify-between items-center">
                            <div>
                                Water Pump
                            </div>
                            <div>
                                <Switch id="pump" checked={pumpStatus} onCheckedChange={handleSwitchChange} />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <AreaChart
                        className='h-48'
                        data={mappedPumpData}
                        index='Date'
                        categories={["Pump"]}
                    />
                </Card>
            </div>
        </div>
    );
}
