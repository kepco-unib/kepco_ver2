import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { activeModeAtom } from "./recoil/activeModeAtom";
const REACT_APP_STATUS_WS = process.env.REACT_APP_STATUS_WS;

const RecoilObserver: React.FC = () => {
  const mode = useRecoilValue(activeModeAtom);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("mode 값이 변경됨:", mode);

    // mode가 Control일 때 WebSocket 연결 및 키보드 이벤트 등록
    if (mode === "Control") {
      wsRef.current = new WebSocket(`${REACT_APP_STATUS_WS}/ws/control`);

      wsRef.current.onopen = () => {
        console.log("✅ Control WebSocket 연결됨");
      };

      wsRef.current.onclose = () => {
        console.log("⚠️ Control WebSocket 연결 종료");
      };

      wsRef.current.onerror = (err) => {
        console.error("❌ Control WebSocket 에러:", err);
      };

      // 키보드 이벤트 핸들러
      const handleKeyDown = (event: KeyboardEvent) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          // 키보드 키를 JSON 형식으로 서버로 보냄
          wsRef.current.send(JSON.stringify({ key: event.key }));
          console.log("보낸 키:", event.key);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // Cleanup
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        wsRef.current?.close();
        wsRef.current = null;
      };
    }
  }, [mode]);

  return null;
};

export default RecoilObserver;
