import React from "react";
import styles from "../styles.module.css";
import logo from "../assets/logo.png";
const REACT_APP_STATUS_API = process.env.REACT_APP_STATUS_API;

const Header: React.FC = () => {
  const sendCommand = async (command: string) => {
    try {
      const response = await fetch(`${REACT_APP_STATUS_API}/api/control`, {
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
    <header className={styles.header}>
      <img src={logo} alt="Logo" className={styles.logo} />

      <div className={styles.headerText}>
        환영합니다! 오늘도 좋은 하루 보내세요 😊
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => sendCommand("emergency_stop")} className={styles.stopButton}>
            긴급 정지
          </button>
          <button onClick={() => sendCommand("resume")} className={styles.stopButton}>
            정지 해제
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
