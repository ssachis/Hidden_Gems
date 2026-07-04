import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { MOCK_DESTINATIONS } from './src/services/mockData.js';
import { resolveImage } from './src/services/foursquareService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper for Foursquare category mapping
const getAppCategory = (categoryId, rating, reviewCount) => {
  if (categoryId >= 13000 && categoryId < 14000) {
    return 'Culinary & Dining';
  } else if (categoryId >= 10000 && categoryId < 11000) {
    return 'Culture & Heritage';
  } else {
    if (rating >= 8.5 && reviewCount < 100) {
      return 'Hidden Gems';
    }
    return 'Culture & Heritage';
  }
};

// API: Search Foursquare Places via local system credentials
app.get('/api/places', async (req, res) => {
  const { cityId } = req.query;
  const foursquareKey = process.env.VITE_FOURSQUARE_API_KEY;

  console.log(`[Server] Received /api/places request for cityId: ${cityId}`);

  // If no Foursquare Key is set in local system .env, return high-fidelity mocks
  if (!foursquareKey || foursquareKey === 'enter api key') {
    console.log('[Server] No Foursquare Key found. Returning local mock attractions.');
    const mockAttractions = MOCK_DESTINATIONS[cityId]?.attractions || [];
    const augmented = mockAttractions.map(p => ({
      ...p,
      imageUrl: p.imageUrl || resolveImage(p.name, p.category),
      vibeDescription: p.vibeDescription || `A tucked-away sanctuary radiating quiet mystery and authentic local character.`
    }));
    return res.json(augmented);
  }

  const destination = MOCK_DESTINATIONS[cityId];
  const cityName = destination ? destination.name : cityId;

  try {
    const response = await axios.get('https://api.foursquare.com/v3/places/search', {
      params: {
        near: cityName,
        limit: 12,
        fields: 'fsq_id,name,categories,rating,stats,location,description,photos',
      },
      headers: {
        Authorization: foursquareKey,
        Accept: 'application/json',
      },
    });

    const places = response.data.results.map((item) => {
      const categoryId = item.categories?.[0]?.id || 0;
      const rating = item.rating ? (item.rating / 10).toFixed(1) : (7.2 + Math.random() * 2).toFixed(1);
      const reviewCount = item.stats?.total_ratings || Math.floor(Math.random() * 300 + 10);
      const appCategory = getAppCategory(categoryId, parseFloat(rating), reviewCount);

      let imageUrl = null;
      if (item.photos?.[0]) {
        imageUrl = `${item.photos[0].prefix}original${item.photos[0].suffix}`;
      } else {
        imageUrl = resolveImage(item.name, appCategory);
      }

      let vibeDescription = '';
      if (appCategory === 'Hidden Gems') {
        vibeDescription = `A tucked-away sanctuary radiating quiet mystery and authentic local character.`;
      } else if (appCategory === 'Culinary & Dining') {
        vibeDescription = `A sensory culinary trip offering traditional, intense flavors beloved by local families.`;
      } else {
        vibeDescription = `A storied historical monument reflecting the deep, structural heritage of the location.`;
      }

      return {
        fsq_id: item.fsq_id,
        name: item.name,
        category: appCategory,
        rating,
        reviewCount,
        description: item.description || `A highly rated local spot situated in the heart of ${cityName}. Discover its authentic architecture and surroundings.`,
        address: item.location?.formatted_address || item.location?.address || 'Local Street Address',
        is_hidden_gem: appCategory === 'Hidden Gems',
        imageUrl,
        vibeDescription
      };
    });

    res.json(places);
  } catch (error) {
    console.error('[Server] Foursquare API Error, returning mock fallback:', error.message);
    const fallbackAttractions = MOCK_DESTINATIONS[cityId]?.attractions || [];
    const augmented = fallbackAttractions.map(p => ({
      ...p,
      imageUrl: p.imageUrl || resolveImage(p.name, p.category),
      vibeDescription: p.vibeDescription || `A tucked-away sanctuary radiating quiet mystery and authentic local character.`
    }));
    res.json(augmented);
  }
});

