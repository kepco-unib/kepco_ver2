import React, { useState } from "react";
import Database from "./Database";

const Main: React.FC = () => {
  const [data, setData] = useState<string[]>(["데이터 1", "데이터 2", "데이터 3"]);

  return (
    <div>
      <h2>메인 컴포넌트</h2>
      <Database data={data} />
    </div>
  );
};

export default Main;
