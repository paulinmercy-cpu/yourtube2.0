"use client";

import React, { useState } from "react";

const tabs = [
  "Home",
  "Videos",
  "Shorts",
  "Playlists",
  "Community",
  "About",
];

const Channeltabs = () => {
  const [activeTab, setActiveTab] = useState("Videos");

  return (
    <div className="border-b bg-white">
      <div className="flex gap-6 px-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative py-4 text-sm font-medium whitespace-nowrap transition-colors
              ${
                activeTab === tab
                  ? "text-black"
                  : "text-gray-600 hover:text-black"
              }`}
          >
            {tab}

            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 h-[3px] w-full bg-black rounded-full"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Channeltabs;