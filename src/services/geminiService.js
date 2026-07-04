import axios from 'axios';
import { MOCK_DESTINATIONS } from './mockData';

const callGeminiAPI = async (apiKey, prompt, systemInstruction = null) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [
        { text: systemInstruction }
      ]
    };
  }

  const response = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

// Generate an immersive historical and cultural story
export const generateStory = async (cityId, customApiKey = null) => {
  const destination = MOCK_DESTINATIONS[cityId];
  if (!destination) return null;

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    try {
      console.log(`[Gemini] Querying local proxy backend for story of: ${cityId}`);
      const response = await axios.post('/api/story', { cityName: destination.name });
      return response.data;
    } catch (err) {
      console.warn("[Gemini] Local story proxy failed, falling back to frontend direct/mock:", err.message);
    }
  }

  if (!customApiKey || customApiKey === 'enter api key' || customApiKey === '') {
    console.log(`[Gemini] Demo Mode: Returning static story for ${cityId}`);
    return destination.story;
  }

  const prompt = `Write an immersive, poetic, and highly educational cultural storytelling narrative about ${destination.name}, ${destination.country}. 
Include historical details, sensory descriptions (sounds, smells, sights), and the philosophical essence of the destination (e.g. mindfulness in Kyoto, layer of history in Rome, ancient resilience in Cairo). 
Keep it under 300 words. Provide a title first.`;

  try {
    const text = await callGeminiAPI(customApiKey, prompt);
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const title = lines[0]?.replace(/^#*\s*/, '') || `Exploring ${destination.name}`;
    const narration = lines.slice(1).join('\n\n');
    return {
      title,
      narration,
      audioLength: '1m 20s'
    };
  } catch (error) {
    console.error('Gemini Storytelling API Error, falling back to mock:', error);
    return destination.story;
  }
};

// Generate an itinerary based on user input details
export const generateItinerary = async (cityId, duration = 3, preferences = '', customApiKey = null) => {
  const destination = MOCK_DESTINATIONS[cityId];
  if (!destination) return [];

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    try {
      console.log(`[Gemini] Querying local proxy backend for itinerary for: ${cityId}`);
      const response = await axios.post('/api/itinerary', {
        cityName: destination.name,
        moodName: preferences,
        durationDays: duration
      });
      
      // Map server day structure back to activities array format
      const itinerary = response.data.itinerary.map(item => ({
        id: `day-${item.day}`,
        day: `Day ${item.day}`,
        activities: item.stops.map((stop, sIdx) => ({
          id: `act-d${item.day}-${sIdx}`,
          time: sIdx === 0 ? "09:00 AM" : sIdx === 1 ? "02:00 PM" : "07:00 PM",
          title: stop,
          description: `Custom curated itinerary stop for a ${preferences} experience in the city.`,
          location: destination.name
        }))
      }));
      return itinerary;
    } catch (err) {
      console.warn("[Gemini] Local itinerary proxy failed, falling back to frontend direct/mock:", err.message);
    }
  }

  if (!customApiKey || customApiKey === 'enter api key' || customApiKey === '') {
    console.log(`[Gemini] Demo Mode: Generating mock itinerary for ${cityId}`);
    // Generate a basic mock itinerary based on duration
    const items = destination.attractions;
    const itinerary = [];
    for (let day = 1; day <= duration; day++) {
      const idx1 = (day * 2 - 2) % items.length;
      const idx2 = (day * 2 - 1) % items.length;
      
      itinerary.push({
        id: `day-${day}`,
        day: `Day ${day}`,
        activities: [
          {
            id: `act-d${day}-1`,
            time: "09:00 AM",
            title: `Explore ${items[idx1]?.name || 'Local Landmark'}`,
            description: `Visit and discover the cultural heritage of this site. ${items[idx1]?.description || ''}`,
            location: items[idx1]?.address || 'City Center'
          },
          {
            id: `act-d${day}-2`,
            time: "02:00 PM",
            title: `Uncover ${items[idx2]?.name || 'Local Gem'}`,
            description: `Experience the neighborhood flavor and unique history. ${items[idx2]?.description || ''}`,
            location: items[idx2]?.address || 'Local Neighborhood'
          }
        ]
      });
    }
    return itinerary;
  }

  const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination.name}, ${destination.country} focusing on: ${preferences || 'Culture, heritage, and local culinary experiences'}.
