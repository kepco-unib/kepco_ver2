import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Hls from 'hls.js';
import styles from "../../css/camera.module.css";
const REACT_APP_RTMP_API = process.env.REACT_APP_RTMP_API;

const Camera: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.offsetWidth / containerRef.current.offsetHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer();
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      renderer.setSize(width, height);
      containerRef.current.appendChild(renderer.domElement);

      const videoElement = document.createElement('video');
      videoElement.crossOrigin = 'anonymous';
      videoElement.loop = true;
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.autoplay = true;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(`${REACT_APP_RTMP_API}/hls/test.m3u8`);
        hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = `${REACT_APP_RTMP_API}/hls/test.m3u8`;
      }

      const videoTexture = new THREE.VideoTexture(videoElement);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat;

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      const material = new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,
      });

      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      camera.position.set(0, 0, 0);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          const height = containerRef.current.offsetHeight;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        containerRef.current?.removeChild(renderer.domElement);
        renderer.dispose();
      };
    }
  }, []);

  return (
    <div className={styles.boxContainer}>
      <div className={styles.box}>
        <div className={styles.textArea}>Panorama 360 View</div>
        <div ref={containerRef} className={styles.contentArea}></div>
      </div>
      <div className={styles.box}>
        <div className={styles.textArea}>RGB Cam View</div>
        <div className={styles.contentArea}>컨텐츠 영역 1</div>
      </div>
      <div className={styles.box}>
        <div className={styles.textArea}>IR Cam View</div>
        <div className={styles.contentArea}>컨텐츠 영역 2</div>
      </div>
    </div>
  );
};

export default Camera;
