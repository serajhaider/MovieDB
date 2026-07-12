const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MovieRoutes = require('./src/routes/MovieRoutes');
app.use('/api/movies', MovieRoutes);

app.get('/', (req, res) => {
    res.send('Movie Express Server is running...')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Express Server is running on port ${PORT}`);
})
