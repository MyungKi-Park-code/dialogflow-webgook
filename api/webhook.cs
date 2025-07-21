import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

// Vercel에서는 CommonJS가 아니라 ES Module로 import 권장

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const projectId = 'pyunghwachatbot-nnhb'; // ← 여기에 본인 Dialogflow 프로젝트 ID!
  const sessionId = uuidv4();
  const sessionClient = new SessionsClient({
    credentials: JSON.parse(
      Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString('utf8')
    ),
  });

  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const query = req.body.userRequest.utterance;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: 'ko',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: result.fulfillmentText,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.status(500).send('Dialogflow request failed');
  }
}
