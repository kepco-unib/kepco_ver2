import React, { useState, useEffect } from "react";
import styles from "../../styles.module.css";

interface MapViewerProps {
  mode: "2D" | "3D";
}

const MapViewer: React.FC<MapViewerProps> = ({ mode }) => {
  const [mapImage, setMapImage] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "2D") {
      // 예시 API 호출 - 실제 API 주소와 맞게 바꾸세요
      fetch("/api/get-map-image")
        .then((res) => res.json())
        .then((data) => {
          // data.imageUrl 이 이미지 경로나 base64 스트링이라 가정
          setMapImage(data.imageUrl);
        })
        .catch((err) => {
          console.error("Failed to load map image:", err);
        });
    }
  }, [mode]);

  return (
    <div className={styles.mapContainer}>
      {mode === "2D" ? (
        <div className={styles.mapBox}>
          {mapImage ? (
            <img
              src={mapImage}
              alt="2D Map"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      ) : (
        <div className={styles.mapCanvas}></div>
      )}
    </div>
  );
};

export default MapViewer;
