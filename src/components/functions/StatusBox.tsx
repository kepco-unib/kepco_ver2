import React, { useState, useEffect } from "react";
import styles from "../../styles.module.css";

interface StatusData {
  velocity: string;
  angular_velocity: string;
  battery: string;
  temperature: string;
  roll: string;
  pitch: string;
  yaw: string;
}

const getRandomValue = (min: number, max: number, fixed: number = 1): string => {
  return (Math.random() * (max - min) + min).toFixed(fixed);
};

const StatusBox: React.FC = () => {
  const [status, setStatus] = useState<StatusData>({
    velocity: "0.0",
    angular_velocity: "0.0",
    battery: "100",
    temperature: "25.0",
    roll: "0.0",
    pitch: "0.0",
    yaw: "0.0",
  });

  const [activeMode, setActiveMode] = useState<"SLAM" | "Navigation">("SLAM");

  useEffect(() => {
    // 2초마다 랜덤 값 업데이트
    const interval = setInterval(() => {
      setStatus({
        velocity: getRandomValue(0, 2),          // 0 ~ 2 m/s
        angular_velocity: getRandomValue(-1, 1), // -1 ~ 1 rad/s
        battery: getRandomValue(20, 100, 0),     // 20 ~ 100% (정수)
        temperature: getRandomValue(20, 40),     // 20 ~ 40°C
        roll: getRandomValue(-10, 10),           // -10 ~ 10°
        pitch: getRandomValue(-10, 10),          // -10 ~ 10°
        yaw: getRandomValue(-180, 180),          // -180 ~ 180°
      });
    }, 100); // 2초마다 업데이트

    return () => clearInterval(interval); // 언마운트 시 인터벌 정리
  }, []);

  return (
    <div className={styles.statusWrapper}>
    {/* 🔥 SLAM / Navigation 버튼 (우측 정렬) */}
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
    </div>
  
    {/* 🔥 2×2 그리드 상태 표시 */}
    <div className={styles.statusContainer}>
      <div className={styles.statusItem}>
        <span className={styles.label}>linear velocity</span>
        <div className={styles.valueBox}>{status.velocity}</div>
        <span className={styles.unit}>m/s</span>
      </div>
      <div className={styles.statusItem}>
        <span className={styles.label}>angular velocity</span>
        <div className={styles.valueBox}>{status.angular_velocity}</div>
        <span className={styles.unit}>rad/s</span>
      </div>
      <div className={styles.statusItem}>
        <span className={styles.label}>battery capacity</span>
        <div className={styles.valueBox}>{status.battery}</div>
        <span className={styles.unit}>%</span>
      </div>
      <div className={styles.statusItem}>
        <span className={styles.label}>temperature</span>
        <div className={styles.valueBox}>{status.temperature}</div>
        <span className={styles.unit}>°C</span>
      </div>
    </div>
  
    {/* 🔥 오리엔테이션 정보 */}
    <div className={styles.orientationContainer}>
      <span className={styles.orientationLabel}>Orientation</span>
      <div className={styles.orientationBox}>
        {`${status.roll}, ${status.pitch}, ${status.yaw}`}
      </div>
      <span className={styles.orientationUnit}>Roll, Pitch, Yaw °</span>
    </div>
  </div>
  
  );
};

export default StatusBox;
