import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Hls from 'hls.js';
import styles from "../../css/camera.module.css";

const Camera: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Three.js 씬, 카메라, 렌더러 설정
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // 비디오 요소 생성
      const videoElement = document.createElement('video');
      videoElement.crossOrigin = 'anonymous';
      videoElement.loop = true;
      videoElement.muted = true;
      videoElement.playsInline = true;

      // HLS.js 사용하여 HLS 비디오 로드
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource('http://223.171.154.144:8080/hls/test.m3u8');
        hls.attachMedia(videoElement);
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = 'http://223.171.154.144:8080/hls/test.m3u8';
      }

      // 비디오 텍스처로 사용
      const videoTexture = new THREE.VideoTexture(videoElement);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat;

      // 스피어 지오메트리로 360도 비디오 맵핑
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      const material = new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,  // 양면 텍스처로 설정
      });

      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // 카메라 설정
      camera.position.set(0, 0, 0);

      // 애니메이션 루프
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      // 화면 크기 변경 시 렌더러 크기 조정
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
      handleResize();  // 초기화 시 한번 실행

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        window.removeEventListener('resize', handleResize);
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
        <div className={styles.textArea}>IR Cam View</div>
        <div className={styles.contentArea}>컨텐츠 영역 2</div>
      </div>
    </div>
  );
};

export default Camera;
