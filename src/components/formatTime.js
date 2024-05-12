export const formatTime = (miliseconds) => {
  const time = new Date(parseInt(miliseconds, 10)) / 1000;
  const seconds = Math.floor(time % 60);
  let remaining = Math.floor(time / 60);

  const minutes = Math.floor(remaining % 60);
  remaining = Math.floor(remaining / 60);

  const hours = Math.floor(remaining % 60);
  remaining = Math.floor(remaining / 60);

  const days = Math.floor(remaining / 24);
  return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${
    seconds ? `${seconds}s ` : ""
  }`;
};
