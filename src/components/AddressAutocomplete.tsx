"use client";

import { useEffect, useRef } from "react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onPlaceSelect: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google?: any;
    initGoogleMaps?: () => void;
  }
}

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address...",
  className = "",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    const loadGoogleMaps = () => {
      if (window.google?.maps?.places) {
        initAutocomplete();
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn("Google Maps API key not found. Address autocomplete disabled.");
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Script already loading, wait for it
        window.initGoogleMaps = initAutocomplete;
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      window.initGoogleMaps = initAutocomplete;
      document.head.appendChild(script);
    };

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      // Calgary bounding box
      const calgaryBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(50.8, -114.3), // Southwest corner
        new window.google.maps.LatLng(51.2, -113.8)  // Northeast corner
      );

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["geometry", "formatted_address"],
          types: ["address"],
          componentRestrictions: { country: "ca" }, // Restrict to Canada
          bounds: calgaryBounds, // Bias results to Calgary area
          strictBounds: true, // Enforce Calgary bounds strictly
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();

        if (!place.geometry?.location) {
          console.warn("No geometry for selected place");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || "";

        onChange(address);
        onPlaceSelect(lat, lng, address);
      });

      // Style the autocomplete dropdown
      styleAutocompleteDropdown();
    };

    const styleAutocompleteDropdown = () => {
      // Inject custom styles for Google Places dropdown
      if (!document.getElementById('google-places-styles')) {
        const style = document.createElement('style');
        style.id = 'google-places-styles';
        style.textContent = `
          .pac-container {
            background-color: #fff;
            border: 2px solid #FFD12E !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
            margin-top: 4px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow: hidden;
          }
          .pac-item {
            padding: 12px 16px !important;
            cursor: pointer;
            border-top: 1px solid #f3f4f6 !important;
            font-size: 14px;
            line-height: 1.4;
          }
          .pac-item:first-child {
            border-top: none !important;
          }
          .pac-item:hover,
          .pac-item-selected {
            background-color: #fffbee !important;
          }
          .pac-item-query {
            font-weight: 600;
            color: #111111;
          }
          .pac-matched {
            font-weight: 700;
            color: #FFD12E;
          }
          .pac-icon {
            margin-right: 12px;
          }
        `;
        document.head.appendChild(style);
      }
    };

    loadGoogleMaps();

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [onChange, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  );
}
