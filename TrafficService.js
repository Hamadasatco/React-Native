import axios from 'axios';

// Traffic API service for enhanced bus tracking
class TrafficService {
  constructor() {
    // API configuration - would use environment variables in production
    this.apiKey = 'YOUR_TRAFFIC_API_KEY';
    this.baseUrl = 'https://api.example.com/traffic'; // Replace with actual traffic API endpoint
  }

  /**
   * Get traffic information along a route
   * @param {Object} origin - Origin coordinates {latitude, longitude}
   * @param {Object} destination - Destination coordinates {latitude, longitude}
   * @param {Array} waypoints - Optional waypoints along the route
   * @returns {Promise} - Traffic data along the route
   */
  async getTrafficAlongRoute(origin, destination, waypoints = []) {
    try {
      const response = await axios.get(`${this.baseUrl}/route`, {
        params: {
          key: this.apiKey,
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          waypoints: waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|'),
          traffic_model: 'best_guess'
        }
      });
      
      return this.processTrafficData(response.data);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      throw new Error('Failed to fetch traffic information');
    }
  }

  /**
   * Get traffic incidents near a location
   * @param {Object} location - Location coordinates {latitude, longitude}
   * @param {Number} radius - Search radius in meters
   * @returns {Promise} - Traffic incidents in the area
   */
  async getTrafficIncidents(location, radius = 5000) {
    try {
      const response = await axios.get(`${this.baseUrl}/incidents`, {
        params: {
          key: this.apiKey,
          location: `${location.latitude},${location.longitude}`,
          radius
        }
      });
      
      return this.processIncidentData(response.data);
    } catch (error) {
      console.error('Error fetching traffic incidents:', error);
      throw new Error('Failed to fetch traffic incidents');
    }
  }

  /**
   * Calculate ETA with traffic considerations
   * @param {Object} origin - Origin coordinates {latitude, longitude}
   * @param {Object} destination - Destination coordinates {latitude, longitude}
   * @param {String} departureTime - Departure time (default: now)
   * @returns {Promise} - ETA information
   */
  async calculateETA(origin, destination, departureTime = 'now') {
    try {
      const response = await axios.get(`${this.baseUrl}/eta`, {
        params: {
          key: this.apiKey,
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          departure_time: departureTime,
          traffic_model: 'best_guess'
        }
      });
      
      return {
        duration: response.data.duration,
        durationInTraffic: response.data.duration_in_traffic,
        distance: response.data.distance,
        arrivalTime: response.data.arrival_time
      };
    } catch (error) {
      console.error('Error calculating ETA:', error);
      throw new Error('Failed to calculate ETA');
    }
  }

  /**
   * Get alternative routes considering traffic
   * @param {Object} origin - Origin coordinates {latitude, longitude}
   * @param {Object} destination - Destination coordinates {latitude, longitude}
   * @returns {Promise} - Alternative routes
   */
  async getAlternativeRoutes(origin, destination) {
    try {
      const response = await axios.get(`${this.baseUrl}/routes`, {
        params: {
          key: this.apiKey,
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          alternatives: true,
          traffic_model: 'best_guess'
        }
      });
      
      return response.data.routes.map(route => ({
        distance: route.distance,
        duration: route.duration,
        durationInTraffic: route.duration_in_traffic,
        polyline: route.overview_polyline,
        summary: route.summary
      }));
    } catch (error) {
      console.error('Error fetching alternative routes:', error);
      throw new Error('Failed to fetch alternative routes');
    }
  }

  /**
   * Process raw traffic data into app-friendly format
   * @param {Object} data - Raw traffic data from API
   * @returns {Object} - Processed traffic data
   */
  processTrafficData(data) {
    // Process and transform the raw API data into a format suitable for the app
    // This would depend on the specific API being used
    return {
      congestionLevel: this.calculateCongestionLevel(data),
      speedFactor: data.speed_factor || 1.0,
      trafficSegments: this.extractTrafficSegments(data),
      delayMinutes: this.calculateDelay(data)
    };
  }

  /**
   * Process raw incident data into app-friendly format
   * @param {Object} data - Raw incident data from API
   * @returns {Array} - Processed incident data
   */
  processIncidentData(data) {
    // Transform incident data into a format suitable for display
    return (data.incidents || []).map(incident => ({
      id: incident.id,
      type: incident.type,
      severity: incident.severity,
      description: incident.description,
      location: {
        latitude: incident.latitude,
        longitude: incident.longitude
      },
      startTime: incident.start_time,
      endTime: incident.end_time
    }));
  }

  /**
   * Calculate congestion level from traffic data
   * @param {Object} data - Traffic data
   * @returns {String} - Congestion level (low, moderate, high, severe)
   */
  calculateCongestionLevel(data) {
    const speedFactor = data.speed_factor || 1.0;
    
    if (speedFactor > 0.8) return 'low';
    if (speedFactor > 0.6) return 'moderate';
    if (speedFactor > 0.3) return 'high';
    return 'severe';
  }

  /**
   * Extract traffic segments from data
   * @param {Object} data - Traffic data
   * @returns {Array} - Traffic segments with congestion info
   */
  extractTrafficSegments(data) {
    // Extract traffic segments from the data
    // This would depend on the specific API being used
    return (data.segments || []).map(segment => ({
      startPoint: segment.start_point,
      endPoint: segment.end_point,
      congestionLevel: segment.congestion_level,
      speedKmh: segment.speed_kmh
    }));
  }

  /**
   * Calculate delay in minutes from traffic data
   * @param {Object} data - Traffic data
   * @returns {Number} - Delay in minutes
   */
  calculateDelay(data) {
    // Calculate delay based on normal duration vs. duration in traffic
    const normalDuration = data.duration || 0;
    const trafficDuration = data.duration_in_traffic || normalDuration;
    
    return Math.round((trafficDuration - normalDuration) / 60);
  }
}

export default new TrafficService();
