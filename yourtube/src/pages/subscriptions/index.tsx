import { useEffect, useState } from "react";
import axios from "axios";



const plans = [
  {
    name: "Free",
    price: "₹0",
    watchTime: "5 Minutes",
  },
  {
    name: "Bronze",
    price: "₹10",
    watchTime: "7 Minutes",
  },
  {
    name: "Silver",
    price: "₹50",
    watchTime: "10 Minutes",
  },
  {
    name: "Gold",
    price: "₹100",
    watchTime: "Unlimited",
  },
];

export default function SubscriptionsPage() {
  const [currentPlan, setCurrentPlan] = useState("Free");

const handleUpgrade = async (plan: string) => {
  const amount =
    plan === "Bronze"
      ? "₹10"
      : plan === "Silver"
      ? "₹50"
      : plan === "Gold"
      ? "₹100"
      : "₹0";

  // Simulate payment
  const paymentSuccess = window.confirm(
    `Proceed to pay ${amount} for the ${plan} Plan?`
  );

  if (!paymentSuccess) {
    alert("Payment cancelled.");
    return;
  }

  try {
    const currentUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const res = await axios.put(
  `${process.env.NEXT_PUBLIC_API_URL}/premium/upgrade`,
  {
    userId: currentUser._id,
    plan,
  }
);
    if (res.data.success) {
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      setCurrentPlan(res.data.user.plan);

      alert(
        `Payment Successful!\n\nYou have upgraded to the ${plan} Plan.`
      );
    }
  } catch (error) {
    console.error(error);
    alert("Upgrade failed");
  }
};

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setCurrentPlan(user.plan || "Free");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Upgrade Your Plan
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        {plans.map((plan) => (

          <div
            key={plan.name}
            className="bg-white rounded-xl shadow-lg p-6"
          >

            <h2 className="text-2xl font-bold">
              {plan.name}
            </h2>

            <p className="text-4xl font-bold mt-4">
              {plan.price}
            </p>

            <p className="mt-3">
              Watch Time
            </p>

            <p className="font-semibold">
              {plan.watchTime}
            </p>

            {currentPlan === plan.name ? (
              <button
                disabled
                className="mt-6 w-full bg-gray-400 text-white py-2 rounded-lg"
              >
                Current Plan
              </button>
            ) : (
              <button
  onClick={() => handleUpgrade(plan.name)}
  className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
>
  Upgrade
</button>
            )}

          </div>

        ))}

      </div>
      
    </div>
  );
}