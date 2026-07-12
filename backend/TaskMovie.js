const express = require('express');
const app = express();
app.use(express.json());

const movieDB = [
  { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010, watched: false },
  { id: 2, title: 'The Matrix', genre: 'Action', year: 1999, watched: true },
  { id: 3, title: 'Interstellar', genre: 'Adventure', year: 2014, watched: false }
];

let nextId = 4;

app.get('/', (req, res) => {
  res.send('Movie API is running');
});

app.get('/movies', (req, res) => {
  res.status(200).json(movieDB);
});

app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movieDB.find((m) => m.id === id);

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.status(200).json(movie);
});

app.post('/movies', (req, res) => {
  const newMovie = req.body;
  newMovie.id = nextId++;
  movieDB.push(newMovie);
  res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movieDB.findIndex((m) => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  movieDB[movieIndex] = { ...movieDB[movieIndex], ...req.body };
  res.status(200).json(movieDB[movieIndex]);
});

app.delete('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movieDB.findIndex((m) => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  movieDB.splice(movieIndex, 1);
  res.status(200).json({ message: 'Movie deleted successfully' });
});

app.listen(3000, () => {
  console.log('Movie server is running on port 3000');
});
