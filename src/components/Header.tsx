import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header style={{ padding: "10px", background: "#282c34", color: "white" }}>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
