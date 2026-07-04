import axios from 'axios';
import { MOCK_DESTINATIONS } from './mockData';

const MOCK_IMAGE_MAP = {
  // Kyoto
  "kinkaku-ji": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
  "fushimi inari": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
  "gio-ji": "https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80",
  "otagi": "https://images.unsplash.com/photo-1605319089034-7c6080b4c3c2?w=800&auto=format&fit=crop&q=80",
  "nishiki": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=80",
  "gion karyo": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
  // Rome
  "colosseum": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=80",
  "pantheon": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
  "san clemente": "https://images.unsplash.com/photo-1542820229-081e55577f4e?w=800&auto=format&fit=crop&q=80",
  "pyramid": "https://images.unsplash.com/photo-1568289463675-15a3a1fcf15a?w=800&auto=format&fit=crop&q=80",
  "bonci": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
  "da enzo": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
  // Cairo
  "pyramid": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&auto=format&fit=crop&q=80",
  "khan el-khalili": "https://images.unsplash.com/photo-1629721671030-a83d88e15c44?w=800&auto=format&fit=crop&q=80",
  "mosque of ibn tulun": "https://images.unsplash.com/photo-1572019999435-081d4511ef5e?w=800&auto=format&fit=crop&q=80",
  "garbage city": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80",
  "koshary abou tarek": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
  "felfela": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80",
  // Cusco
  "machu picchu": "https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=800&auto=format&fit=crop&q=80",
  "sacsayhuaman": "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80",
  "san pedro market": "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&auto=format&fit=crop&q=80",
  "planetarium cusco": "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=80",
  "chicha": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
  "pachapapa": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
  // New York City
  "metropolitan museum": "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop&q=80",
  "empire state": "https://images.unsplash.com/photo-1522083165195-342750297f05?w=800&auto=format&fit=crop&q=80",
  "the high line": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&auto=format&fit=crop&q=80",
  "green-wood cemetery": "https://images.unsplash.com/photo-1528184039930-bc0a1a5638a0?w=800&auto=format&fit=crop&q=80",
  "katz": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&auto=format&fit=crop&q=80",
  "balthazar": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
};

export const resolveImage = (name, category) => {
  const cleanName = name.toLowerCase();
  for (const [key, value] of Object.entries(MOCK_IMAGE_MAP)) {
    if (cleanName.includes(key)) {
      return value;
    }
  }
  // Category fallbacks
  if (category === 'Culinary & Dining') {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80";
  }
  if (category === 'Hidden Gems') {
    return "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80";
};

export const getFoursquarePlaces = async (cityId) => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocal) {
    try {
      console.log(`[Foursquare] Querying local proxy backend for cityId: ${cityId}`);
      const response = await axios.get(`/api/places?cityId=${cityId}`);
      return response.data;
    } catch (err) {
      console.warn("[Foursquare] Local proxy failed or offline:", err.message);
    }
  }

  console.log(`[Foursquare] Falling back to mock data for: ${cityId}`);
  let rawPlaces = MOCK_DESTINATIONS[cityId]?.attractions || [];
  
  // Augment places with beautiful images and 1-line AI vibe descriptions
  return rawPlaces.map((p) => {
    const imageUrl = p.imageUrl || resolveImage(p.name, p.category);
    
    let vibeDescription = p.vibeDescription;
    if (!vibeDescription) {
      if (p.category === 'Hidden Gems') {
        vibeDescription = `A tucked-away sanctuary radiating quiet mystery and authentic local character.`;
      } else if (p.category === 'Culinary & Dining') {
        vibeDescription = `A sensory culinary trip offering traditional, intense flavors beloved by local families.`;
      } else {
        vibeDescription = `A storied historical monument reflecting the deep, structural heritage of the location.`;
      }
    }

    return {
      ...p,
      imageUrl,
      vibeDescription
    };
  });
};
