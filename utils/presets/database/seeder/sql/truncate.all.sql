-- 1. 외래키 검증 비활성화
SET FOREIGN_KEY_CHECKS = 0;

-- 2. 모든 테이블의 데이터를 삭제
TRUNCATE TABLE contest_answer;
TRUNCATE TABLE contest_board;
TRUNCATE TABLE contest_calendar;
TRUNCATE TABLE contest_question;
TRUNCATE TABLE contest_schedule;
TRUNCATE TABLE contest;
TRUNCATE TABLE studyroom_videocall_member;
TRUNCATE TABLE studyroom_videocall;
TRUNCATE TABLE studyroom_member;
TRUNCATE TABLE studyroom_chat;
TRUNCATE TABLE studyroom_todo;
TRUNCATE TABLE studyroom;
TRUNCATE TABLE schedule_participant;
TRUNCATE TABLE schedule;
TRUNCATE TABLE spec;
TRUNCATE TABLE todo_member;
TRUNCATE TABLE todo;
TRUNCATE TABLE user_studyroom;
TRUNCATE TABLE user_term;
TRUNCATE TABLE user_spec;
TRUNCATE TABLE user_refresh_token;
TRUNCATE TABLE user_oauth;
TRUNCATE TABLE user_verified_email;
TRUNCATE TABLE user_calendar;
TRUNCATE TABLE user_area;
TRUNCATE TABLE user;
TRUNCATE TABLE inquiry_answer;
TRUNCATE TABLE inquiry;
TRUNCATE TABLE board;
TRUNCATE TABLE kakao_user_info;
TRUNCATE TABLE email_verification_code;
TRUNCATE TABLE calendar;
TRUNCATE TABLE area;
TRUNCATE TABLE term;
TRUNCATE TABLE studyroom_calendar;

-- 3. 외래키 검증 활성화
SET FOREIGN_KEY_CHECKS = 1;