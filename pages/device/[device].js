import { useRouter } from "next/router";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardTitle,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AreaChart } from "@tremor/react";
import { ChatBot } from "@/components/chat";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

export default function Device() {
  const router = useRouter();
  const deviceID = router.query.device;
  const supabase = useSupabaseClient();
  const user = useUser();
  const theme = useTheme().resolvedTheme;

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
        .order("created_at", { ascending: false })
        .eq("device", deviceID)
        .limit(10);
      if (error) {
        throw error;
      }
      setSensorData(data);
    } catch (error) {
      console.error(error);
    }
  };

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

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  }

  const mappedSensorData = sensorData.map(
    ({ created_at, temperature, humidity, moisture }) => ({
      Date: formatTimestamp(created_at),
      Temperature: temperature,
      Humidity: humidity,
      Moisture: moisture,
    })
  );

  const mappedPumpData = sensorData.map(({ created_at, pump }) => ({
    Date: formatTimestamp(created_at),
    Pump: pump === "true" ? 1 : 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background rounded-md p-2">
          <p className="text-sm">{label}</p>
          <p className="text-sm text-[#ca8a04]">Soil Moisture : {payload[0].value}%</p>
          <p className="text-sm text-[#0284c7]">Humidity : {payload[1].value}%</p>
          <p className="text-sm text-[#ef4444]">Temperature : {payload[2].value}°C</p>
        </div>
      );
    }
    return null;
  };

  const PumpTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background rounded-md p-2">
          <p className="text-sm">{label}</p>
          <p className="text-sm text-[#0284c7]">
            Pump Status : {payload[0].value ? "ON" : "OFF"}
          </p>
        </div>
      );
    }
    return null;
  };

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
              <RefreshCcw className="mr-2" />
              Reload
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col lg:flex-row justify-between items-center">
              <div>Temperature: {currentSensorValues.temperature}°C</div>
              <div>Humidity: {currentSensorValues.humidity}%</div>
              <div>Soil Moisture: {currentSensorValues.moisture}%</div>
            </CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={350} marg>
            <LineChart data={mappedSensorData.slice().reverse()}>
              <Line type="monotone" dataKey="Moisture" stroke="#ca8a04" />
              <Line type="monotone" dataKey="Humidity" stroke="#0284c7" />
              <Line type="monotone" dataKey="Temperature" stroke="#ef4444" />
              <XAxis
                stroke={theme === "dark" ? "#fff" : "#000"}
                dataKey="Date"
              />
              <YAxis stroke={theme === "dark" ? "#fff" : "#000"} />
              <Tooltip content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row justify-between items-center">
              <div>Water Pump</div>
              <div>
                <Switch
                  id="pump"
                  checked={pumpStatus}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mappedPumpData.slice().reverse()}>
              <Line type="monotone" dataKey="Pump" stroke="#0284c7" />
              <XAxis
                stroke={theme === "dark" ? "#fff" : "#000"}
                dataKey="Date"
              />
              <YAxis stroke={theme === "dark" ? "#fff" : "#000"} tick={[0,1]} tickCount={2}/>
              <Tooltip content={<PumpTooltip/>} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
