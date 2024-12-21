const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const { Area } = require("../../models");

// 텍스트 파일 경로
const txtFilePath = path.join(__dirname, "latlng.bdong.txt");

const seedAreas = async () => {
  try {
    const data = fs.readFileSync(txtFilePath);
    const decodedData = iconv.decode(data, "utf-8");
    const lines = decodedData.split("\n");

    for (const line of lines) {
      if (!line.trim()) continue; // 빈 줄 건너뛰기

      const [
        bjd_cd,
        address_count,
        sido,
        sigungu,
        eupmyeondong,
        ri,
        coordinates,
      ] = line.split("\t");

      const legal_areacode = bjd_cd.trim();
      const addressCount = parseInt(address_count.trim(), 10);
      const sidoTrimmed = sido.trim();
      const sigunguTrimmed = sigungu.trim();
      const eupmyeondongTrimmed = eupmyeondong.trim();
      const riTrimmed = ri.trim();

      // 이름 구성
      let name = `${sidoTrimmed} ${sigunguTrimmed}`;
      if (eupmyeondongTrimmed) name += ` ${eupmyeondongTrimmed}`;
      if (riTrimmed) name += ` ${riTrimmed}`;

      // 좌표 파싱
      const [lat, lng] = coordinates
        .split(",")
        .map((coord) => parseFloat(coord.trim()));

      // 좌표 유효성 검사
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.error(`유효하지 않은 좌표: ${coordinates}`);
        continue;
      }

      // GeoJSON 형식으로 location 생성
      const location = {
        type: "Point",
        coordinates: [lng, lat], // 경도, 위도 순서
      };

      // Area 생성
      try {
        await Area.create({
          name,
          location, // GeoJSON 형식으로 삽입
          legal_areacode,
        });

        console.log(`성공적으로 저장됨: ${name}`);
      } catch (err) {
        console.error(`데이터 저장 중 오류 발생: ${err.message}`);
      }
    }

    console.log("시더 작업이 완료되었습니다.");
  } catch (error) {
    console.error("시더 실행 중 오류 발생:", error);
  }
};

// 시더 실행
seedAreas();
