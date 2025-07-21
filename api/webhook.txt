export default function handler(req, res) {
  if (req.method === 'POST') {
    const userMessage = req.body.userRequest?.utterance || "메시지 없음";
    const answer = `당신이 보낸 말: ${userMessage}`;

    res.status(200).json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: answer
            }
          }
        ]
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
