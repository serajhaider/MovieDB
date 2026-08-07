require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Get GoogleGenerativeAI instance dynamically from process.env
 */
function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('GEMINI_API_KEY is not configured in environment variables.');
    }
    return new GoogleGenerativeAI(apiKey.trim());
}

/**
 * Generic content generator with automatic model fallback
 */
async function generateContent(prompt) {
    const genAI = getGenAI();

    const candidateModels = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-pro'
    ];

    let lastError = null;
    for (const modelName of candidateModels) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            console.warn(`Gemini model ${modelName} attempt failed:`, err.message);
            lastError = err;
        }
    }
    throw lastError || new Error('Failed to generate content from Gemini API.');
}

/**
 * Movie Recommender - Week 7 feature
 * Sends watchlist + genres to Gemini and returns 3 JSON recommendations
 */
async function recommendMovies(watchlist, favouriteGenres, allMovies) {
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
    
    let recommendations = [];
    try {
        recommendations = JSON.parse(cleaned);
    } catch (parseErr) {
        console.error('Failed to parse Gemini JSON output:', cleaned);
        const jsonMatch = cleaned.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
            recommendations = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('Gemini output could not be parsed as JSON array.');
        }
    }

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
