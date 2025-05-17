import React from "react";
import Header from "./components/Header";
import Main from "./components/MainComponent";
import { useRecoilValue } from "recoil";
import { statusAtom } from "./recoil/statusAtom";
import { useWebSocketStatus } from "./hooks/useWebSocketStatus";


const App: React.FC = () => {
  const status = useRecoilValue(statusAtom);
  useWebSocketStatus();

  // 예: status 값을 출력하거나 조건에 따라 UI 변경 가능

  return (
    <div>
      <Header />
      <Main />
    </div>
  );
};

export default App;
