const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/MovieModel');

dotenv.config({ path: '../.env' });

const seedMovies = [
    {
        title: "Interstellar",
        genre: "Sci-Fi",
        year: 2014,
        director: "Christopher Nolan",
        synopsis: "A team of astronauts travels through a wormhole in search of a new home for humanity.",
        avgRating: 8.7,
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        poster: "/posters/interstellar.jpg",
        reviews: [],
        watched: false
    },
    {
        title: "Inception",
        genre: "Sci-Fi",
        year: 2010,
        director: "Christopher Nolan",
        synopsis: "A skilled thief enters people's dreams to steal secrets but is given one final mission.",
        avgRating: 8.8,
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Tom Hardy"],
        poster: "/posters/inception.jpg",
        reviews: [],
        watched: false
    },
    {
        title: "Avatar",
        genre: "Adventure",
        year: 2009,
        director: "James Cameron",
        synopsis: "A marine joins the Avatar Program and becomes involved in the conflict on Pandora.",
        avgRating: 7.8,
        cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
        poster: "/posters/avatar.jpg",
        reviews: [],
        watched: false
    },
    {
        title: "Batman",
        genre: "Action",
        year: 2022,
        director: "Matt Reeves",
        synopsis: "Batman uncovers corruption in Gotham City while pursuing the mysterious Riddler.",
        avgRating: 6.5,
        cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
        poster: "/posters/batman.jpg",
        reviews: [],
        watched: false
    },
    {
        title: "Joker",
        genre: "Crime",
        year: 2019,
        director: "Todd Phillips",
        synopsis: "A failed comedian slowly descends into madness and becomes Gotham's infamous Joker.",
        avgRating: 4.9,
        cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
        poster: "/posters/jocker.jpg",
        reviews: [],
        watched: false
    }
];

const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear existing movies
        await Movie.deleteMany({});
        console.log('🗑️  Cleared existing movies');

        // Insert seed data
        const inserted = await Movie.insertMany(seedMovies);
        console.log(`🌱 Seeded ${inserted.length} movies successfully!`);

        inserted.forEach(m => console.log(`   - ${m.title} (${m.year})`));

        await mongoose.disconnect();
        console.log('✅ Disconnected. Seed complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed Error:', error.message);
        process.exit(1);
    }
};

runSeed();
