# Groq Voice Assistant

This is a simple Voice Assistant application that integrates a Frontend and a Backend.

git clone <repository-url>
cd groq-voice-assistant

````

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd frontend/react-voice-assistant-ui
npm install

# Install backend dependencies
cd ../../server
npm install
````

## Usage

The server will start on `http://localhost:9000`.

groq-voice-assistant/
├── frontend/ # React frontend application
│ └── react-voice-assistant-ui/
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── App.tsx # Main application component
│ │ └── index.tsx # Entry point
│ ├── package.json
│ └── vite.config.ts
├── server/ # Node.js/Express backend
│ ├── src/
│ │ └── server.ts # Server entry point
│ ├── package.json
│ └── package-lock.json
├── .gitignore # Git ignore file
└── README.md # Project documentation

## Development

cd frontend/react-voice-assistant-ui
npm run dev

The backend uses Express. You can run:

cd server
npm start
