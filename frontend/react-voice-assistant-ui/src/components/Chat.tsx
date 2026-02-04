import { useState, useRef, useEffect } from "react";
import { Layout, theme } from "antd";
import { io, Socket } from "socket.io-client";

const { Content } = Layout;

const AppChat = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [recordingStatus, setRecordingStatus] = useState<"idle" | "recording" | "paused">("idle");
  const [transcription, setTranscription] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:9000");

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

    socketRef.current.on("transcription-chunk", (chunk) => {
      console.log("Chunk:", chunk);
      // Determine how to extract text based on chunk structure. 
      // Assuming chunk.choices[0].delta.content or chunk.x_groq.usage if it's usage data?
      // For now, let's just append if we can find text, or store the whole chunk strictly for debug? 
      // Safe bet: Update state to include this chunk content.
      // If it is verbose_json + stream, the chunk structure might be different.
      // Let's assume standard completion chunk structure for now, or just dump it.
      
      // Attempt to extract text (adjust based on actual response structure)
      const text = chunk.choices?.[0]?.delta?.content || "";
      if (text) {
          setTranscription((prev: string) => (prev || "") + text);
      }
    });

    socketRef.current.on("transcription-complete", () => {
      console.log("Transcription complete");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      socketRef.current?.emit("start-stream");

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current) {
          socketRef.current.emit("audio-chunk", event.data);
        }
      };

      mediaRecorder.start(1000); // Send chunks every 1 second
      setRecordingStatus("recording");
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
      
      socketRef.current?.emit("end-stream");
      setRecordingStatus("idle");
    }
  };

  return (
    <Content style={{ margin: "24px 16px 0" }}>
      <div
        style={{
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          padding: 24,
        }}
      >
        <span>{`Recording Status - ${recordingStatus}`}</span>

        <div style={{ marginTop: 20 }}>
          <button
            disabled={recordingStatus === "recording"}
            onClick={startRecording}
            style={{ marginRight: 10 }}
          >
            Start Streaming
          </button>

          <button
            disabled={recordingStatus !== "recording"}
            onClick={stopRecording}
          >
            Stop Streaming
          </button>
        </div>

        {transcription && (
            <div style={{ marginTop: 20 }}>
                <h3>Transcription Result:</h3>
                <p>{transcription}</p>
            </div>
        )}
      </div>
    </Content>
  );
};

export default AppChat;