Format the output strictly as a JSON array where each item represents a day. Each day should have a unique 'id' (e.g. "day-1"), a 'day' label (e.g. "Day 1"), and an 'activities' array.
Each activity should have: 'id' (unique string), 'time' (e.g. "09:00 AM"), 'title' (specific landmark or experience), 'description' (a brief sentence explaining the cultural context), and 'location' (general address).
Do not include markdown markers like \`\`\`json in the output. Just return raw JSON.`;

  try {
    const text = await callGeminiAPI(
      customApiKey, 
      prompt, 
      "You are an expert cultural travel planner. You only output valid, parsable raw JSON."
    );
    // Parse the JSON string
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini Itinerary API Error, falling back to mock:', error);
    // Return mock fallback
    return generateItinerary(cityId, duration, preferences, null);
  }
};

// Conversational AI Local Guide Chat
export const chatWithGuide = async (cityId, messages, customApiKey = null) => {
  const destination = MOCK_DESTINATIONS[cityId];
  if (!destination) return "I'm sorry, I cannot assist with this city.";

  const guide = destination.guideProfile;
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    try {
      console.log(`[Gemini] Querying local proxy backend for guide chat: ${guide.name}`);
      const lastMsg = messages[messages.length - 1]?.text || '';
      const response = await axios.post('/api/chat', {
        message: lastMsg,
        history: messages.slice(0, -1),
        guideName: guide.name,
        guideTitle: guide.title
      });
      return response.data.response;
    } catch (err) {
      console.warn("[Gemini] Local chat proxy failed, falling back to frontend direct/mock:", err.message);
    }
  }

  if (!customApiKey || customApiKey === 'enter api key' || customApiKey === '') {
    console.log(`[Gemini] Demo Mode: Generating mock guide response for ${cityId}`);
    const lastMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
    
    // Simple custom keyword mock engine for extremely intuitive, instant guide interactions
    if (lastMsg.includes('food') || lastMsg.includes('eat') || lastMsg.includes('culinary') || lastMsg.includes('restaurant')) {
      return `For authentic food in ${destination.name}, you absolutely must visit local markets and traditional eateries. For example, try the specialties at ${destination.attractions.find(a => a.category === 'Culinary & Dining')?.name || 'local spots'}. In our culture, sharing food is an act of trust and warmth!`;
    }
    if (lastMsg.includes('etiquette') || lastMsg.includes('custom') || lastMsg.includes('dress') || lastMsg.includes('respect')) {
      return `When exploring ${destination.name}, remember to dress respectfully at historical and religious sites. In our culture, it is customary to show humility. Don't hesitate to ask locals for guidance—they will appreciate your respect for their culture!`;
    }
    if (lastMsg.includes('hidden') || lastMsg.includes('gem') || lastMsg.includes('crowd')) {
      const gem = destination.attractions.find(a => a.is_hidden_gem);
      return `If you want to escape the crowded tourist hubs, I highly recommend checking out ${gem?.name || 'under-the-radar spots'}. It's a wonderful place to feel the true local pace and experience history in a quiet, personal way.`;
    }

    return `That is a wonderful question about ${destination.name}! The blend of heritage and everyday lifestyle here is unique. Is there a specific aspect of our customs, historical landmarks, or local workshops you would like to know more about?`;
  }

  const systemInstruction = `You are ${guide.name}, a virtual local travel guide with the title: "${guide.title}". 
You speak in a warm, welcoming, and helpful tone representing the culture of ${destination.name}, ${destination.country}.
Your knowledge is deep regarding local etiquette, history, language basics, cuisine, and off-the-beaten-path locations.
Never break character. Keep responses relatively short, conversational, and user-friendly (around 100-150 words).`;

  // Format message history for Gemini API (User & Model role mapping)
  const historyText = messages.map(m => `${m.sender === 'user' ? 'User' : guide.name}: ${m.text}`).join('\n');
  const prompt = `${historyText}\n${guide.name}:`;

  try {
    return await callGeminiAPI(customApiKey, prompt, systemInstruction);
  } catch (error) {
    console.error('Gemini Chat Guide API Error:', error);
    return `Apologies, I encountered an issue connecting to my cultural databases. Let me answer as best as I can: ${guide.name} welcomes you to ask about our food, customs, or hidden gems!`;
  }
};
