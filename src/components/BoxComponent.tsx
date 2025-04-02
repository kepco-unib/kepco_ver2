import React from "react";
import styles from "../styles.module.css";

interface BoxProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

const BoxComponent: React.FC<BoxProps> = ({ title, children, className }) => {
  return (
    <div className={`${styles.box} ${className || ""}`.trim()}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BoxComponent;
