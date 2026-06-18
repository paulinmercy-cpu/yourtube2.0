"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import Channeldialogue from "./Channeldialogue";

const Sidebar = () => {
  const user: any = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "https://github.com/shadcn.png?height=32&width=32",
  };

  const [hasChannel, setHasChannel] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-2">
      <nav className="space-y-1">

        {/* Top Section */}
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            Home
          </Button>
        </Link>

        <Link href="/explore">
          <Button variant="ghost" className="w-full justify-start">
            <Compass className="w-5 h-5 mr-3" />
            Explore
          </Button>
        </Link>

        <Link href="/subscriptions">
          <Button variant="ghost" className="w-full justify-start">
            <PlaySquare className="w-5 h-5 mr-3" />
            Subscriptions
          </Button>
        </Link>

        {/* Divider */}
        <div className="border-t my-2" />

        {/* Bottom Section */}
        <Link href="/history">
          <Button variant="ghost" className="w-full justify-start">
            <History className="w-5 h-5 mr-3" />
            History
          </Button>
        </Link>

        <Link href="/liked-videos">
          <Button variant="ghost" className="w-full justify-start">
            <ThumbsUp className="w-5 h-5 mr-3" />
            Liked videos
          </Button>
        </Link>

        <Link href="/watch-later">
          <Button variant="ghost" className="w-full justify-start">
            <Clock className="w-5 h-5 mr-3" />
            Watch later
          </Button>
        </Link>

        {/* Create Channel or Your Channel */}
        {hasChannel ? (
          <Link href={`/channel/${user.id}`}>
            <Button variant="ghost" className="w-full justify-start">
              <User className="w-5 h-5 mr-3" />
              Your channel
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setIsDialogOpen(true)}
          >
            <User className="w-5 h-5 mr-3" />
            Create Channel
          </Button>
        )}

      </nav>
      <Channeldialogue
      isOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      mode="create"
/>
    </aside>
  );
};

export default Sidebar;