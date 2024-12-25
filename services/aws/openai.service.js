const OpenAI = require("openai");
const config = require("../../config.json");
const { SPECTOGETHER_API_V2_KEY } = config.OPEN_AI;

const openai = new OpenAI({
  apiKey: SPECTOGETHER_API_V2_KEY,
});

const callOpenAI = async () => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "openai api를 활용해서 내가 할 수 있는 것들과, 그를 하는데에 드는 토큰과 비용에 대해서 알려줘.",
        },
      ],
    });
    console.log(completion.choices[0].message);
    console.log(JSON.stringify(completion, null, 2));
  } catch (error) {
    console.error("OpenAI API 요청 중 오류 발생:", error);
  }
};

const generateImage = async () => {
  const image = await openai.images.generate({
    prompt: "A beautiful woman with long hair and a dress",
  });
  console.log(image.data[0].url);
};

// generateImage();
// callOpenAI();

// 이미지는 비싸더라구요 ..
// 제 지갑을 지켜주세요 ,,,, ㅠ
