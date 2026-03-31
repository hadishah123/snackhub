import { useState } from 'react';
import { LocationContext } from './LocationContext';

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationEnabled(true);
      },
      () => {
        alert('Please enable location to continue');
        setLocationEnabled(false);
      }
    );
  };

  return (
    <LocationContext.Provider
      value={{ location, locationEnabled, getLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};