// API: Generate AI matched insights using Gemini API key in local system .env
app.post('/api/matched-insights', async (req, res) => {
  const { placeName, moodText, behaviorDescription } = req.body;
  const geminiKey = process.env.VITE_GEMINI_API_KEY;

  console.log(`[Server] Received /api/matched-insights request for: ${placeName}`);

  // Fallback preset response if Gemini key is missing
  const getFallback = () => ({
    whyMatchesVibe: `Matches your search for "${moodText}" by offering an atmospheric setting that connects you with the local charm away from the crowds.`,
    storyOfPlace: `${placeName} has played a historic role here, surviving centuries of structural changes and preserving regional craftsmanship.`,
    localsDo: `Locals love to visit early in the morning to read, grab a traditional snack, and spend a quiet hour reflecting.`
  });

  if (!geminiKey || geminiKey === 'enter api key') {
    console.log('[Server] No Gemini Key found. Returning fallback matched details.');
    return res.json(getFallback());
  }

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      contents: [{
        parts: [{
          text: `You are an expert cultural guide. The user is visiting ${placeName} in the mood for "${moodText}".
          Apply these AI behavior style constraints: ${behaviorDescription}
          Provide a JSON response with exactly three fields (no markdown, no backticks, raw JSON only):
          1. "whyMatchesVibe": A short, inspiring 2-sentence explanation of how this place satisfies the "${moodText}" vibe.
          2. "storyOfPlace": A fascinating, mysterious 3-sentence historical or cultural story about this place.
          3. "localsDo": A 2-sentence description of what local residents do here to experience it authentically.
          `
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error('[Server] Gemini Details Fetch Error, returning fallback:', error.message);
    res.json(getFallback());
  }
});

// API: Generate narrative story using Gemini
app.post('/api/story', async (req, res) => {
  const { cityName } = req.body;
  const geminiKey = process.env.VITE_GEMINI_API_KEY;

  console.log(`[Server] Received /api/story request for city: ${cityName}`);

  const getMockStory = () => {
    const clean = cityName.toLowerCase();
    for (const [key, value] of Object.entries(MOCK_DESTINATIONS)) {
      if (clean.includes(key)) return value.story;
    }
    return {
      title: `Secrets of ${cityName}`,
      narration: `Walking down the narrow alleys of ${cityName}, one quickly notices that the past is never fully buried. From ancient trade quarters to local family run crafts shops, the city reveals its stories slowly. Listen to the wind rustling through the local structures and discover what lies under the radar.`,
      audioLength: "1m 30s"
    };
  };

  if (!geminiKey || geminiKey === 'enter api key') {
    return res.json(getMockStory());
  }

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      contents: [{
        parts: [{
          text: `Write an immersive, poetic, and engaging audio narration story about the cultural heritage, secrets, and vibe of ${cityName}.
          Focus on quiet details, local history, and what makes this city stand out.
          Keep it to a length of around 150-180 words.
          Provide a JSON response with exactly two fields (no markdown, no backticks, raw JSON only):
          1. "title": A poetic title for the story.
          2. "narration": The full storytelling narration text.
          `
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    res.json({
      title: parsed.title,
      narration: parsed.narration,
      audioLength: "1m 40s"
    });
  } catch (error) {
    console.error('[Server] Gemini Story generation error:', error.message);
    res.json(getMockStory());
  }
});

// API: Dynamic Chat assistant guide using Gemini
app.post('/api/chat', async (req, res) => {
  const { message, history, guideName, guideTitle } = req.body;
  const geminiKey = process.env.VITE_GEMINI_API_KEY;

  console.log(`[Server] Received /api/chat message for guide: ${guideName}`);

  if (!geminiKey || geminiKey === 'enter api key') {
    // Quick automated mock reply
    const replies = [
      `I love that you asked! In my experience, the best way to enjoy this city is to wake up before sunrise and find a quiet corner.`,
      `That is a hidden gem in itself! Most travelers miss it entirely, but if you look under the radar, you will find authentic local workshops nearby.`,
      `Fascinating choice. There's a secret story about that spot dating back decades. I'd highly recommend walking there slowly.`
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    return res.json({ response: `${randomReply} (Demo Mode Response)` });
  }

  try {
    const systemPrompt = `You are ${guideName}, a ${guideTitle} in the destination. 
    You are an expert cultural guide. Answer the user's questions in a warm, welcoming, and locally authentic voice.
    Keep your response concise, helpful, and under 3-4 sentences.`;

    const contents = history.map(h => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Insert system prompt at start
    contents.unshift({
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemPrompt}]` }]
    });

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      contents
    });

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I am reflecting on that. Let me look it up.";
    res.json({ response: reply });
  } catch (error) {
    console.error('[Server] Gemini Chat error:', error.message);
    res.json({ response: "I am having trouble connecting to my memories right now. Let's try again in a moment." });
  }
});

// API: Custom Itinerary compiler via Gemini
app.post('/api/itinerary', async (req, res) => {
  const { cityName, moodName, durationDays } = req.body;
  const geminiKey = process.env.VITE_GEMINI_API_KEY;

  console.log(`[Server] Received /api/itinerary request for: ${cityName}`);

  if (!geminiKey || geminiKey === 'enter api key') {
    // Return a dummy 3-day itinerary structure
    const dummyItinerary = [];
    for (let i = 1; i <= durationDays; i++) {
      dummyItinerary.push({
        day: i,
        theme: `Day ${i}: Local Gems and Discovery`,
        stops: [
          `Local Heritage Site (Morning exploration)`,
          `Authentic Local Dining Spot (Lunch break)`,
          `Scenic Pathway or Artisan Craft Shop (Afternoon stroll)`
        ]
      });
    }
    return res.json({ itinerary: dummyItinerary });
  }

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      contents: [{
        parts: [{
          text: `Create a custom detailed travel itinerary for ${cityName} tailored to a "${moodName}" vibe.
          Duration: ${durationDays} days.
          Provide a JSON response representing an array of days. Each day object must contain:
          - "day": integer (e.g. 1)
          - "theme": a short descriptive theme for the day (e.g. "Peaceful Mornings & Historic Gardens")
          - "stops": an array of 3 string recommendations for stops (e.g. ["Ryoan-ji Zen Garden", "Nishiki Market", "Yasaka Shrine"])
          Return raw JSON representing the array (no markdown, no backticks, raw JSON only).
          `
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    // If it's wrapped in an object or directly is an array
    const itinerary = Array.isArray(parsed) ? parsed : (parsed.itinerary || parsed.days || []);
    res.json({ itinerary });
  } catch (error) {
    console.error('[Server] Gemini Itinerary Error:', error.message);
    res.json({ itinerary: [] });
  }
});

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(` Under-The-Radar Local Backend Running secure    `);
  console.log(` Port: ${PORT}                                   `);
  console.log(` Base API proxy active at http://localhost:${PORT} `);
  console.log(`================================================`);
});
