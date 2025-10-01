// Google Maps utility functions

export interface GoogleMapsStatus {
  isLoaded: boolean;
  hasAdvancedMarkers: boolean;
  hasBilling: boolean;
  error?: string;
}

export const checkGoogleMapsStatus = (): GoogleMapsStatus => {
  const status: GoogleMapsStatus = {
    isLoaded: false,
    hasAdvancedMarkers: false,
    hasBilling: false
  };

  // Check if Google Maps is loaded
  if (typeof window !== 'undefined' && window.google && window.google.maps) {
    status.isLoaded = true;

    // Check if AdvancedMarkerElement is available
    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
      status.hasAdvancedMarkers = true;
    }

    // Billing status is harder to detect directly, but we can make some assumptions
    // If we can create a map without errors, billing is likely enabled
    try {
      const testDiv = document.createElement('div');
      const testMap = new window.google.maps.Map(testDiv, {
        zoom: 10,
        center: { lat: 0, lng: 0 }
      });
      if (testMap) {
        status.hasBilling = true;
      }
    } catch (error) {
      status.error = error instanceof Error ? error.message : 'Unknown error';
      status.hasBilling = false;
    }
  }

  return status;
};

export const getGoogleMapsLoadingScript = (apiKey: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,marker&loading=async`;
  script.async = true;
  script.defer = true;
  return script;
};

export const isGoogleMapsError = (error: any): boolean => {
  if (!error) return false;
  
  const errorString = error.toString().toLowerCase();
  return (
    errorString.includes('billingnotenabledmaperror') ||
    errorString.includes('apinotactivatedmaperror') ||
    errorString.includes('invalidkeymaperror') ||
    errorString.includes('referrernotallowedmaperror') ||
    errorString.includes('billing') ||
    errorString.includes('quota') ||
    errorString.includes('api key') ||
    errorString.includes('styles property cannot be set when a mapid is present')
  );
};

export const getGoogleMapsErrorMessage = (error: any): string => {
  if (!error) return 'Unknown error';
  
  const errorString = error.toString().toLowerCase();
  
  if (errorString.includes('billingnotenabledmaperror') || errorString.includes('billing')) {
    return 'Google Maps billing is not enabled. Please enable billing in the Google Cloud Console.';
  }
  
  if (errorString.includes('apinotactivatedmaperror')) {
    return 'Google Maps API is not activated. Please enable the Maps JavaScript API in the Google Cloud Console.';
  }
  
  if (errorString.includes('invalidkeymaperror') || errorString.includes('api key')) {
    return 'Invalid Google Maps API key. Please check your API key configuration.';
  }
  
  if (errorString.includes('referrernotallowedmaperror')) {
    return 'This domain is not authorized for the Google Maps API key. Please add this domain to the API key restrictions.';
  }
  
  if (errorString.includes('styles property cannot be set when a mapid is present')) {
    return 'Map configuration error: Cannot use both styles and mapId. Using default styling.';
  }
  
  if (errorString.includes('quota')) {
    return 'Google Maps API quota exceeded. Please check your usage limits.';
  }
  
  return 'Google Maps failed to load. Please try again or contact support.';
};

// Constants
export const GOOGLE_MAPS_CONFIG = {
  DEFAULT_CENTER: { lat: 20.5937, lng: 78.9629 }, // India center
  DEFAULT_ZOOM: 5,
  PLANTATION_ZOOM: 12,
  MAP_STYLES: [
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    }
  ]
};

export const MARKER_COLORS = {
  HIGH: '#22c55e',    // green
  MEDIUM: '#eab308',  // yellow
  LOW: '#ef4444',     // red
  DEFAULT: '#3b82f6'  // blue
};