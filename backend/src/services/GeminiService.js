require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;

if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('WARNING: GEMINI_API_KEY is not set. AI recommendations will not work.');
} else {
    genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Generic content generator - mirrors teacher's generateContent pattern
 */
async function generateContent(prompt) {
    if (!genAI) throw new Error('GEMINI_API_KEY is not configured.');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * Movie Recommender - Week 7 feature
 * Sends watchlist + genres to Gemini and returns 3 JSON recommendations
 */
async function recommendMovies(watchlist, favouriteGenres, allMovies) {
    if (!genAI) throw new Error('GEMINI_API_KEY is not configured.');

    const watchlistTitles = watchlist.map(m => m.title || m).join(', ') || 'No movies in watchlist yet';
    const genreList = favouriteGenres.length > 0 ? favouriteGenres.join(', ') : 'Action, Drama';
    const catalogTitles = allMovies.map(m => `${m.title} (${m.genre}, ${m.year}, Rating: ${m.avgRating || m.rating || 'N/A'})`).join('\n');

    const prompt = `Based on this user's watchlist and favourite genres, recommend 3 movies from our database they would enjoy, with reasons. Return JSON.

User's watchlist: ${watchlistTitles}
User's favourite genres: ${genreList}

Our movie database catalog:
${catalogTitles}

IMPORTANT: Only recommend movies that exist in our catalog above. Return ONLY a valid JSON array like this:
[
  {
    "title": "Exact Movie Title From Catalog",
    "reason": "One or two sentence explanation of why this user would love this movie based on their watchlist and taste."
  },
  {
    "title": "Exact Movie Title From Catalog",
    "reason": "One or two sentence explanation."
  },
  {
    "title": "Exact Movie Title From Catalog",
    "reason": "One or two sentence explanation."
  }
]
Return ONLY the JSON array, no markdown, no extra text.`;

    const rawText = await generateContent(prompt);

    // Strip markdown code fences if Gemini adds them
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const recommendations = JSON.parse(cleaned);

    // Enrich recommendations with full movie data from catalog
    const enriched = recommendations.map(rec => {
        const match = allMovies.find(m =>
            m.title.toLowerCase().trim() === rec.title.toLowerCase().trim()
        );
        return {
            title: rec.title,
            reason: rec.reason,
            movie: match || null
        };
    });

    return enriched;
}

module.exports = { generateContent, recommendMovies };
