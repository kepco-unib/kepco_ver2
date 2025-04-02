import React from "react";
import styles from "../../css/camera.module.css";

const camera: React.FC = () => {
  return (
    <div className={styles.boxContainer}>
      <div className={styles.box}>
        <div className={styles.textArea}>panorama 360 View</div>
        <div className={styles.contentArea}>컨텐츠 영역 1</div>
      </div>
      <div className={styles.box}>
        <div className={styles.textArea}>IR Cam View</div>
        <div className={styles.contentArea}>컨텐츠 영역 2</div>
      </div>
    </div>
  );
};

export default camera;