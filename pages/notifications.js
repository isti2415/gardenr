import { Sidebar } from "@/components/sidebar";

const Notifications = () => {
  return (
    <div className="flex">
      <Sidebar className="w-[16rem] lg:relative fixed bg-background left-0 top-0" />
      <div className="flex flex-col mt-4 gap-4 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold ml-10">
            Notifications
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
