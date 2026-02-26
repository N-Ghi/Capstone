import React, { useEffect, useRef, useState } from 'react';
import styles from './Map.module.css';
import { LocationIcon } from '../common/Icons';

interface Props {
  lat: number;
  lng: number;
  label: string;
}

const MapPin: React.FC<Props> = ({ lat, lng, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) { setFailed(true); return; }

    const init = () => {
      if (!ref.current) return;
      const map = new (window as any).google.maps.Map(ref.current, {
        center: { lat, lng },
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          { elementType: 'geometry', stylers: [{ color: '#f5f2ef' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#2B4150' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4e5d7' }] },
        ],
      });
      new (window as any).google.maps.Marker({
        position: { lat, lng },
        map,
        title: label,
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#627F67',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2.5,
        },
      });
      setLoaded(true);
    };

    const scriptId = 'google-maps-script';

    if ((window as any).google?.maps) {
      init();
      return;
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = init;
      script.onerror = () => setFailed(true);
      document.head.appendChild(script);
    } else {
      const poll = setInterval(() => {
        if ((window as any).google?.maps) { clearInterval(poll); init(); }
      }, 100);
    }
  }, [lat, lng, label]);

  if (failed) {
    return (
      <div className={styles.mapFallback}>
       <LocationIcon size={24} className={styles.fallbackIcon} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className={styles.mapWrap}>
      {!loaded && <div className={styles.mapSkeleton} />}
      <div ref={ref} className={styles.map} />
    </div>
  );
};

export default MapPin;