import { SessionsClient } from '@google-cloud/dialogflow';

const projectId = 'rugged-weft-466004-u1';  // 구글 클라우드 프로젝트 아이디

const sessionClient = new SessionsClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const userMessage = req.body.userRequest?.utterance || "메시지 없음";

    const sessionPath = sessionClient.projectAgentSessionPath(projectId, 'some-session-id');

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: userMessage,
          languageCode: 'ko-KR',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    const dialogflowResponseText = result.fulfillmentText || "답변이 없습니다.";

    res.status(200).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: dialogflowResponseText,
            },
          },
        ],
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
}
