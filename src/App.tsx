import React, { useEffect } from "react";
import Header from "./components/Header";
import Main from "./components/MainComponent";
import { useRecoilValue } from "recoil";
import { statusAtom } from "./recoil/statusAtom";
import { selectedMapState } from "./recoil/mapAtom";
import { useRobotWebSocket } from "./hooks/useWebSocketStatus";


const App: React.FC = () => {
  const selectedMap = useRecoilValue(selectedMapState);

  useEffect(() => {
    console.log("selectedMapState 변경:", selectedMap);
  }, [selectedMap]);
  const status = useRecoilValue(statusAtom);
  useRobotWebSocket();

  // 예: status 값을 출력하거나 조건에 따라 UI 변경 가능

  return (
    <div>
      <Header />
      <Main />
    </div>
  );
};

export default App;
