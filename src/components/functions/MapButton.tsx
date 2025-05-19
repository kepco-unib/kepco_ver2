import React, { useState } from "react";
import styles from "../../styles.module.css";
import MapViewer from "./MapViewer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { activeModeAtom } from "../../recoil/activeModeAtom";
import { slamStatusAtom, navStatusAtom } from "../../recoil/statusAtom";

const REACT_APP_SLAM_NAV_API = process.env.REACT_APP_SLAM_NAV_API;

const MapButton: React.FC = () => {
  const activeMode = useRecoilValue(activeModeAtom);
  const [mode, setMode] = useState<"2D" | "3D">("2D");
  const [clickMode, setClickMode] = useState<"start" | "goal" | null>(null);

  const setSlamStatus = useSetRecoilState(slamStatusAtom);
  const setNavStatus = useSetRecoilState(navStatusAtom);

  const handle_slam = async (command: string) => {
    try {
      const response = await fetch(`${REACT_APP_SLAM_NAV_API}/api/slam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) throw new Error("API 요청 실패");

      const data = await response.json();
      console.log("응답 데이터:", data);
      alert(`'${command}' 명령이 전송되었습니다.`);
    } catch (error) {
      console.error("에러 발생:", error);
      alert("API 요청 중 오류가 발생했습니다.");
    }
  };

  const handle_nav = async (command: string) => {
    try {
      const response = await fetch(`${REACT_APP_SLAM_NAV_API}/api/nav`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) throw new Error("API 요청 실패");

      const data = await response.json();
      console.log("응답 데이터:", data);
      alert(`'${command}' 명령이 전송되었습니다.`);
    } catch (error) {
      console.error("에러 발생:", error);
      alert("API 요청 중 오류가 발생했습니다.");
    }
  };

const handleClickMode = (mode: "start" | "goal") => {
  setClickMode((prev) => {
    const modeLabel = mode === "start" ? "시작 위치" : "목표 위치";
    const currentMode = activeMode === "SLAM" ? "SLAM 모드" : "Navigation 모드";

    if (prev === mode) {
      alert(`[${currentMode}] ${modeLabel} 선택이 취소되었습니다.`);
      return null;
    } else {
      alert(`[${currentMode}] ${modeLabel}를 지도에서 선택하세요.`);
      return mode;
    }
  });
};

  return (
    <div className={styles.mapButtonContainer}>
      <div className={styles.buttonContainer}>
        {activeMode === "SLAM" && (
          <>
            <button onClick={() => handle_slam("start_slam")} className={styles.button}>Start</button>
            <button onClick={() => handle_slam("pause_slam")} className={styles.button}>Pause</button>
            <button onClick={() => handle_slam("end_slam")} className={styles.button}>End</button>
            <button
              className={`${styles.button_point} ${clickMode === "start" ? styles.active : ""}`}
              onClick={() => handleClickMode("start")}
            >
              시작위치
            </button>
            <button
              className={`${styles.button_point} ${clickMode === "goal" ? styles.active : ""}`}
              onClick={() => handleClickMode("goal")}
            >
              목표위치
            </button>
          </>
        )}
        {activeMode === "Navigation" && (
          <>
            <button onClick={() => handle_nav("start_nav")} className={styles.button}>Start</button>
            <button onClick={() => handle_nav("pause_nav")} className={styles.button}>Pause</button>
            <button onClick={() => handle_nav("end_nav")} className={styles.button}>End</button>
            <button
            className={`${styles.button_point} ${clickMode === "start" ? styles.active : ""}`}
            onClick={() => handleClickMode("start")}
          >
            시작위치
          </button>
          <button
            className={`${styles.button_point} ${clickMode === "goal" ? styles.active : ""}`}
            onClick={() => handleClickMode("goal")}
          >
            목표위치
          </button>
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

      <MapViewer mode={mode} clickMode={clickMode} />
    </div>
  );
};

export default MapButton;
