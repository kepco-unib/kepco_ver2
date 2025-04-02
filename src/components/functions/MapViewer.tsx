import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styles from "../../styles.module.css";

interface MapViewerProps {
  mode: "2D" | "3D";
}

const MapViewer: React.FC<MapViewerProps> = ({ mode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // 파일 경로
  const imageSrc = process.env.PUBLIC_URL + "/assets/map.png";
  const pcdSrc = process.env.PUBLIC_URL + "/assets/map.pcd";

  useEffect(() => {
    if (mode === "3D" && containerRef.current) {
      const newScene = new THREE.Scene();
      const newCamera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      const newRenderer = new THREE.WebGLRenderer({ antialias: true });

      newRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      containerRef.current.appendChild(newRenderer.domElement);

      const newControls = new OrbitControls(newCamera, newRenderer.domElement);
      newControls.enableDamping = true;
      newControls.dampingFactor = 0.05;
      newControls.screenSpacePanning = true;
      newControls.minDistance = 1;
      newControls.maxDistance = 500;

        // ✅ 카메라 회전은 막되, 마우스로 이동 가능하게 설정
        newControls.maxPolarAngle = Math.PI / 2; // 위쪽 이동 제한
        newControls.enablePan = true; // ✅ 마우스 이동 가능하도록 설정

        // ✅ 초기 카메라 위치
        newCamera.position.set(0, 10, 10);
        newCamera.lookAt(0, 0, 0);

        const light = new THREE.AmbientLight(0xffffff, 0.8);
      newScene.add(light);

      const loader = new PCDLoader();
      loader.load(
        pcdSrc,
        (points: THREE.Points) => {
          console.log("PCD 로드 성공:", points);
          points.position.set(0, 0, 0);
          points.scale.set(1, 1, 1);
          newScene.add(points);
        },
        undefined,
        (error: ErrorEvent) => console.error("PCD 로드 실패:", error)
      );

      newCamera.position.set(0, 0, 5);

      const animate = () => {
        requestAnimationFrame(animate);
        newControls.update();
        newRenderer.render(newScene, newCamera);
      };
      animate();

      setScene(newScene);
      setCamera(newCamera);
      setRenderer(newRenderer);
      setControls(newControls);

      return () => {
        newRenderer.dispose();
      };
    }
  }, [mode]);

  // ✅ 2D 줌 핸들러 (박스 크기에 맞게 유지)
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setZoom((prevZoom) => {
      let newZoom = prevZoom + event.deltaY * -0.001;
      return Math.min(Math.max(newZoom, 1), 2);
    });
  };

  // ✅ 마우스 드래그 핸들러 (줌인 상태에서 이동 가능)
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = { x: event.clientX - position.x, y: event.clientY - position.y };
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    if (mapBoxRef.current) {
      const boxWidth = mapBoxRef.current.clientWidth;
      const boxHeight = mapBoxRef.current.clientHeight;
      const maxX = (boxWidth * (zoom - 1)) / 2;
      const maxY = (boxHeight * (zoom - 1)) / 2;

      let newX = event.clientX - dragStart.current.x;
      let newY = event.clientY - dragStart.current.y;

      newX = Math.min(Math.max(newX, -maxX), maxX);
      newY = Math.min(Math.max(newY, -maxY), maxY);

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={styles.mapContainer}>
      {mode === "2D" ? (
        <div
          ref={mapBoxRef}
          className={styles.mapBox}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={imageSrc}
            alt="2D Map"
            className={styles.mapImage}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: "center",
              transition: isDragging ? "none" : "transform 0.2s",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          />
        </div>
      ) : (
        <div ref={containerRef} className={styles.mapCanvas}></div>
      )}
    </div>
  );
};

export default MapViewer;
