import { useEffect, useState } from "react";

// ─── Daftar kota Indonesia yang ada di database ────────────
const CITIES = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
  { name: "Medan", lat: 3.5952, lng: 98.6722 },
  { name: "Semarang", lat: -6.9932, lng: 110.4203 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
  { name: "Palembang", lat: -2.9761, lng: 104.7754 },
  { name: "Tangerang", lat: -6.1781, lng: 106.6297 },
  { name: "Depok", lat: -6.4025, lng: 106.7942 },
  { name: "Bekasi", lat: -6.2349, lng: 106.9896 },
  { name: "Bogor", lat: -6.5971, lng: 106.8060 },
  { name: "Bali", lat: -8.3405, lng: 115.0920 },
  { name: "Balikpapan", lat: -1.2654, lng: 116.8313 },
];

// ─── Formula Haversine ─────────────────────────────────────
// Hitung jarak (km) antara dua titik koordinat di bumi
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // radius bumi dalam km
  const toRad = (deg: number) => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // jarak dalam km
}

// ─── Cari kota terdekat dari koordinat user ────────────────
function getNearestCity(userLat: number, userLng: number): string {
  let nearest = CITIES[0];
  let minDist = haversine(userLat, userLng, nearest.lat, nearest.lng);

  for (const city of CITIES) {
    const dist = haversine(userLat, userLng, city.lat, city.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  return nearest.name;
}

// ─── Hook ──────────────────────────────────────────────────

interface GeolocationState {
  city: string | null;
  isLoading: boolean;
  isGranted: boolean;
  isDenied: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    city: null,
    isLoading: false,
    isGranted: false,
    isDenied: false,
    error: null,
  });

  const fetchPosition = () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Haversine — cari kota terdekat dari koordinat user
        const city = getNearestCity(latitude, longitude);

        setState({
          city,
          isLoading: false,
          isGranted: true,
          isDenied: false,
          error: null,
        });
      },
      (err) => {
        setState({
          city: null,
          isLoading: false,
          isGranted: false,
          isDenied: err.code === err.PERMISSION_DENIED,
          error: err.message,
        });
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, isDenied: true, error: "Geolocation is not supported by your browser." }));
      return;
    }

    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          setState((s) => ({ ...s, isDenied: true, isLoading: false, error: "Location access denied. Please enable it in browser settings." }));
          return;
        }
        fetchPosition();
      });
    } else {
      fetchPosition();
    }
  };

  // Auto-request on mount
  useEffect(() => {
    if (!navigator.geolocation) return;

    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
          fetchPosition();
        }
        if (result.state === "denied") {
          setState((s) => ({ ...s, isDenied: true }));
        }

        result.onchange = () => {
          if (result.state === "granted") fetchPosition();
          if (result.state === "denied") {
            setState((s) => ({ ...s, isDenied: true, isGranted: false, city: null }));
          }
        };
      });
    } else {
      fetchPosition();
    }
  }, []);

  return { ...state, requestLocation };
}