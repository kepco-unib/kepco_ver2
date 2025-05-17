import React, { useState } from "react";
import { statusAtom } from "../../recoil/statusAtom";
import { activeModeAtom } from "../../recoil/activeModeAtom";
import styles from "../../styles.module.css";
import { useRecoilValue, useRecoilState } from "recoil";

const StatusBox: React.FC = () => {
  const status = useRecoilValue(statusAtom);
  const [activeMode, setActiveMode] = useRecoilState(activeModeAtom);

  return (
    <div className={styles.statusWrapper}>
      {/* 모드 선택 버튼 */}
      <div className={styles.modeButtonContainer}>
        <span
          className={`${styles.modeButton} ${activeMode === "SLAM" ? styles.active : ""}`}
          onClick={() => setActiveMode("SLAM")}
        >
          SLAM
        </span>
        <span className={styles.separator}>/</span>
        <span
          className={`${styles.modeButton} ${activeMode === "Navigation" ? styles.active : ""}`}
          onClick={() => setActiveMode("Navigation")}
        >
          Navigation
        </span>
        <span className={styles.separator}>/</span>
        <span
          className={`${styles.modeButton} ${activeMode === "Control" ? styles.active : ""}`}
          onClick={() => setActiveMode("Control")}
        >
          Control
        </span>
      </div>

      {/* 상태 값 표시 */}
      <div className={styles.statusContainer}>
        <div className={styles.statusItem}>
          <span className={styles.label}>선속도</span>
          <div className={styles.valueBox}>{status.velocity}</div>
          <span className={styles.unit}>m/s</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.label}>각속도</span>
          <div className={styles.valueBox}>{status.angular_velocity}</div>
          <span className={styles.unit}>rad/s</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.label}>배터리 용량</span>
          <div className={styles.valueBox}>{status.battery}</div>
          <span className={styles.unit}>%</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.label}>배터리 온도</span>
          <div className={styles.valueBox}>{status.temperature}</div>
          <span className={styles.unit}>°C</span>
        </div>
      </div>

      {/* Orientation 정보 */}
      <div className={styles.orientationContainer}>
        <span className={styles.orientationLabel}>위치</span>
        <div className={styles.orientationBox}>
          {`${status.roll}, ${status.pitch}, ${status.yaw}`}
        </div>
        <span className={styles.orientationUnit}>X, Y, Yaw °</span>
      </div>
    </div>
  );
};

export default StatusBox;
