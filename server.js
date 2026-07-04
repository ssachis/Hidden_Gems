import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { MOCK_DESTINATIONS } from './src/services/mockData.js';
import { resolveImage } from './src/services/foursquareService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security Middleware
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later."
});
app.use('/api', limiter);

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

// API: Search Foursquare Places via local system credentials (supports sights and dining)
app.get('/api/places', async (req, res) => {
  const { cityId, type } = req.query;
  const foursquareKey = process.env.VITE_FOURSQUARE_API_KEY;

  console.log(`[Server] Received /api/places request for cityId: ${cityId}, type: ${type}`);

  const destination = MOCK_DESTINATIONS[cityId];
  const cityName = destination ? destination.name : cityId;

  // Set category filters based on requested type
  // 13000 = Food and Beverage
  // 16000 = Landmarks & Outdoors, 10000 = Arts & Entertainment
  const categoriesParam = type === 'dining' ? '13000' : '16000,10000';

  // If no Foursquare Key is set, return high-fidelity mocks filtered by type
  if (!foursquareKey || foursquareKey === 'enter api key') {
    console.log('[Server] No Foursquare Key. Returning local mock data.');
    const mockAttractions = destination?.attractions || [];
    
    // Filter mocks to match requested type
    const filteredMocks = mockAttractions.filter(p => {
      if (type === 'dining') return p.category === 'Culinary & Dining';
      return p.category !== 'Culinary & Dining';
    });

    const augmented = filteredMocks.map(p => ({
      ...p,
      imageUrl: p.imageUrl || resolveImage(p.name, p.category),
      vibeDescription: p.vibeDescription || `A tucked-away spot reflecting the authentic local character.`
    }));
    return res.json(augmented);
  }

  try {
    const response = await axios.get('https://api.foursquare.com/v3/places/search', {
      params: {
        near: cityName,
        categories: categoriesParam,
        limit: 8,
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
    console.error('[Server] Foursquare API Error. Key is present but query failed:', error.message);
    res.json([]);
  }
});

// API: Generate AI vibe intro advice
app.post('/api/vibe-summary', async (req, res) => {
  const { cityName, moodText } = req.body;
  const geminiKey = process.env.VITE_GEMINI_API_KEY;

  console.log(`[Server] Received /api/vibe-summary request for city: ${cityName}, mood: ${moodText}`);

  const defaultSummary = `Welcome to ${cityName}. Explore the area under the "${moodText}" vibe to discover unique corners, regional heritage, and authentic local sights.`;

  if (!geminiKey || geminiKey === 'enter api key') {
    return res.json({ summary: defaultSummary });
  }

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      contents: [{
        parts: [{
          text: `You are an expert cultural guide. The user is visiting ${cityName} in the mood for "${moodText}".
          Write a short, highly inspiring 2-sentence vibe advice intro summarizing how they should feel and explore the city today.
          Provide a JSON response with exactly one field: "summary".
          `
        }]
      }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    res.json({ summary: parsed.summary });
  } catch (error) {
    console.error('[Server] Gemini vibe-summary error:', error.message);
    res.json({ summary: defaultSummary });
  }
});

// API: Fetch local events (via Gemini AI or Eventbrite if configured)
app.post('/api/events', async (req, res) => {
  const { cityName, moodText } = req.body;
  const geminiKey = process.env.VITE_GEMINI_API_KEY;
  const eventbriteKey = process.env.VITE_EVENTBRITE_API_KEY;

  console.log(`[Server] Received /api/events request for city: ${cityName}`);

  // Fallback events matching location
  const getMockEvents = () => {
    return [
      {
        name: "Artisanal Crafts & Ceramics Exhibition",
        date: "Every Weekend",
        description: "A small street gathering of local potters and textile artisans showcasing traditional work.",
        venue: "Heritage District Craft Hall"
      },
      {
        name: "Seasonal Floating Lantern & Food Trail",
        date: "Thursday Evenings",
        description: "Walk along the water to experience traditional food stalls under floating paper lanterns.",
        venue: "Riverside Walkway"
      },
      {
        name: "Underground Heritage Jazz & Vinyl Session",
        date: "Nightly from 9PM",
        description: "A cozy acoustic vinyl listening room showcasing regional classical and jazz records.",
        venue: "The Cellar Lounge"
      }
    ];
  };

  // If Eventbrite Key is present, we use Eventbrite API.
  if (eventbriteKey && eventbriteKey !== 'enter api key' && eventbriteKey !== '') {
    try {
      const response = await axios.get('https://www.eventbriteapi.com/v3/events/search/', {
        params: {
          'location.address': cityName,
          'sort_by': 'date',
          'page_size': 5
        },
        headers: {
          Authorization: `Bearer ${eventbriteKey}`
        }
      });
      
      const events = response.data.events.map(e => ({
        name: e.name.text,
        date: new Date(e.start.local).toLocaleDateString(),
        description: e.summary || "A local cultural gathering.",
        venue: e.venue_id || "Local Venue" // Eventbrite v3 search doesn't embed venue natively unless expanded, but this is a minimal representation
      }));
      return res.json({ events });
    } catch (error) {
      console.error('[Server] Eventbrite API Error:', error.message);
      return res.json({ events: [] }); // No mock fallback if key is present
    }
  }

  // Otherwise, we use Gemini to dynamically fetch REAL, actual cultural events or seasonal happenings in that city!
  if (!geminiKey || geminiKey === 'enter api key') {
    return res.json({ events: getMockEvents() });
  }

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
      contents: [{
        parts: [{
          text: `You are an expert cultural guide. The user is visiting ${cityName} under the vibe: "${moodText}".
          List 3 actual, real local cultural events, seasonal festivals, or recurring weekly events in ${cityName} that match this vibe.
          Provide a JSON response representing an array of events under a key "events". Each event object must have:
          1. "name": The actual name of the event.
          2. "date": The specific month, day, or recurring schedule (e.g., "July 17th" or "Every Friday Night").
          3. "description": A short 1-sentence description of the event.
          4. "venue": The real location/neighborhood where it occurs.
          `
        }]
      }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    res.json({ events: parsed.events || [] });
  } catch (error) {
    console.error('[Server] Gemini Events fetch error:', error.message);
    res.json({ events: [] }); // No mock fallback if key is present but fails
  }
});

// API: Generate AI matched insights using Gemini API key in local system .env
app.post('/api/matched-insights', async (req, res) => {
  const { placeName, moodText, behaviorDescription } = req.body;
  const geminiKey = process.env.VITE_GEMINI_API_KEY;

  console.log(`[Server] Received /api/matched-insights request for: ${placeName}`);

  const getFallback = () => ({
    whyMatchesVibe: `Matches your search for "${moodText}" by offering an atmospheric setting that connects you with the local charm away from the crowds.`,
    storyOfPlace: `${placeName} has played a historic role here, surviving centuries of structural changes and preserving regional craftsmanship.`,
    localsDo: `Locals love to visit early in the morning to read, grab a traditional snack, and spend a quiet hour reflecting.`
  });

  if (!geminiKey || geminiKey === 'enter api key') {
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
      generationConfig: { responseMimeType: "application/json" }
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error('[Server] Gemini Details Fetch Error, returning fallback:', error.message);
    res.json(getFallback());
  }
});

// API: Dynamic Chat assistant guide using Gemini
app.post('/api/chat', async (req, res) => {
  const { message, history, guideName, guideTitle } = req.body;
  const geminiKey = process.env.VITE_GEMINI_API_KEY;

  console.log(`[Server] Received /api/chat message for guide: ${guideName}`);

  if (!geminiKey || geminiKey === 'enter api key') {
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
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

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

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(` Under-The-Radar Local Backend Running secure    `);
  console.log(` Port: ${PORT}                                   `);
  console.log(` Base API proxy active at http://localhost:${PORT} `);
  console.log(`================================================`);
});
