import React, { useState } from "react";
import styles from "../../styles.module.css";
import MapViewer from "./MapViewer";
import { useRecoilValue,useSetRecoilState } from "recoil";
import { activeModeAtom } from "../../recoil/activeModeAtom"; 
import { slamStatusAtom, navStatusAtom } from "../../recoil/statusAtom";

const MapButton: React.FC = () => {
  const activeMode = useRecoilValue(activeModeAtom);
  const [mode, setMode] = useState<"2D" | "3D">("2D"); // 기본값 2D
  const setSlamStatus = useSetRecoilState(slamStatusAtom);
  const setNavStatus = useSetRecoilState(navStatusAtom);

const handleStart_slam = async () => {
  console.log("slam Start 클릭");
  try {
    const res = await fetch("http://localhost:8004/slam/start", {
      method: "POST",
    });
    const result = await res.json();
    console.log("SLAM 시작 응답:", result);
    setSlamStatus("start");
  } catch (err) {
    console.error("SLAM 시작 실패:", err);
  }
};

const handleEnd_slam = async () => {
  console.log("slam End 클릭");
  try {
    const res = await fetch("http://localhost:8004/slam/end", {
      method: "POST",
    });
    const result = await res.json();
    console.log("SLAM 종료 응답:", result);
    setSlamStatus("end");
  } catch (err) {
    console.error("SLAM 종료 실패:", err);
  }
};

const handleStart_nav = async () => {
  console.log("nav Start 클릭");
  try {
    const res = await fetch("http://localhost:8004/nav/start", {
      method: "POST",
    });
    const result = await res.json();
    console.log("nav 시작 응답:", result);
    setNavStatus("start");
  } catch (err) {
    console.error("nav 시작 실패:", err);
  }
};

const handleEnd_nav = async () => {
  console.log("nav End 클릭");
  try {
    const res = await fetch("http://localhost:8004/nav/end", {
      method: "POST",
    });
    const result = await res.json();
    console.log("nav 종료 응답:", result);
    setNavStatus("end");
  } catch (err) {
    console.error("nav 종료 실패:", err);
  }
};

const handlePause_slam = async () => {
  console.log("slam Pause 클릭");
  try {
    const res = await fetch("http://localhost:8004/slam/pause", {
      method: "POST",
    });
    const result = await res.json();
    console.log("SLAM 일시정지 응답:", result);
    setSlamStatus("pause");
  } catch (err) {
    console.error("SLAM 일시정지 실패:", err);
  }
};

const handlePause_nav = async () => {
  console.log("nav Pause 클릭");
  try {
    const res = await fetch("http://localhost:8004/nav/pause", {
      method: "POST",
    });
    const result = await res.json();
    console.log("nav 일시정지 응답:", result);
    setNavStatus("pause");
  } catch (err) {
    console.error("nav 일시정지 실패:", err);
  }
};

  return (
    <div className={styles.mapButtonContainer}>
      {/* 버튼 */}
      <div className={styles.buttonContainer}>
      {activeMode === "SLAM" && (
        <>
          <button onClick={handleStart_slam} className={styles.button}>Start</button>
          <button onClick={handlePause_slam} className={styles.button}>Pause</button>
          <button onClick={handleEnd_slam} className={styles.button}>End</button>
        </>
      )}
      {activeMode === "Navigation" && (
        <>
          <button onClick={handleStart_nav} className={styles.button}>Start</button>
          <button onClick={handlePause_nav} className={styles.button}>Pause</button>
          <button onClick={handleEnd_nav} className={styles.button}>End</button>
        </>
      )}
        <button
          className={`${styles.button} ${mode === "2D" ? styles.active : ""}`}
          onClick={() => setMode("2D")}
        >
          2D
        </button>
        <button
          className={`${styles.button} ${mode === "3D" ? styles.active : ""}`}
          onClick={() => setMode("3D")}
        >
          3D
        </button>
      </div>

      {/* 지도 뷰어 */}
      <MapViewer mode={mode} />
    </div>
  );
};

export default MapButton;
