import React, { useState } from "react";
import styles from "../../styles.module.css";
import MapViewer from "./MapViewer";

const MapButton: React.FC = () => {
  const [mode, setMode] = useState<"2D" | "3D">("2D"); // 기본값 2D

  return (
    <div className={styles.mapButtonContainer}>
      {/* 버튼 */}
      <div className={styles.buttonContainer}>
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
