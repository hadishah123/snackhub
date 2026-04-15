import { useState } from "react";
import { LocationContext } from "./LocationContext";

export const LocationProvider = ({ children }) => {
  // ✅ Load from localStorage on first render
  const savedLocation = localStorage.getItem("userLocationCoords");

  const [location, setLocation] = useState(
    savedLocation ? JSON.parse(savedLocation) : null
  );

  const [locationEnabled, setLocationEnabled] = useState(
    !!savedLocation
  );

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        localStorage.setItem(
          "userLocationCoords",
          JSON.stringify(coords)
        );

        setLocation(coords);
        setLocationEnabled(true);
      },
      () => {
        alert("Please enable location to continue");
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