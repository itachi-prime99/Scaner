function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 3; i++) {
    if (i > 0) code += "-";
    for (let j = 0; j < 3; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return code;
}

window.onload = function () {
  const pairCode = generateCode();
  document.getElementById("code").textContent = pairCode;

  fetch("https://api.ipify.org?format=json")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("ip").textContent = data.ip;
      return fetch(`https://ipapi.co/${data.ip}/json/`);
    })
    .then((res) => res.json())
    .then((loc) => {
      document.getElementById("location").textContent = `${loc.city}, ${loc.region}, ${loc.country_name}`;
      document.getElementById("browser").textContent = navigator.userAgent;
      document.getElementById("os").textContent = navigator.platform;

      document.getElementById("loader").style.display = "none";
      document.getElementById("content").style.display = "block";
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};
