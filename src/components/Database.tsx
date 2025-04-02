import React from "react";

interface DatabaseProps {
  data: string[];
}

const Database: React.FC<DatabaseProps> = ({ data }) => {
  return (
    <div>
      <h2>데이터베이스 컴포넌트</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Database;
