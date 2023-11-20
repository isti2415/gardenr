import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Bell, Eye, Plus, Terminal, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import { weatherIconMappings } from "@/components/iconMap";
import Image from "next/image";
import Link from "next/link";
import { getRandomTip } from "@/components/tips";
import Head from "next/head";

const Dashboard = ({ initialTip }) => {
  const [devices, setDevices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const supabase = useSupabaseClient();

  const user = useUser();

  const randomTip = initialTip || getRandomTip();

  const getDevices = async () => {
    try {
      const { data, error } = await supabase
        .from("Device_Users")
        .select("*")
        .eq("user", user.id);

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
          .insert([
            { device_name: device_name, device: device_id, user: user.id },
          ])
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

  const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);

    const apiKey = "e0816140a2197fd99215952e5b8402e1";

    const city = "Dhaka";

    useEffect(() => {
      const fetchWeather = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
          );
          setWeatherData(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      if (apiKey && city) {
        fetchWeather();
      }
    }, [city, apiKey]);

    const getWeatherInfo = () => {
      if (!weatherData) {
        return { temperature: null, description: null, icon: null };
      }

      const temperature = Math.round(weatherData.main.temp);
      const description = weatherData.weather[0].main;
      const icon = weatherData.weather[0].id;
      const iconName = weatherIconMappings[icon];
      const humidity = weatherData.main.humidity;

      return { temperature, description, iconName, humidity, city };
    };

    return getWeatherInfo();
  };

  const Clock = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        setTime(`${hours} : ${minutes} : ${seconds}`);
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    return <>{time}</>;
  };

  const getDayName = (dayIndex) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayIndex];
  };

  const day = getDayName(new Date().getDay());

  const { temperature, description, iconName, humidity, city } = Weather();

  return (
    <div className="flex">
      <Head>
        <title>GardenR - Dashboard</title>
      </Head>
      <Sidebar className="w-[16rem] lg:relative fixed bg-background left-0 top-0" />
      <div className="flex flex-col w-screen mt-4 gap-4 px-4 pb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold ml-10">
            Dashboard
          </h1>
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
                  <Label htmlFor="device_name">Device Name</Label>
                  <Input
                    id="device_name"
                    name="device_name"
                    placeholder="Name to identify device"
                    type="text"
                    disabled={isLoading}
                  />
                  <Label htmlFor="device_id">Device ID</Label>
                  <Input
                    id="device_id"
                    name="device_id"
                    placeholder="Device ID on arduino serial monitor"
                    type="text"
                    disabled={isLoading}
                  />
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password of wifi network"
                    disabled={isLoading}
                  />
                </div>
                <DialogFooter>
                  <Button disabled={isLoading} type="submit" className="mt-4">
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
        <Alert className="mt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Bell className="h-8 w-8" />
              <div>
                <AlertTitle>Notifications</AlertTitle>
                <AlertDescription>You have 1 new notification</AlertDescription>
              </div>
            </div>
            <div>
              <Button asChild>
                <Link href="/notifications">
                  <Eye className="mr-2" />
                  View
                </Link>
              </Button>
            </div>
          </div>
        </Alert>
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold my-4">
              Weather
            </h1>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>{city}</div>
                      <div>
                        <Clock />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4">
                      <div className="text-6xl">{temperature}°C</div>
                      <div className="text-2xl">Humidity: {humidity}%</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative invert-0 dark:invert h-12 w-12">
                          <Image fill src={`/icons/wi-${iconName}.svg`} alt="Weather Icon" />
                        </div>
                        <div>{description}</div>
                      </div>
                      <div className="flex items-center">{day}</div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold my-4">
              Tip of the day
            </h1>
            <Card className="h-full">
              <CardHeader className="gap-4">
                <CardTitle>{randomTip.title}</CardTitle>
                <CardDescription className="text-xl">
                  {randomTip.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold py-4">
          My Devices
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
  );
};

export async function getServerSideProps() {
  // Generate a random tip on the server
  const initialTip = getRandomTip();

  // Pass the initialTip as a prop to the page
  return { props: { initialTip } };
}

export default Dashboard;
