const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Generated API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});