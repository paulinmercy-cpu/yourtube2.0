import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.error("NEXT_PUBLIC_API_URL is missing");
}


const axiosInstance = axios.create({

  baseURL: API_URL,

  timeout: 30000,

  headers: {
    "Content-Type": "application/json",
  },

});



axiosInstance.interceptors.request.use(

  (config) => {

    if (typeof window !== "undefined") {

      const storedUser = localStorage.getItem("user");

      if (storedUser) {

        try {

          const user = JSON.parse(storedUser);

          if (user?.token) {

            config.headers.Authorization =
              `Bearer ${user.token}`;

          }

        } catch(error) {

          console.error(
            "Invalid user data in localStorage"
          );

        }

      }

    }


    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );


    return config;

  },

  (error) => Promise.reject(error)

);



axiosInstance.interceptors.response.use(

  (response)=> response,


  (error)=>{

    console.error(
      "API Error:",
      error.message,
      error.response?.data
    );

    return Promise.reject(error);

  }

);



export default axiosInstance;