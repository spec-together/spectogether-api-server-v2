const { NotExistsError } = require("../../errors");
const logger = require("../../logger");
const db = require("../../models");

exports.checkIfUserExistsByUserId = async (userId) => {
  const user = await db.User.findByPk(userId);
  console.log(user);
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }
  return;
};

exports.getUserSpecsByUserId = async (userId) => {
  const userSpecs = await db.UserSpec.findAll({
    where: { user_id: userId },
    attributes: ["created_at"],
    include: [
      {
        model: db.Spec,
        as: "spec",
        attributes: ["spec_id", "name", "host", "spec_date", "content"],
        required: false, // LEFT OUTER JOIN 수행
        include: [
          {
            model: db.SpecPhoto,
            as: "spec_photos",
            attributes: ["image_url", "sequence"],
            required: false,
          },
        ],
      },
    ],
  });
  if (!userSpecs) {
    throw new NotExistsError("해당 사용자의 스펙이 없습니다.");
  }
  // Spec 데이터만 추출
  const specs = userSpecs.map((us) => {
    const specData = us.spec;
    return {
      spec_id: specData.spec_id,
      name: specData.name,
      host: specData.host,
      spec_date: specData.spec_date,
      content: specData.content,
      images: specData.spec_photos.map((image) => ({
        sequence: image.sequence,
        image_url: image.image_url,
      })),
      created_at: us.created_at,
    };
  });

  logger.debug(
    `[getUserSpecsByUserIdService] 파싱된 스펙: ${JSON.stringify(
      specs,
      null,
      2
    )}`
  );

  return specs;
};

exports.getUserNeighborhoodsByUserId = async (userId) => {
  const userNeighborhoods = await db.UserArea.findAll({
    where: { user_id: userId },
    attributes: ["sequence"],
    include: [
      {
        model: db.Area,
        as: "area",
        attributes: ["area_id", "sido", "gungu"],
        required: false,
      },
    ],
  });
  logger.debug(
    `[getUserNeighborhoodsByUserId] 해당 사용자의 동네를 가져옵니다: ${JSON.stringify(
      userNeighborhoods,
      null,
      2
    )}`
  );
  if (!userNeighborhoods) {
    throw new NotExistsError("해당 사용자의 동네가 없습니다.");
  }

  const neighborhoods = userNeighborhoods.map((un) => {
    const area = un.area;
    return {
      area_id: area.area_id,
      sequence: un.sequence,
      sido: area.sido,
      gungu: area.gungu,
    };
  });

  return neighborhoods;
};

exports.getUserMyProfile = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: [
      "user_id",
      "name",
      "nickname",
      "nickname_changes",
      "birthdate",
      "phone_number",
      "email",
      "is_email_verified",
      "profile_image",
      "spec_level",
      "manner_score",
      "created_at",
    ],
    include: [
      {
        model: db.UserSchool,
        as: "user_schools",
        attributes: ["school_id", "is_verified", "is_public"],
        include: [
          {
            model: db.School,
            as: "school",
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }

  const profile = {
    user_id: user.user_id,
    name: user.name,
    nickname: user.nickname,
    remaining_nickname_changes: 2 - user.nickname_changes,
    birthdate: user.birthdate,
    phone: user.phone_number,
    email: user.email,
    is_email_verified: user.is_email_verified,
    school: user.user_schools?.[0]?.school?.name,
    is_school_verified: user.user_schools?.[0]?.is_verified,
    profile_image: user.profile_image,
    spec_level: user.spec_level,
    manner_score: user.manner_score,
    created_at: user.created_at,
  };

  return profile;
};

exports.getOtherUserProfile = async (otherUserId) => {
  const user = await db.User.findByPk(otherUserId, {
    attributes: [
      "user_id",
      "nickname",
      "birthdate",
      "phone_number",
      "email",
      "is_email_verified",
      "is_email_public",
      "profile_image",
      "website",
      "description",
      "spec_level",
      "manner_score",
      "created_at",
    ],
    include: [
      {
        model: db.UserArea,
        as: "user_areas",
        attributes: ["sequence"],
        include: [
          {
            model: db.Area,
            as: "area",
            attributes: ["sido", "gungu"],
          },
        ],
      },
      {
        model: db.UserSpec,
        as: "user_specs",
        attributes: ["spec_id"],
        include: [
          {
            model: db.Spec,
            as: "spec",
            attributes: ["name", "host", "spec_date", "status", "content"],
          },
        ],
      },
      {
        model: db.UserSchool,
        as: "user_schools",
        attributes: ["school_id", "is_verified", "is_public"],
        include: [
          {
            model: db.School,
            as: "school",
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  if (!user) {
    throw new NotExistsError("해당 사용자가 없습니다.");
  }

  const publicProfile = {
    nickname: user.nickname,
    phone: user.phone_number,
    email: user.is_email_public ? email : null,
    is_email_verified: user.is_email_verified,
    school: user.user_schools.is_public ? user.user_schools.school.name : null,
    is_school_verified: user.user_schools.is_verified,
    profile_image: user.profile_image,
    website: user.website,
    introduction: user.description,
    areas: user.user_areas.map((area) => ({
      sequence: area.sequence,
      sido: area.Area.sido,
      gungu: area.Area.gungu,
    })),
    spec_level: user.spec_level,
    specs: user.user_specs.map((spec) => {
      return spec.spec.status === "private"
        ? null
        : {
            name: spec.spec.name,
            host: spec.spec.host,
            spec_date: spec.spec.spec_date,
            content: spec.spec.content,
          };
    }),
    manner_score: user.manner_score,
    created_at: user.created_at,
  };

  return publicProfile;
};
