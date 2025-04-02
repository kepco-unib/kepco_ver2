import React from "react";
import styles from "../styles.module.css";
import logo from "../assets/logo.png"; // 이미지 경로 확인

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {/* 왼쪽: 로고 */}
      <img src={logo} alt="Logo" className={styles.logo} />

      {/* 오른쪽: 텍스트 */}
      <div className={styles.headerText}>환영합니다! 오늘도 좋은 하루 보내세요 😊</div>
    </header>
  );
};

export default Header;
