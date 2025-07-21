import dialogflow from '@google-cloud/dialogflow';

const projectId = 'rugged-weft-466004-u1'; // 내 프로젝트 ID

// 환경변수에서 JSON 문자열을 읽어서 객체로 변환
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const sessionClient = new dialogflow.SessionsClient({
  credentials: credentials,
  projectId: projectId,
});

// 여기에 내 기존 Dialogflow 처리 코드 이어서 작성
