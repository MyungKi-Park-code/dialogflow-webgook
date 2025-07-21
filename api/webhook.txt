export default function handler(req, res) {
  if (req.method === 'POST') {
    // 카카오톡에서 보낸 메시지 받기
    const userMessage = req.body.userRequest?.utterance || "메시지 없음";

    // 사용자에게 보낼 답변 텍스트 만들기
    const answer = `당신이 보낸 말: ${userMessage}`;

    // 카카오톡 플러스친구 메시지 응답 형식에 맞게 JSON 응답
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
    // POST가 아니면 허용하지 않음 (405)
    res.status(405).end();
  }
}
