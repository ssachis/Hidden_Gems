import axios from 'axios';
import { MOCK_DESTINATIONS } from './mockData';


// Generate an immersive historical and cultural story
export const generateStory = async (cityId) => {
  const destination = MOCK_DESTINATIONS[cityId];
  if (!destination) return null;

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (isLocal) {
    try {
      console.log(`[Gemini] Querying local proxy backend for story of: ${cityId}`);
      const response = await axios.post('/api/story', { cityName: destination.name });
      return response.data;
    } catch (err) {
      console.warn("[Gemini] Local story proxy failed:", err.message);
    }
  }

  console.log(`[Gemini] Demo Mode: Returning static story for ${cityId}`);
  return destination.story;
};

// Generate an itinerary based on user input details
export const generateItinerary = async (cityId, duration = 3, preferences = '') => {
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
      console.warn("[Gemini] Local itinerary proxy failed:", err.message);
    }
  }

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
};

// Conversational AI Local Guide Chat
export const chatWithGuide = async (cityId, messages) => {
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
      console.warn("[Gemini] Local chat proxy failed:", err.message);
    }
  }

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
};
