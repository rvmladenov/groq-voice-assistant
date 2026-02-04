import { Server, Socket } from "socket.io";
import * as fs from "fs";
import * as path from "path";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

// Define the function type for the transcription service
type TranscriptionService = (filePath: string) => Promise<any>;

export const initSocket = (server: any, groqMain: TranscriptionService) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins for dev
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    let writeStream: fs.WriteStream | null = null;
    let tempFilePath: string | null = null;

    socket.on("start-stream", () => {
      console.log("Starting stream for", socket.id);
      const filename = `stream_${socket.id}_${Date.now()}.wav`; // Assuming client sends WAV chunks
      tempFilePath = path.join(__dirname, "../uploads", filename);

      // Ensure uploads directory exists
      if (!fs.existsSync(path.dirname(tempFilePath))) {
        fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
      }

      writeStream = fs.createWriteStream(tempFilePath);
    });

    socket.on("audio-chunk", (chunk: ArrayBuffer) => {
      if (writeStream) {
        writeStream.write(Buffer.from(chunk));
        socket.emit("transcription-chunk", chunk);
      }
    });

    socket.on("end-stream", async () => {
      console.log("Stream finished for", socket.id);
      if (writeStream && tempFilePath) {
        writeStream.end();
        writeStream = null;

        try {
          // Process the complete file
          const transcription = await groqMain(tempFilePath);

          for await (const chunk of transcription) {
            socket.emit("transcription-chunk", chunk);
          }

          socket.emit("transcription-complete");

          // Cleanup
          fs.unlinkSync(tempFilePath);
        } catch (error) {
          console.error("Transcription error:", error);
          socket.emit("error", "Transcription failed");
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (writeStream) {
        writeStream.end();
      }
      // Cleanup temp file if it exists and wasn't processed?
      // Maybe leave it for debug or implement cleaner cleanup logic.
    });
  });

  return io;
};
