"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  Menu,
  Search,
  Mic,
  Bell,
  VideoIcon,
  LogOut,
  Tv,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Useuser } from "@/lib/AuthContext";


const Header = () => {
  const router = useRouter();
const pathname = usePathname();
  const context: any = Useuser();

  const [searchQuery, setSearchQuery] = useState("");

  if (!context) return null;

  const {
    user,
    logout,
    handlegooglesignin,
  } = context;

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    router.push(
      `/search?q=${encodeURIComponent(searchQuery)}`
    );
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-white sticky top-0 z-50">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>

        <Link href="/">
          <h1 className="text-xl font-bold">
            YouTube
          </h1>
        </Link>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 flex-1 max-w-2xl mx-8"
      >
        <div className="flex flex-1">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="rounded-l-full border-r-0"
          />

          <Button
            type="submit"
            variant="outline"
            className="rounded-r-full rounded-l-none"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Mic className="w-5 h-5" />
        </Button>
      </form>

      {/* Right */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Button
              variant="outline"
              className="rounded-full"
            >
              <VideoIcon className="w-4 h-4 mr-2" />
              Create
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <Avatar>
                    <AvatarImage
                      src={user?.image || ""}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                onClick={() => {
                  const channelUrl = `/channel/${user?._id}`;
                  if (pathname !== channelUrl) {
                    router.push(channelUrl);
                  }
                  }}
                  >
                    <Tv className="w-4 h-4 mr-2" />
                    Your Channel
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button
            variant="outline"
            className="rounded-full"
            onClick={handlegooglesignin}
          >
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;