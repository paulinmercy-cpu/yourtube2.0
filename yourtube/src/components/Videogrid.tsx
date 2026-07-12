"use client";

import { useEffect, useState } from "react";
import Videocard from "./Videocard";

const categories = [
  "All",
  "Music",
  "Gaming",
  "Movies",
  "News",
  "Sports",
  "Technology",
  "Comedy",
  "Education",
  "Travel",
];


export default function Videogrid() {

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [videos, setVideos] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);



  useEffect(() => {

    const fetchVideos = async () => {

      try {

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://yourtube2-0-4-j9xs.onrender.com";


        console.log(
          "Fetching videos from:",
          `${API_URL}/video`
        );


        const res = await fetch(
          `${API_URL}/video`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );


        if (!res.ok) {

          throw new Error(
            `Server error: ${res.status}`
          );

        }


        const data = await res.json();


        console.log(
          "Video response:",
          data
        );


        // Handles both API formats
        if (Array.isArray(data)) {

          setVideos(data);

        } 
        else {

          setVideos(
            data.videos || []
          );

        }



      } 
        
      catch(error) {

        console.error(
          "Unable to connect to server:",
          error
        );

      }

      finally {

        setLoading(false);

      }

    };


    fetchVideos();


  }, []);




  const filteredVideos =
    selectedCategory === "All"

      ? videos

      : videos.filter(
          (video) =>
            video.category === selectedCategory
        );



  if (loading) {

    return (
      <div className="text-center p-10">
        Loading videos...
      </div>
    );

  }




  return (

    <div className="p-6">


      <div className="
        flex gap-3 
        overflow-x-auto 
        mb-6
      ">

        {
          categories.map((category)=>(

            <button

              key={category}

              onClick={() =>
                setSelectedCategory(category)
              }

              className={`
                px-4 py-2 rounded-lg 
                whitespace-nowrap
                ${
                  selectedCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                }
              `}

            >

              {category}

            </button>

          ))
        }

      </div>




      <div className="
        grid 
        grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-3 
        gap-6
      ">

        {
          filteredVideos.map((video)=>(

            <Videocard

              key={video._id}

              video={video}

            />

          ))
        }


      </div>


    </div>

  );

}