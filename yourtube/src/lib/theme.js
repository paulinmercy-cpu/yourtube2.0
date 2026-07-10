const southStates = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
];

export function getThemeByLocation(state) {
  const now = new Date();

  const ist = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );

  const hour = ist.getHours();

  const isSouth = southStates.includes(state);

  if (isSouth && hour >= 10 && hour < 12) {
    return "light";
  }

  return "dark";
}