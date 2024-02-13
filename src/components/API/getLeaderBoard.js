export default async function getLeaderboard() {
  const response = await fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Ошибка сервера");
  }
  let data = await response.json().then(res => res.leaders);
  return data;
}
