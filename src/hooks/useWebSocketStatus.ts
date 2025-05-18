import { useEffect, useRef } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { statusAtom, StatusData } from "../recoil/statusAtom";
import { activeModeAtom } from "../recoil/activeModeAtom"; // ✅ 모드 상태 가져오기

const REACT_APP_WS = process.env.REACT_APP_STATUS_WS;

export function useRobotWebSocket() {
  const setStatus = useSetRecoilState(statusAtom);
  const currentMode = useRecoilValue(activeModeAtom); // 현재 모드
  const modeRef = useRef(currentMode); // ✅ 최신 모드 유지

  // 모드가 바뀔 때마다 ref 업데이트
  useEffect(() => {
    modeRef.current = currentMode;
  }, [currentMode]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket(`${REACT_APP_WS}/ws`);

      ws.onopen = () => {
        console.log("✅ WebSocket 연결됨");
        window.addEventListener("keydown", handleKeydown);
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "status") {
            const data: Partial<StatusData> = msg.data;
            setStatus({
              velocity: String(data.velocity ?? "0.0"),
              angular_velocity: String(data.angular_velocity ?? "0.0"),
              battery: String(data.battery ?? "0.0"),
              temperature: String(data.temperature ?? "25.0"),
              roll: String(data.roll ?? "0.0"),
              pitch: String(data.pitch ?? "0.0"),
              yaw: String(data.yaw ?? "0.0"),
            });
          }
        } catch (err) {
          console.error("❌ 데이터 파싱 에러:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket 에러:", error);
        ws?.close();
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket 연결 종료. 2초 후 재연결 시도...");
        reconnectTimer = setTimeout(connect, 2000);
        window.removeEventListener("keydown", handleKeydown);
      };
    };

    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (ws && ws.readyState === WebSocket.OPEN) {
        if (modeRef.current === "Control" && ["w", "a", "s", "d", "x"].includes(key)) {
          ws.send(JSON.stringify({ key }));
        }
      }
    };

    connect();

    return () => {
      ws?.close();
      clearTimeout(reconnectTimer);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [setStatus]);
}
