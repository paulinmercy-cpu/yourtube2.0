import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = ({ channel, user }: any) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="relative h-32 md:h-48 lg:h-64 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden"></div>

      {/* Channel Info */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback>
              {channel.channelname[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">
              {channel.name}
            </h1>

            <div className="text-gray-500">
              <span>
                @{channel.name?.toLowerCase().replace(/\s+/g, "")}
              </span>
            </div>

            {channel.description && (
              <p className="text-sm text-gray-600 mt-2">
                {channel.description}
              </p>
            )}
          </div>
        </div>

        {user && user._id !== channel._id && (
          <div>
            <Button
              onClick={() => setIsSubscribed(!isSubscribed)}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelHeader;