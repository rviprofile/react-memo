export default async function postLeaderboard({ name, time }) {
  const response = await fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "POST",
    body: JSON.stringify({ name: name, time: time }),
  });
  if (!response.ok) {
    throw new Error("Ошибка сервера");
  }
  let data = await response.json().then(res => res.leaders);
  return data;
}
