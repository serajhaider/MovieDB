const express = require('express');
const app = express();
app.use(express.json());

const MovieRoutes = require('./src/routes/MovieRoutes');
app.use('/api/movies', MovieRoutes);

app.get('/', (req, res) => {
    res.send('Movie Express Server is running...')
})

app.listen(5000, () => {
    console.log('Express Server is running on port 5000');
})
