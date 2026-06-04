import { useEffect, useState } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  isLoading: boolean;
  isGranted: boolean;
  isDenied: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    city: null,
    isLoading: false,
    isGranted: false,
    isDenied: false,
    error: null,
  });

  const fetchPosition = () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "id" } }
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state ||
            null;

          setState({ latitude, longitude, city, isLoading: false, isGranted: true, isDenied: false, error: null });
        } catch {
          setState({ latitude, longitude, city: null, isLoading: false, isGranted: true, isDenied: false, error: null });
        }
      },
      (err) => {
        setState({ latitude: null, longitude: null, city: null, isLoading: false, isGranted: false, isDenied: err.code === err.PERMISSION_DENIED, error: err.message });
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, isDenied: true, error: "Geolocation is not supported by your browser." }));
      return;
    }

    // Cek permission state dulu sebelum request
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

  // Auto-request on mount — cek permission dulu
  useEffect(() => {
    if (!navigator.geolocation) return;

    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          // Sudah di-allow sebelumnya, langsung fetch
          fetchPosition();
        } else if (result.state === "prompt") {
          // Belum pernah diminta, request sekarang
          fetchPosition();
        }
        // Kalau "denied", tidak auto-request — tunggu user klik Enable
        if (result.state === "denied") {
          setState((s) => ({ ...s, isDenied: true }));
        }

        // Listen perubahan permission (misal user ubah di settings)
        result.onchange = () => {
          if (result.state === "granted") fetchPosition();
          if (result.state === "denied") setState((s) => ({ ...s, isDenied: true, isGranted: false, city: null }));
        };
      });
    } else {
      fetchPosition();
    }
  }, []);

  return { ...state, requestLocation };
}