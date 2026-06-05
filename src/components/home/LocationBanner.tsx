import { MapPin } from "lucide-react";

interface LocationBannerProps {
  city: string | null;
  isLoading: boolean;
  isDenied: boolean;
  requestLocation: () => void;
}

function LocationBanner({ city, isLoading, isDenied, requestLocation }: LocationBannerProps) {
  if (isLoading) return (
    <div className="loc-banner">
      <div className="loc-banner-dot loading" />
      <span>Detecting your location...</span>
    </div>
  );

  if (city) return (
    <div className="loc-banner">
      <div className="loc-banner-dot granted" />
      <span>Showing jobs near <strong>{city}</strong></span>
    </div>
  );

  if (isDenied) return (
    <div className="loc-banner denied">
      <MapPin size={14} />
      <span>Location blocked. Enable in browser settings then refresh.</span>
    </div>
  );

  return (
    <div className="loc-banner">
      <MapPin size={14} />
      <span>Allow location for nearby jobs</span>
      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={requestLocation}>
        Enable
      </button>
    </div>
  );
}

export default LocationBanner;