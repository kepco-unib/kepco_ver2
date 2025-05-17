import React from "react";
import { useWebSocketStatus } from "../hooks/useWebSocketStatus";

const WebSocketManager: React.FC = () => {
  useWebSocketStatus();
  return null; // 화면에는 아무것도 렌더링 안 함
};

export default WebSocketManager;
