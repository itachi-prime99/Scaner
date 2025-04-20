const form = document.getElementById("scanner-form");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = document.getElementById("phone").value;

  if (!phone) return alert("Phone number is required");

  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  const data = await res.json();

  document.getElementById("showPhone").textContent = phone;
  document.getElementById("pairCode").textContent = data.pairCode;
  document.getElementById("sessionId").textContent = data.sessionId;
  resultDiv.classList.remove("hidden");
});
