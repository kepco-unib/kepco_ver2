import React, { useState } from "react";
import styles from "../../styles.module.css";
import MapViewer from "./MapViewer";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { activeModeAtom } from "../../recoil/activeModeAtom";
import { slamStatusAtom, navStatusAtom } from "../../recoil/statusAtom";
import { selectedMapState } from "../../recoil/mapAtom";

const REACT_APP_SLAM_NAV_API = process.env.REACT_APP_SLAM_NAV_API;

const MapButton: React.FC = () => {
  const activeMode = useRecoilValue(activeModeAtom);
  const [mode, setMode] = useState<"2D" | "3D">("2D");
  const [clickMode, setClickMode] = useState<"start" | "goal" | null>(null);

  const setSlamStatus = useSetRecoilState(slamStatusAtom);
  const setNavStatus = useSetRecoilState(navStatusAtom);
  const [selectedMap] = useRecoilState(selectedMapState); // 여기서 사용

  const handle_slam = async (command: string) => {
    try {
      let payload: { command: string; map_name?: string } = { command };

      // end_slam일 때만 map_name을 입력 받음
      if (command === "end") {
        const map_name = prompt("저장할 맵 이름을 입력하세요:");
        if (!map_name) {
          alert("맵 이름이 입력되지 않았습니다.");
          return;
        }
        payload.map_name = map_name;
      }

      const response = await fetch(`${REACT_APP_SLAM_NAV_API}/api/slam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
    if (!selectedMap) {
      alert("맵이 선택되지 않았습니다.");
      return;
    }

    try {
      const payload = {
        command,
        map_name: selectedMap.map_name,
      };

      const response = await fetch(`${REACT_APP_SLAM_NAV_API}/api/nav`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("API 요청 실패");

      const data = await response.json();
      console.log("응답 데이터:", data);
      alert(`'${command}' 명령이 맵 '${selectedMap.map_name}'과 함께 전송되었습니다.`);
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
            <button onClick={() => handle_slam("start")} className={styles.button}>Start</button>
            <button onClick={() => handle_slam("pause_slam")} className={styles.button}>Pause</button>
            <button onClick={() => handle_slam("end")} className={styles.button}>End</button>
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
            <button onClick={() => handle_nav("start")} className={styles.button}>Start</button>
            <button onClick={() => handle_nav("pause_nav")} className={styles.button}>Pause</button>
            <button onClick={() => handle_nav("end")} className={styles.button}>End</button>
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
