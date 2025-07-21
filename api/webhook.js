import { SessionsClient } from '@google-cloud/dialogflow';

const projectId = 'pyunghwachatbot-nnhb';

// Vercel 환경변수에서 JSON 키 읽기
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const sessionClient = new SessionsClient({
  credentials,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('카카오 요청:', req.body);

      const userMessage = req.body.userRequest?.utterance || "메시지 없음";

      // 사용자별 세션 ID
      const sessionId = req.body.userRequest?.user?.id || 'default-session-id';
      const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

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
      console.log('Dialogflow 응답:', responses);

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
      console.error('에러:', error);
      res.status(500).json({ error: '서버 에러가 발생했습니다.' });
    }
  } else {
    res.status(405).end();
  }
}
