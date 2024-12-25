const { romanize } = require("es-hangul");

const file = {
  originalname: "테스트 이미지.png",
};

const romanizedOriginalName = romanize(file.originalname);
console.log(
  `[uploadImageToS3] romanizedOriginalName: ${romanizedOriginalName}`
);
const sanitizedOriginalName = romanizedOriginalName.replace(
  /[^a-zA-Z0-9_\-\.]/g,
  "-"
);

console.log(sanitizedOriginalName);
