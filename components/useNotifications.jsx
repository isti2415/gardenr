// useNotifications.js
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

const useNotifications = () => {
    const supabase = useSupabaseClient();
    const user = useUser();
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const { toast } = useToast();

    const getNotifications = async () => {
        try {
            if (!user) {
                return;
            }

            const { data: notificationsData, error } = await supabase
                .from("Notifications")
                .select("*")
                .eq("read", false)
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            const { data: userDevicesData } = await supabase
                .from("Device_Users")
                .select("*")
                .eq("user", user.id);

            const filteredNotifications = notificationsData.filter(notification => {
                return userDevicesData.some(device => device.device === notification.device && device.user === user.id);
            });

            const newNotifications = filteredNotifications.filter(notification => !notifications.some(n => n.id === notification.id));
            newNotifications.forEach(newNotification => {
                toast({
                    title: newNotification.title,
                    description: newNotification.description,
                });
            });

            setNotifications(filteredNotifications);
            setLoadingNotifications(false);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setLoadingNotifications(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            // Update all notifications to mark them as read
            for (const notification of notifications) {
                await supabase
                    .from("Notifications")
                    .update({ read: true })
                    .eq("id", notification.id);
            }

            // Update the read status in the current state
            setNotifications(notifications.map(notification => ({ ...notification, read: true })));

            toast({
                title: "Marked all notifications as read",
                description: "",
            });

            // Remove marked-as-read notifications from the state
            setNotifications(prevNotifications => prevNotifications.filter(notification => notification.read !== true));
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    useEffect(() => {
        // Set up a real-time event listener for Notifications table changes
        const channels = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Notifications' },
                (payload) => {
                    console.log('Change received!', payload);
                    // Refresh notifications on database changes
                    getNotifications();
                }
            )
            .subscribe();

        return () => {
            channels.unsubscribe();
        };
    }, [user, supabase, toast]);

    useEffect(() => {
        if (user) {
            try {
                getNotifications();
            } catch (error) {
                console.error("Error in useEffect:", error);
                setLoadingNotifications(false);
            }
        }
    }, [user, supabase]);

    return { notifications, notificationCount: notifications.length, loadingNotifications, markAllAsRead };
};

export default useNotifications;
