import React, { useState, useEffect } from "react";
import styles from "../../styles.module.css";

import { useRecoilValue } from "recoil";
import { selectedMapState } from "../../recoil/mapAtom";

interface MapViewerProps {
  mode: "2D" | "3D";
}

const MapViewer: React.FC<MapViewerProps> = ({ mode }) => {
  const [imageId, setImageId] = useState<string | null>(null);
  const selectedMap = useRecoilValue(selectedMapState);

  useEffect(() => {
    if (selectedMap) {
      const port = mode === "2D" ? 8001 : 8002;

      fetch(`http://localhost:${port}/api/mapinfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          map_num: selectedMap.map_num,
          map_type: selectedMap.map_type,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setImageId(data.image_id);
          console.log(`[${mode}] image_id:`, data.image_id);
        })
        .catch((err) => {
          console.error(`API 요청 실패(port ${port}):`, err);
          setImageId(null);
        });
    }
  }, [selectedMap, mode]);

  return (
    <div className={styles.mapContainer}>
      {mode === "2D" ? (
        <div className={styles.mapBox}>
          {imageId ? (
            <img
              src={`http://localhost:8001/image/${imageId}`}
              alt="2D Map"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <p>Loading 2D map...</p>
          )}
        </div>
      ) : (
        <div className={styles.mapCanvas}>
          {imageId ? (
            <p>3D image ID: {imageId}</p>
          ) : (
            <p>Loading 3D map...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapViewer;
