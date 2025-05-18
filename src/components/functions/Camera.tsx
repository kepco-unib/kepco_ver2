import React, { useState } from 'react';
import styles from "../../css/camera.module.css";
import PanoramaPlayer from "./PanoramaPlayer";

const Camera: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isPanoramaModal, setIsPanoramaModal] = useState(false); // 파노라마 모달 여부

  const openModal = (imgSrc: string) => {
    setModalImage(imgSrc);
    setIsPanoramaModal(false);
  };

  const openPanoramaModal = () => {
    setIsPanoramaModal(true);
    setModalImage(null);
  };

  const closeModal = () => {
    setModalImage(null);
    setIsPanoramaModal(false);
  };

  const panoramaStreamUrl = `${process.env.REACT_APP_RTMP_API}/hls/test.m3u8`;

  return (
    <>
      <div className={styles.boxContainer}>
        <div className={styles.box}>
          <div className={styles.textArea}>Panorama 360 View</div>
          <div className={styles.contentArea}>
            <PanoramaPlayer
              streamUrl={panoramaStreamUrl}
              onClick={openPanoramaModal}  // 클릭 시 파노라마 모달 열기
            />
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.textArea}>RGB Cam View</div>
          <div className={styles.contentArea} onClick={() => openModal("http://192.168.0.15:8007/video/realsense")}>
            <img
              src="http://192.168.0.15:8007/video/realsense"
              alt="Realtime Stream"
            />
          </div>
        </div>
        <div className={styles.box}>
          <div className={styles.textArea}>IR Cam View</div>
          <div className={styles.contentArea} onClick={() => openModal("http://192.168.0.15:8007/video/flir")}>
            <img
              src="http://192.168.0.15:8007/video/flir"
              alt="Realtime Stream"
            />
          </div>
        </div>
      </div>

      {(modalImage || isPanoramaModal) && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div style={{ width: "1000px", height: "600px" }} className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {isPanoramaModal ? (
              // 파노라마 확대 모달: PanoramaPlayer 컴포넌트로 렌더링
              <PanoramaPlayer 
              streamUrl={panoramaStreamUrl} 
              />
            ) : (
              // 일반 이미지 확대 모달
              <img src={modalImage || ""} alt="확대 이미지" />
            )}
            <button className={styles.closeBtn} onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Camera;
