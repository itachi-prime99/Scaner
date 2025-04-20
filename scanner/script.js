const form = document.getElementById('form');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const pairCodeElem = document.getElementById('pairCode');
const sessionIdElem = document.getElementById('sessionId');
const statusText = document.getElementById('statusText');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const countryCode = document.getElementById('countryCode').value;
  const number = document.getElementById('number').value;

  if (!number || !countryCode) {
    alert('Please enter valid number and select country code.');
    return;
  }

  const fullNumber = countryCode + number;

  loading.classList.remove('hidden');
  result.classList.add('hidden');
  statusText.innerText = '';

  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: fullNumber })
    });

    const data = await response.json();

    if (data.success) {
      loading.classList.add('hidden');
      result.classList.remove('hidden');
      pairCodeElem.innerText = data.pairCode;
      sessionIdElem.innerText = data.sessionId;
      statusText.innerText = 'Status: WhatsApp Connected';
    } else {
      throw new Error(data.message || 'Unknown error');
    }
  } catch (error) {
    loading.classList.add('hidden');
    alert('Something went wrong: ' + error.message);
  }
});