export default function formatTime(interval) {
  let mm = Math.floor(interval / 60);
  let ss = Math.floor((interval -= mm * 60));
  if (ss < 10) {
    ss = `0${ss}`;
  }
  return `${mm}:${ss}`;
}
