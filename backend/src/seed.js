const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/MovieModel');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedMovies = [
    {
        title: "Interstellar",
        genre: "Sci-Fi",
        year: 2014,
        director: "Christopher Nolan",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces famine and collapse.",
        avgRating: 8.7,
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
        poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "Alex Cinema", comment: "A visual and emotional masterpiece. Hans Zimmer's soundtrack is unforgettable.", rating: 9.5 }
        ]
    },
    {
        title: "Oppenheimer",
        genre: "Drama",
        year: 2023,
        director: "Christopher Nolan",
        synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
        avgRating: 8.9,
        cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
        poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "Sarah Film", comment: "Cillian Murphy gives a career-defining performance.", rating: 9.0 }
        ]
    },
    {
        title: "Joker",
        genre: "Crime",
        year: 2019,
        director: "Todd Phillips",
        synopsis: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City.",
        avgRating: 8.4,
        cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz", "Frances Conroy"],
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        featured: false,
        reviews: [
            { user: "Mark Critic", comment: "Intense character study with an Oscar-winning performance.", rating: 8.5 }
        ]
    },
    {
        title: "Avatar",
        genre: "Adventure",
        year: 2009,
        director: "James Cameron",
        synopsis: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
        avgRating: 7.9,
        cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang"],
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "Elena Tech", comment: "Revolutionary visual technology that redefined cinema.", rating: 8.0 }
        ]
    },
    {
        title: "The Batman",
        genre: "Action",
        year: 2022,
        director: "Matt Reeves",
        synopsis: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
        avgRating: 7.8,
        cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Colin Farrell"],
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
        featured: false,
        reviews: [
            { user: "DarkKnightFan", comment: "Gritty, noir detective story Batman at its finest.", rating: 8.2 }
        ]
    },
    {
        title: "Dune",
        genre: "Sci-Fi",
        year: 2021,
        director: "Denis Villeneuve",
        synopsis: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir is troubled by visions of a dark future.",
        avgRating: 8.1,
        cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac", "Zendaya"],
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "SciFiLover", comment: "Stunning scale, world-building, and cinematography.", rating: 8.8 }
        ]
    },
    {
        title: "Inception",
        genre: "Sci-Fi",
        year: 2010,
        director: "Christopher Nolan",
        synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        avgRating: 8.8,
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "MindBender", comment: "A mind-bending action thriller that demands re-watches.", rating: 9.2 }
        ]
    },
    {
        title: "Titanic",
        genre: "Romance",
        year: 1997,
        director: "James Cameron",
        synopsis: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
        avgRating: 7.9,
        cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane", "Kathy Bates"],
        poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        featured: false,
        reviews: [
            { user: "ClassicWatcher", comment: "An epic romance that stands the test of time.", rating: 8.0 }
        ]
    },
    {
        title: "Gladiator",
        genre: "Action",
        year: 2000,
        director: "Ridley Scott",
        synopsis: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
        avgRating: 8.5,
        cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen", "Oliver Reed"],
        poster: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "HistoryBuff", comment: "Are you not entertained? Brilliant performances!", rating: 9.0 }
        ]
    },
    {
        title: "The Dark Knight",
        genre: "Action",
        year: 2008,
        director: "Christopher Nolan",
        synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        avgRating: 9.0,
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Maggie Gyllenhaal"],
        poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "HeathFan", comment: "Heath Ledger's Joker is the greatest comic book villain performance ever.", rating: 10.0 }
        ]
    },
    {
        title: "The Matrix",
        genre: "Sci-Fi",
        year: 1999,
        director: "Lana Wachowski, Lilly Wachowski",
        synopsis: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth - the life he knows is the elaborate deception of an evil cyber-intelligence.",
        avgRating: 8.7,
        cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
        poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "CyberHacker", comment: "Red pill or blue pill? An absolute sci-fi revolution.", rating: 9.0 }
        ]
    },
    {
        title: "Parasite",
        genre: "Drama",
        year: 2019,
        director: "Bong Joon Ho",
        synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        avgRating: 8.5,
        cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"],
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "CinephileGlobal", comment: "A brilliant, sharp satire that deserved every Oscar it won.", rating: 9.3 }
        ]
    },
    {
        title: "Fight Club",
        genre: "Drama",
        year: 1999,
        director: "David Fincher",
        synopsis: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
        avgRating: 8.8,
        cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf"],
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
        featured: false,
        reviews: [
            { user: "TylerDurden", comment: "Rule #1: You do not talk about Fight Club.", rating: 9.0 }
        ]
    },
    {
        title: "John Wick",
        genre: "Action",
        year: 2014,
        director: "Chad Stahelski",
        synopsis: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.",
        avgRating: 7.4,
        cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen", "Willem Dafoe"],
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        featured: false,
        reviews: [
            { user: "ActionJunkie", comment: "Clean, stylish gun-fu choreography. Keanu at his coolest.", rating: 8.0 }
        ]
    },
    {
        title: "Avengers: Endgame",
        genre: "Action",
        year: 2019,
        director: "Anthony Russo, Joe Russo",
        synopsis: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",
        avgRating: 8.4,
        cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth"],
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "MarvelFanatic", comment: "An incredible conclusion to a decade of superhero storytelling.", rating: 9.0 }
        ]
    },
    {
        title: "Deadpool",
        genre: "Comedy",
        year: 2016,
        director: "Tim Miller",
        synopsis: "A wisecracking mercenary gets experimented on and becomes immortal, then sets out to track down the man who ruined his looks.",
        avgRating: 8.0,
        cast: ["Ryan Reynolds", "Morena Baccarin", "T.J. Miller", "Ed Skrein"],
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        featured: false,
        reviews: [
            { user: "HumorLover", comment: "Hilarious fourth-wall breaking and great action.", rating: 8.2 }
        ]
    },
    {
        title: "Mission: Impossible - Fallout",
        genre: "Action",
        year: 2018,
        director: "Christopher McQuarrie",
        synopsis: "Ethan Hunt and his IMF team, along with some familiar allies, race against time after a mission goes wrong.",
        avgRating: 7.7,
        cast: ["Tom Cruise", "Henry Cavill", "Ving Rhames", "Simon Pegg"],
        poster: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80",
        featured: false,
        reviews: [
            { user: "StuntEnthusiast", comment: "Tom Cruise does impossible stunts for real. Thrilling ride!", rating: 8.5 }
        ]
    },
    {
        title: "Top Gun: Maverick",
        genre: "Action",
        year: 2022,
        director: "Joseph Kosinski",
        synopsis: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOPGUN's elite graduates.",
        avgRating: 8.3,
        cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Jon Hamm"],
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "AviationGeek", comment: "Superior to the original. Heart-pounding aerial action.", rating: 9.0 }
        ]
    },
    {
        title: "The Shawshank Redemption",
        genre: "Drama",
        year: 1994,
        director: "Frank Darabont",
        synopsis: "Over the course of several years, two convicts form a friendship, seeking consolation and eventual redemption through basic compassion.",
        avgRating: 9.3,
        cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
        poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "MovieBuff#1", comment: "The highest rated film for a reason. Pure hope and emotion.", rating: 9.8 }
        ]
    },
    {
        title: "The Godfather",
        genre: "Crime",
        year: 1972,
        director: "Francis Ford Coppola",
        synopsis: "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
        avgRating: 9.2,
        cast: ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall"],
        poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
        featured: true,
        reviews: [
            { user: "MafiaCine", comment: "An offer you can't refuse. The gold standard of cinema.", rating: 9.7 }
        ]
    }
];

const runSeed = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MONGO_URI missing in .env file!');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing movies
        await Movie.deleteMany({});
        console.log('Cleared existing movies catalog');

        // Insert 20 movies
        const inserted = await Movie.insertMany(seedMovies);
        console.log(`Successfully seeded ${inserted.length} movies into database!`);

        inserted.forEach((m, idx) => {
            console.log(` ${idx + 1}. ${m.title} (${m.year}) - Genre: ${m.genre} [Featured: ${m.featured}]`);
        });

        await mongoose.disconnect();
        console.log('Disconnected. Seed process complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

runSeed();
