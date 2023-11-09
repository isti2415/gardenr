import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const Notifications = () => {

  const supabase = useSupabaseClient();

  const user = useUser();

  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("Notifications")
        .select("*")
        .eq("user", user.id);

      if (error) {
        throw error;
      }

      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [user, supabase]);

  return (
    <div className="flex">
      <Sidebar className="w-[16rem] lg:relative fixed bg-background left-0 top-0" />
      <div className="flex flex-col w-screen mt-4 gap-4 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold ml-10">
            Notifications
          </h1>
          <div>
            <Button>
              <RefreshCcw />
              Reload
            </Button>
          </div>
        </div>
        <Table>
          <TableCaption>A list of your recent notifications.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification}>
                <TableCell>{new Date(notification.created_at).toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})}</TableCell>
                <TableCell>{new Date(notification.created_at).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true })}</TableCell>
                <TableCell>{notification.device}</TableCell>
                <TableCell>{notification.type}</TableCell>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Notifications;
