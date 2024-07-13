const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const windowSize = 10;
let windowState = [];
const fetchingNumbers = async (type) => {
  try {
    const response = await axios.get(`http://20.244.56.144/test/${type}`, { timeout: 500 });
    return response.data.numbers;
  } catch (err) {
    console.error(`Error fetching numbers: ${err.message}`);
    return [];
  }
};
const calAvg = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};
app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  let type;
  switch (numberid) {
    case 'p':
      type = 'primes';
      break;
    case 'f':
      type = 'fibo';
      break;
    case 'e':
      type = 'even';
      break;
    case 'r':
      type = 'rand';
      break;
    default:
      return res.status(400).json({ error: 'Invalid number id' });
  }
  const newNumb = await fetchingNumbers(type);
  const uniqueNum = [...new Set([...windowState, ...newNumb])];
  const currWinState = uniqueNum.slice(-windowSize);
  const avg = calAvg(currWinState);
  const response = {
    numbers: newNumb,
    windowPrevState: windowState,
    winCurrState: currWinState,
    avg: avg.toFixed(2),
  };
  windowState = currWinState;
  res.json(response);
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});