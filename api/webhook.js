import dialogflow from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

const projectId = 'pyunghwachatbot-nnhb'; // MK님의 프로젝트 ID
const sessionId = uuidv4();
const languageCode = 'ko';

// 서비스 키파일 경로 정확히!
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: 'C:/Users/USER/Downloads/rugged-weft-466004-u1-5f0cb77abd5c.json'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const userMessage = req.body.userRequest?.utterance || '메시지 없음';

  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userMessage,
        languageCode: languageCode,
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    const answer = result.fulfillmentText || '죄송해요, 이해하지 못했어요.';

    return res.status(200).json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: answer,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error('Dialogflow 에러:', error);
    return res.status(500).send('서버 에러');
  }
}
