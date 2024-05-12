export const CheckStatusMC = (online, status) => {
  let obj = { onlineMC: "OFFLINE", color: "#C92A0C" };
  if (online === "ONLINE" && status === "RUN") {
    obj.onlineMC = "RUN";
    obj.color = "#34C90C";
  }
  if (online === "ONLINE" && status === "WAITTING") {
    obj.onlineMC = "WAITTING";
    obj.color = "orange";
  }
  if (online === "ONLINE" && status === "ONLINE") {
    obj.onlineMC = "STOP";
    obj.color = "#C92A0C";
  }
  return obj;
};
