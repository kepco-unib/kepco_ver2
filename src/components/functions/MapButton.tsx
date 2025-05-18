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

  const handle_slam = async (command: string) => {
    try {
      const response = await fetch("http://localhost:8004/api/slam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

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
      const response = await fetch("http://localhost:8004/api/nav", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const data = await response.json();
      console.log("응답 데이터:", data);
      alert(`'${command}' 명령이 전송되었습니다.`);
    } catch (error) {
      console.error("에러 발생:", error);
      alert("API 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.mapButtonContainer}>
      {/* 버튼 */}
      <div className={styles.buttonContainer}>
      {activeMode === "SLAM" && (
        <>
          <button onClick={() => handle_slam("start_slam")} className={styles.button}>Start</button>
          <button onClick={() => handle_slam("pause_slam")} className={styles.button}>Pause</button>
          <button onClick={() => handle_slam("end_slam")} className={styles.button}>End</button>
        </>
      )}
      {activeMode === "Navigation" && (
        <>
          <button onClick={() => handle_nav("start_nav")} className={styles.button}>Start</button>
          <button onClick={() => handle_nav("pause_nav")} className={styles.button}>Pause</button>
          <button onClick={() => handle_nav("end_nav")} className={styles.button}>End</button>
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
