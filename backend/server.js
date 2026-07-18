const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const MovieRoutes = require('./src/routes/MovieRoutes');
app.use('/api/movies', MovieRoutes);

app.get('/', (req, res) => {
    res.send('Movie Express + MongoDB Server is running...')
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Express Server is running on port ${PORT}`);
});
