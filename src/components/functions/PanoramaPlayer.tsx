import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Hls from "hls.js";

interface PanoramaPlayerProps {
  streamUrl: string;
  onClick?: () => void;
}

const SphereVideo: React.FC<{ video: HTMLVideoElement }> = ({ video }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (video) {
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat;
      setTexture(videoTexture);
    }
  }, [video]);

  // 구 내부에서 보려면 BackSide
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 64, 64]} />
      {texture && <meshBasicMaterial map={texture} side={THREE.BackSide} />}
    </mesh>
  );
};

const PanoramaPlayer: React.FC<PanoramaPlayerProps> = ({ streamUrl, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.style.display = "none";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
        setVideoReady(true);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play();
        setVideoReady(true);
      });
    } else {
      console.error("HLS is not supported in this browser");
    }

    return () => {
      video.pause();
    };
  }, [streamUrl]);

  return (
    <>
      <video ref={videoRef} />
      {videoReady && (
        <Canvas style={{ width: "100%", height: "600px" }} onClick={onClick}>
          <ambientLight />
          <SphereVideo video={videoRef.current} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            autoRotate={false}
          />
        </Canvas>
      )}
    </>
  );
};

export default PanoramaPlayer;
