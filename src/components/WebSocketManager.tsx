import React from "react";
import { useRobotWebSocket } from "../hooks/useWebSocketStatus";

const WebSocketManager: React.FC = () => {
  useRobotWebSocket();
  return null; // 화면에는 아무것도 렌더링 안 함
};

export default WebSocketManager;
