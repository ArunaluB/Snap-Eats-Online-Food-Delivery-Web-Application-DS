// // utils/routeService.ts

// /**
//  * Fetches directions between two points using Mapbox Directions API
//  * @param startLng - Starting longitude
//  * @param startLat - Starting latitude
//  * @param endLng - Ending longitude
//  * @param endLat - Ending latitude
//  * @param mapboxToken - Mapbox access token 
//  * @returns GeoJSON LineString feature representing the route
//  */
// export const getDirections = async (
//     startLng: number,
//     startLat: number,
//     endLng: number,
//     endLat: number,
//     mapboxToken: string
//   ): Promise<GeoJSON.Feature<GeoJSON.LineString> | null> => {
//     try {
//       const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?steps=true&geometries=geojson&access_token=${mapboxToken}`;
      
//       const response = await fetch(url);
//       const data = await response.json();
  
//       if (data.routes && data.routes.length > 0) {
//         return {
//           type: 'Feature',
//           properties: {},
//           geometry: {
//             type: 'LineString',
//             coordinates: data.routes[0].geometry.coordinates
//           }
//         };
//       }
//       throw new Error('No routes found');
//     } catch (error) {
//       console.error('Error fetching directions:', error);
//       return null;
//     }
//   };
  
//   /**
//    * Calculates estimated travel time between two points
//    * @param startLng - Starting longitude 
//    * @param startLat - Starting latitude
//    * @param endLng - Ending longitude
//    * @param endLat - Ending latitude
//    * @param mapboxToken - Mapbox access token
//    * @returns Estimated travel time in minutes
//    */
//   export const getEstimatedTravelTime = async (
//     startLng: number,
//     startLat: number,
//     endLng: number,
//     endLat: number,
//     mapboxToken: string
//   ): Promise<number | null> => {
//     try {
//       const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${mapboxToken}`;
      
//       const response = await fetch(url);
//       const data = await response.json();
  
//       if (data.routes && data.routes.length > 0) {
//         // Return duration in minutes
//         return Math.round(data.routes[0].duration / 60);
//       }
//       throw new Error('No routes found');
//     } catch (error) {
//       console.error('Error fetching travel time:', error);
//       return null;
//     }
//   };
import { Feature, LineString } from 'geojson';

/**
 * Fetches directions between two points using Mapbox Directions API
 * @param {number} startLng - Starting longitude
 * @param {number} startLat - Starting latitude
 * @param {number} endLng - Ending longitude
 * @param {number} endLat - Ending latitude
 * @param {string} mapboxToken - Mapbox access token 
 * @returns {Promise<Feature<LineString> | null>} - GeoJSON LineString feature representing the route
 */
// export const getDirections = async (
//   startLng: number, 
//   startLat: number, 
//   endLng: number, 
//   endLat: number, 
//   mapboxToken: string
// ): Promise<Feature<LineString> | null> => {
//   try {
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?steps=true&geometries=geojson&access_token=${mapboxToken}`;
    
//     const response = await fetch(url);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     if (data.routes && data.routes.length > 0) {
//       return {
//         type: 'Feature',
//         properties: {},
//         geometry: {
//           type: 'LineString',
//           coordinates: data.routes[0].geometry.coordinates
//         }
//       };
//     }
//     throw new Error('No routes found');
//   } catch (error) {
//     console.error('Error fetching directions:', error);
//     return null;
//   }
// };

/**
 * Calculates estimated travel time between two points
 * @param {number} startLng - Starting longitude 
 * @param {number} startLat - Starting latitude
 * @param {number} endLng - Ending longitude
 * @param {number} endLat - Ending latitude
 * @param {string} mapboxToken - Mapbox access token
 * @returns {Promise<number | null>} - Estimated travel time in minutes
 */
// export const getEstimatedTravelTime = async (
//   startLng: number, 
//   startLat: number, 
//   endLng: number, 
//   endLat: number, 
//   mapboxToken: string
// ): Promise<number | null> => {
//   try {
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${mapboxToken}`;
    
//     const response = await fetch(url);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     if (data.routes && data.routes.length > 0) {
//       // Return duration in minutes
//       return Math.round(data.routes[0].duration / 60);
//     }
//     throw new Error('No routes found');
//   } catch (error) {
//     console.error('Error fetching travel time:', error);
//     return null;
//   }
// };

/**
 * Calculates the distance between two points
 * @param {number} startLng - Starting longitude 
 * @param {number} startLat - Starting latitude
 * @param {number} endLng - Ending longitude
 * @param {number} endLat - Ending latitude
 * @param {string} mapboxToken - Mapbox access token
 * @returns {Promise<number | null>} - Distance in kilometers
 */
