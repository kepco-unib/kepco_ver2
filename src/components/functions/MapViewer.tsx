import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles.module.css";
import { useRecoilValue } from "recoil";
import { selectedMapState } from "../../recoil/mapAtom";

interface MapViewerProps {
  mode: "2D" | "3D";
  clickMode: "start" | "goal" | null;
}

const MapViewer: React.FC<MapViewerProps> = ({ mode, clickMode }) => {
  const [imageId, setImageId] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<any>(null);
  const selectedMap = useRecoilValue(selectedMapState);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (selectedMap) {
      const port = mode === "2D" ? 8001 : 8002;

      // 1) 이미지 ID 요청
      fetch(`http://192.168.0.15:${port}/api/mapinfo`, {
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

      // 2) 메타데이터 요청
      if (mode === "2D") {
        fetch(`http://14.35.77.86:8000/image-meta/${selectedMap.map_name}`)
          .then((res) => {
            if (!res.ok) throw new Error("메타데이터를 불러올 수 없습니다.");
            return res.json();
          })
          .then((data) => {
            setMetaData(data);
            console.log("[2D] map meta data:", data);
          })
          .catch((err) => {
            console.error("메타데이터 요청 실패:", err);
            setMetaData(null);
          });
      } else {
        setMetaData(null);
      }
    }
  }, [selectedMap, mode]);

  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!clickMode) return;
    const rect = (e.target as HTMLImageElement).getBoundingClientRect();
    const x = (e.clientX - rect.left - position.x) / scale;
    const y = (e.clientY - rect.top - position.y) / scale;

    if (metaData) {
      const originX = metaData.origin?.[0] ?? 0;
      const originY = metaData.origin?.[1] ?? 0;
      const resolution = metaData.resolution ?? 1;

      const realX = originX + x * resolution;
      const realY = originY + y * resolution;

      console.log(`[${clickMode === "start" ? "시작" : "목표"} 위치] 실제 좌표:`, { realX, realY });
      alert(`${clickMode === "start" ? "시작" : "목표"} 위치 실제 좌표: (${realX.toFixed(3)}, ${realY.toFixed(3)}) 가 지정되었습니다.`);
    } else {
      console.log(`[${clickMode === "start" ? "시작" : "목표"} 위치] 좌표:`, { x, y });
      alert(`${clickMode === "start" ? "시작" : "목표"} 위치 좌표: (${Math.round(x)}, ${Math.round(y)}) 가 지정되었습니다.`);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 3);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={styles.mapContainer}>
      {mode === "2D" ? (
        <div
          className={styles.mapBox}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            overflow: "hidden",
            position: "relative",
            cursor: isDragging ? "grabbing" : clickMode ? "crosshair" : "grab",
          }}
        >
          {selectedMap?.map_name ? (
            <>
              <img
                ref={imageRef}
                src={`http://192.168.0.15:8001/image/${selectedMap.map_name}`}
                alt="2D Map"
                onClick={handleClick}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "top left",
                  userSelect: "none",
                  pointerEvents: "auto",
                }}
                draggable={false}
              />
              {metaData && (
                <pre
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    padding: "5px",
                    borderRadius: "4px",
                    maxWidth: "300px",
                    overflow: "auto",
                    fontSize: "12px",
                    userSelect: "text",
                    pointerEvents: "none",
                  }}
                >
                  {JSON.stringify(metaData, null, 2)}
                </pre>
              )}
            </>
          ) : (
            <p>Loading 2D map...</p>
          )}
        </div>
      ) : (
        <div className={styles.mapCanvas}>
          {imageId ? <p>3D image ID: {imageId}</p> : <p>Loading 3D map...</p>}
        </div>
      )}
    </div>
  );
};

export default MapViewer;
