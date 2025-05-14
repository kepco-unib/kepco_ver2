import React from "react";
import styles from "../styles.module.css";
import BoxComponent from "./BoxComponent";
import MapButton from "./functions/MapButton"; // ✅ 맵 버튼 컴포넌트
import DataBase from "./functions/DataBase";
import StatusBox from "./functions/StatusBox";
import Camera from "./functions/Camera";

const MainComponent: React.FC = () => {
  return (
    <div className={styles.main}>
      <div className={styles.gridContainer}>
      <BoxComponent title="SLAM Map" className={styles.box1}>
        <MapButton />
      </BoxComponent>

      <BoxComponent title="Tracking Camera" className={styles.box2}>
        <Camera />
      </BoxComponent>

      <BoxComponent title="SLAM Map Data Base" className={styles.box3}>
        <div className={styles.splitHorizontal}>
          <div className={styles.leftBox}>
            <DataBase />
          </div>
          <div className={styles.rightBox}>
            <BoxComponent title="Robot Information" className={styles.innerBox}>
              <StatusBox />
            </BoxComponent>
          </div>
        </div>
      </BoxComponent>

      </div>
    </div>
  );
};

export default MainComponent;