// export const getDistance = async (
//   startLng: number, 
//   startLat: number, 
//   endLng: number, 
//   endLat: number, 
//   mapboxToken: string
// ): Promise<number | null> => {
//   try {
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${mapboxToken}`;
    
//     const response = await fetch(url);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     if (data.routes && data.routes.length > 0) {
//       // Return distance in kilometers
//       return data.routes[0].distance / 1000;
//     }
//     throw new Error('No routes found');
//   } catch (error) {
//     console.error('Error fetching distance:', error);
//     return null;
//   }
// };



export type TurnInstruction = {
  text: string;
  distance: number;
  maneuver: string;
  duration?: number;
};

/**
 * Fetches directions between two points using Mapbox Directions API with turn-by-turn instructions
 * @param {number} startLng - Starting longitude
 * @param {number} startLat - Starting latitude
 * @param {number} endLng - Ending longitude
 * @param {number} endLat - Ending latitude
 * @param {string} mapboxToken - Mapbox access token 
 * @returns {Promise<{route: Feature<LineString> | null, instructions: TurnInstruction[]}>} - GeoJSON LineString feature and turn instructions
 */
export const getDirectionsWithInstructions = async (
  startLng: number, 
  startLat: number, 
  endLng: number, 
  endLat: number, 
  mapboxToken: string
): Promise<{route: Feature<LineString> | null, instructions: TurnInstruction[]}> => {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?steps=true&geometries=geojson&language=en&overview=full&access_token=${mapboxToken}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      // Extract turn-by-turn instructions
      const instructions: TurnInstruction[] = [];
      
      if (data.routes[0].legs && data.routes[0].legs.length > 0) {
        data.routes[0].legs.forEach((leg: { steps: any[]; }) => {
          if (leg.steps && leg.steps.length > 0) {
            leg.steps.forEach(step => {
              instructions.push({
                text: step.maneuver.instruction,
                distance: step.distance / 1000, // Convert to kilometers
                maneuver: step.maneuver.type,
                duration: step.duration / 60 // Convert to minutes
              });
            });
          }
        });
      }
      
      return {
        route: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: data.routes[0].geometry.coordinates
          }
        },
        instructions
      };
    }
    throw new Error('No routes found');
  } catch (error) {
    console.error('Error fetching directions:', error);
    return { route: null, instructions: [] };
  }
};

/**
 * Fetches directions between two points using Mapbox Directions API
 * @param {number} startLng - Starting longitude
 * @param {number} startLat - Starting latitude
 * @param {number} endLng - Ending longitude
 * @param {number} endLat - Ending latitude
 * @param {string} mapboxToken - Mapbox access token 
 * @returns {Promise<Feature<LineString> | null>} - GeoJSON LineString feature representing the route
 */
export const getDirections = async (
  startLng: number, 
  startLat: number, 
  endLng: number, 
  endLat: number, 
  mapboxToken: string
): Promise<Feature<LineString> | null> => {
  try {
    const { route } = await getDirectionsWithInstructions(startLng, startLat, endLng, endLat, mapboxToken);
    return route;
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
};

/**
 * Calculates estimated travel time between two points
 * @param {number} startLng - Starting longitude 
 * @param {number} startLat - Starting latitude
 * @param {number} endLng - Ending longitude
 * @param {number} endLat - Ending latitude
 * @param {string} mapboxToken - Mapbox access token
 * @returns {Promise<number | null>} - Estimated travel time in minutes
 */
export const getEstimatedTravelTime = async (
  startLng: number, 
  startLat: number, 
  endLng: number, 
  endLat: number, 
  mapboxToken: string
): Promise<number | null> => {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${mapboxToken}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      // Return duration in minutes
      return Math.round(data.routes[0].duration / 60);
    }
    throw new Error('No routes found');
  } catch (error) {
    console.error('Error fetching travel time:', error);
    return null;
  }
};

/**
 * Calculates the distance between two points
 * @param {number} startLng - Starting longitude 
 * @param {number} startLat - Starting latitude
 * @param {number} endLng - Ending longitude
 * @param {number} endLat - Ending latitude
 * @param {string} mapboxToken - Mapbox access token
 * @returns {Promise<number | null>} - Distance in kilometers
 */
export const getDistance = async (
  startLng: number, 
  startLat: number, 
  endLng: number, 
  endLat: number, 
  mapboxToken: string
): Promise<number | null> => {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?access_token=${mapboxToken}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      // Return distance in kilometers
      return data.routes[0].distance / 1000;
    }
    throw new Error('No routes found');
  } catch (error) {
    console.error('Error fetching distance:', error);
    return null;
  }
};
