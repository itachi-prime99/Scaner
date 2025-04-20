document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const countryCode = document.getElementById("countryCode").value;
  const number = document.getElementById("number").value.trim();
  const phone = countryCode + number;

  if (!number || number.length < 6) {
    alert("Please enter a valid number.");
    return;
  }

  document.getElementById("loading").classList.remove("hidden");

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    document.getElementById("loading").classList.add("hidden");

    if (data.error) return alert(data.error);

    document.getElementById("pairCode").textContent = data.pairCode;
    document.getElementById("sessionId").textContent = data.sessionId;
    document.getElementById("result").classList.remove("hidden");

    const statusText = document.getElementById("statusText");
    const interval = setInterval(async () => {
      const res = await fetch(`/status/${data.sessionId}`);
      const json = await res.json();
      if (json.connected) {
        statusText.textContent = "WhatsApp Connected";
        clearInterval(interval);
      }
    }, 3000);
  } catch (err) {
    document.getElementById("loading").classList.add("hidden");
    alert("Something went wrong. Try again.");
  }
});