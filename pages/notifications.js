import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Check, Cross, RefreshCcw, X } from "lucide-react";
import { Table, TableBody, TableCell, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { ChatBot } from "@/components/chat";
import Head from "next/head";
import useNotifications from "../components/useNotifications";

const Notifications = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const { notifications, loadingNotifications, markAllAsRead } = useNotifications();

  const getPriorityColorClass = (priority) => {
    const priorityColorClasses = {
      Alert: "text-destructive",
      Warning: "text-yellow-600",
      Notification: "text-primary",
    };

    return priorityColorClasses[priority] || "text-black";
  };

  return (
    <div className="flex">
      <Head>
        <title>GardenR - Notifications</title>
      </Head>
      <Sidebar className="w-[16rem] lg:relative fixed bg-background left-0 top-0 pb-8" />
      <div className="fixed bottom-4 right-4 z-20">
        <ChatBot />
      </div>
      <div className="flex flex-col w-screen mt-4 gap-4 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold ml-10">Notifications</h1>
          <div>
            <Button onClick={markAllAsRead}>
              <RefreshCcw className="mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>
        {loadingNotifications ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <Table>
            <TableCaption>A list of your recent notifications.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Read</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map(notification => (
                <TableRow key={notification.id} className={getPriorityColorClass(notification.priority)}>
                  <TableCell>{notification.priority}</TableCell>
                  <TableCell>
                    {new Date(notification.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    {new Date(notification.created_at).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </TableCell>
                  <TableCell>{notification.device}</TableCell>
                  <TableCell>{notification.type}</TableCell>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell>{notification.description}</TableCell>
                  <TableCell>{notification.read ? <Check/> : <X/>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Notifications;
