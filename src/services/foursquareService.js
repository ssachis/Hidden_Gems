import axios from 'axios';
import { MOCK_DESTINATIONS } from './mockData';

export const getFoursquarePlaces = async (cityId, customApiKey = null) => {
  // If no API key is provided, use mock data
  if (!customApiKey) {
    console.log(`[Foursquare] No API Key. Using mock data for: ${cityId}`);
    return MOCK_DESTINATIONS[cityId]?.attractions || [];
  }

  const destination = MOCK_DESTINATIONS[cityId];
  if (!destination) {
    throw new Error(`Unsupported destination: ${cityId}`);
  }

  try {
    // Search query around destination coordinates
    const response = await axios.get('https://api.foursquare.com/v3/places/search', {
      params: {
        near: destination.name,
        limit: 12,
        fields: 'fsq_id,name,categories,rating,stats,location,description,photos',
      },
      headers: {
        Authorization: customApiKey,
        Accept: 'application/json',
      },
    });

    // Map Foursquare response to our app structure
    const places = response.data.results.map((item) => {
      // Determine category mapping based on Foursquare category IDs
      const categoryId = item.categories?.[0]?.id || 0;
      let appCategory = 'Culture & Heritage';

      if (categoryId >= 13000 && categoryId < 14000) {
        appCategory = 'Culinary & Dining';
      } else if (categoryId >= 10000 && categoryId < 11000) {
        appCategory = 'Culture & Heritage';
      } else {
        // Distribute to hidden gems or nature based on rating and reviews
        const rating = item.rating || 8.0;
        const reviewCount = item.stats?.total_ratings || 50;
        if (rating >= 8.5 && reviewCount < 100) {
          appCategory = 'Hidden Gems';
        }
      }

      // Generate a mock photo URL since Foursquare photo API is a separate call
      // or construct it using prefix/suffix if photos array is present.
      let imageUrl = null;
      if (item.photos?.[0]) {
        const photo = item.photos[0];
        imageUrl = `${photo.prefix}original${photo.suffix}`;
      } else {
        // Fallback placeholder images
        imageUrl = `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60`;
      }

      return {
        fsq_id: item.fsq_id,
        name: item.name,
        category: appCategory,
        rating: item.rating ? (item.rating / 10).toFixed(1) : (7.5 + Math.random() * 2).toFixed(1),
        reviewCount: item.stats?.total_ratings || Math.floor(Math.random() * 400 + 10),
        description: item.description || `A highly rated local spot situated in the heart of ${destination.name}. Discover its authentic architecture and local surroundings.`,
        address: item.location?.formatted_address || item.location?.address || 'Local Street Address',
        is_hidden_gem: appCategory === 'Hidden Gems',
        imageUrl
      };
    });

    return places;
  } catch (error) {
    console.error('Foursquare API Error, falling back to mock data:', error);
    return destination.attractions;
  }
};
