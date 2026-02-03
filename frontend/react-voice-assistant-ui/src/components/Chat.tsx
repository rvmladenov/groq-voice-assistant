import { useAudioRecorder } from "react-use-audio-recorder";
import { Layout, theme } from 'antd';

  const { Content } = Layout;

const AppChat = () => {
  const {
      recordingStatus,
      recordingTime,
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording,
      getBlob,
      saveRecording,
    } = useAudioRecorder();

    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();

return <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
      <span>{`Recording Status - ${recordingStatus} - ${recordingTime} s`}</span>

      <div>
        <button
          disabled={!(!recordingStatus || recordingStatus === "stopped")}
          onClick={startRecording}
        >
          Start
        </button>

        <button
          disabled={!(recordingStatus === "recording")}
          onClick={pauseRecording}
        >
          Pause
        </button>

        <button
          disabled={!(recordingStatus === "paused")}
          onClick={resumeRecording}
        >
          Resume
        </button>

        <button
          disabled={
            !(recordingStatus === "recording" || recordingStatus === "paused")
          }
          onClick={() => {
            stopRecording((blob) => {
              console.log(blob);
            });
          }}
        >
          Stop
        </button>
      </div>

      <div>
        <button
          disabled={!(recordingStatus === "stopped")}
          onClick={() => saveRecording()}
        >
          Save
        </button>
        <button
          disabled={!(recordingStatus === "stopped")}
          onClick={() => console.log(getBlob())}
        >
          Get Blob
        </button>
      </div>
          </div>
        </Content>

};

export default AppChat;