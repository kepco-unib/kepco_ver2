import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { statusAtom, StatusData } from "../recoil/statusAtom"

export function useWebSocketStatus() {
  const setStatus = useSetRecoilState(statusAtom);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8003/ws/status");

    ws.onopen = () => {
      console.log("✅ WebSocket 연결됨");
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data: Partial<StatusData> = JSON.parse(event.data);

        setStatus({
          velocity: String(data.velocity ?? "0.0"),
          angular_velocity: String(data.angular_velocity ?? "0.0"),
          battery: String(data.battery ?? "0.0"),
          temperature: String(data.temperature ?? "0.0"),
          roll: String(data.roll ?? "0.0"),
          pitch: String(data.pitch ?? "0.0"),
          yaw: String(data.yaw ?? "0.0"),
        });
      } catch (err) {
        console.error("❌ 데이터 파싱 에러:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket 에러:", error);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket 연결 종료");
    };

    return () => ws.close();
  }, [setStatus]);
}
