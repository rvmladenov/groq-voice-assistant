require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const fs = require("fs");
const path = require("path");
import Groq from "groq-sdk";

ffmpeg.setFfmpegPath(ffmpegPath);

// Initialize the Groq client
const groq = new Groq();

const app = express();
const server = http.createServer(app);

app.use(cors());

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

app.post("/transcript", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const inputPath = req.file.path;
  const outputPath = path.join("uploads", `${req.file.filename}.wav`);

  ffmpeg(inputPath)
    .toFormat("wav")
    .on("end", async () => {
      console.log(`Converted to ${outputPath}`);
      // Clean up the original uploaded file if desired
      fs.unlinkSync(inputPath);
      res.json({
        message: "File converted successfully",
        path: outputPath,
        transcription: await groqMain(outputPath),
      });
    })
    .on("error", (err) => {
      console.error("Error converting file:", err);
      res.status(500).send("Error converting file.");
    })
    .save(outputPath);
});

async function groqMain(filePath: string) {
  // Create a transcription job
  const transcription = await groq.audio.transcriptions.create(
    {
      file: fs.createReadStream(filePath), // Required path to audio file - replace with your audio file!
      model: "whisper-large-v3-turbo", // Required model to use for transcription
      prompt: "Specify context or spelling", // Optional
      response_format: "verbose_json", // Optional
      timestamp_granularities: ["word", "segment"], // Optional (must set response_format to "json" to use and can specify "word", "segment" (default), or both)
      language: "bg", // Optional
      temperature: 0.0, // Optional
    },
    {
      stream: true,
    },
  );
  // To print only the transcription text, you'd use console.log(transcription.text); (here we're printing the entire transcription object to access timestamps)
  return transcription;
}

// Initialize socket.io
import { initSocket } from "./socket";
initSocket(server, groqMain);

server.listen(9000, () => {
  console.log("Server running on http://localhost:9000");
});
