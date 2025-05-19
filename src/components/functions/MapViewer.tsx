import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles.module.css";
import { useRecoilValue } from "recoil";
import { selectedMapState } from "../../recoil/mapAtom";

import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface MapViewerProps {
  mode: "2D" | "3D";
  clickMode: "start" | "goal" | null;
}

const MapViewer: React.FC<MapViewerProps> = ({ mode, clickMode }) => {
  const selectedMap = useRecoilValue(selectedMapState);

  // 2D 관련 상태
  const [metaData, setMetaData] = useState<any>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // 3D 관련 상태
  const [imageId, setImageId] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // 2D 이미지 클릭 처리
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!clickMode) return;
    const img = e.target as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (metaData) {
      const originX = metaData.origin?.[0] ?? 0;
      const originY = metaData.origin?.[1] ?? 0;
      const resolution = metaData.resolution ?? 1;
      const imageHeight = img.height;  // 이미지 픽셀 높이 가져오기

      // y 좌표 방향 반전 적용
      const realX = originX + x * resolution;
      const realY = originY + (imageHeight - y) * resolution;

      const apiUrl =
        clickMode === "start"
          ? "http://192.168.0.15:8000/start-coordinate"
          : "http://192.168.0.15:8000/goal-coordinate";

      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: realX, y: realY }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to send coordinates");
          return res.json();
        })
        .then(() => {
          alert(`${clickMode === "start" ? "시작" : "목표"} 위치가 성공적으로 지정되었습니다.`);
        })
        .catch((err) => {
          alert(`위치 지정에 실패했습니다: ${err.message}`);
        });
    }
  };

  // 2D 줌 처리
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.001), 3);
    setScale(newScale);
  };

  // 2D 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // 2D 드래그 이동
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  // 2D 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // selectedMap 또는 mode 변경 시 데이터 불러오기
  useEffect(() => {
    if (!selectedMap) return;

    if (mode === "2D") {
      // 2D 메타데이터 요청
      fetch(`http://14.35.77.86:8000/image-meta/${selectedMap.map_name}`)
        .then((res) => {
          if (!res.ok) throw new Error("메타데이터를 불러올 수 없습니다.");
          return res.json();
        })
        .then((data) => {
          setMetaData(data);
        })
        .catch(() => setMetaData(null));

      setImageId(null); // 3D 데이터 초기화
    } else if (mode === "3D") {
      // 3D imageId 요청
      const port = 8002;
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
          setMetaData(null); // 2D 메타데이터 초기화
        })
        .catch(() => {
          setImageId(null);
          setMetaData(null);
        });
    }
  }, [selectedMap, mode]);

  // 3D Three.js 렌더링
  useEffect(() => {
    if (mode !== "3D" || !imageId || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 조명 추가
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1).normalize();
    scene.add(light);

    // OrbitControls 추가
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 부드러운 제어
    controls.dampingFactor = 0.05;
    controls.minDistance = 1; // 최소 줌 거리
    controls.maxDistance = 20; // 최대 줌 거리

    // PCDLoader로 pcd 파일 로드
    const loader = new PCDLoader();
    if (selectedMap) {
      const pcdUrl = `http://14.35.77.86:8000/download/2d/${selectedMap.map_name}.pcd`;

      loader.load(
        pcdUrl,
        (points: THREE.Points) => {
          scene.add(points);
          animate();
        },
        (xhr: ProgressEvent<EventTarget>) => {
          console.log(`PCD 로딩: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`);
        },
        (error: ErrorEvent) => {
          console.error("PCD 파일 로딩 실패:", error);
        }
      );
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // OrbitControls 업데이트 필수
      renderer.render(scene, camera);
    };

    // 창 크기 변경시 리사이즈 대응
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // 클린업
    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [imageId, mode]);

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
        <div
          ref={mountRef}
          className={styles.mapCanvas}
          style={{ width: "100%", height: "100%", position: "relative" }}
        >
          {!imageId && <p>Loading 3D map...</p>}
        </div>
      )}
    </div>
  );
};

export default MapViewer;
