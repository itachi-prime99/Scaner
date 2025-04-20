const form = document.getElementById("scanner-form");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = document.getElementById("phone").value;

  if (!phone.startsWith("+")) {
    alert("Please enter phone number with country code, e.g. +8801XXXXXXXXX");
    return;
  }

  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  const data = await res.json();

  document.getElementById("showPhone").textContent = phone;
  document.getElementById("pairCode").textContent = data.pairCode;
  document.getElementById("sessionId").textContent = data.sessionId;
  document.getElementById("status").textContent = "Waiting for device link...";
  resultDiv.classList.remove("hidden");

  // Polling for status update
  const checkStatus = setInterval(async () => {
    const statusRes = await fetch(`/status/${data.sessionId}`);
    const { connected } = await statusRes.json();

    if (connected) {
      document.getElementById("status").textContent = "WhatsApp Connected";
      clearInterval(checkStatus);
    }
  }, 3000);
});