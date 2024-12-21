-- 1. area 테이블에 샘플 데이터 삽입
INSERT INTO area (name, location, legal_areacode) VALUES
  ('서울특별시', ST_GeomFromText('POINT(126.9780 37.5665)'), '11010'),
  ('부산광역시', ST_GeomFromText('POINT(129.0756 35.1796)'), '26010'),
  ('대구광역시', ST_GeomFromText('POINT(128.6014 35.8722)'), '27010'),
  ('인천광역시', ST_GeomFromText('POINT(126.7052 37.4563)'), '28010'),
  ('광주광역시', ST_GeomFromText('POINT(126.8530 35.1595)'), '29010');

-- 2. term 테이블에 샘플 데이터 삽입
INSERT INTO term (name, description, is_required, term_version, status) VALUES
  ('서비스 이용 약관', '서비스 이용에 대한 약관입니다.', 1, 1, 'active'),
  ('개인정보 처리방침', '개인정보 처리에 대한 방침입니다.', 1, 1, 'active'),
  ('마케팅 정보 수신 동의', '마케팅 정보 수신에 대한 동의입니다.', 0, 1, 'active'),
  ('위치 정보 이용 약관', '위치 정보 이용에 대한 약관입니다.', 0, 1, 'active'),
  ('커뮤니티 이용 약관', '커뮤니티 이용에 대한 약관입니다.', 1, 1, 'active');

-- 3. spec 테이블에 샘플 데이터 삽입
INSERT INTO spec (title) VALUES
  ('영어 능통'),
  ('프로그래밍 경험 2년 이상'),
  ('석사 학위 소지자'),
  ('프로젝트 관리 경험'),
  ('데이터 분석 능력');

-- 4. user 테이블에 샘플 데이터 삽입
INSERT INTO user (name, nickname, password, birthdate, phone_number, email, profile_image) VALUES
  ('홍길동', '길동이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1990-01-01', '010-0000-0000', 'hong@example.com', 'profile1.jpg'),
  ('이몽룡', '몽룡이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1992-02-02', '010-0000-0001', 'lee@example.com', 'profile2.jpg'),
  ('성춘향', '춘향이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1994-03-03', '010-0000-0002', 'sung@example.com', 'profile3.jpg'),
  ('임꺽정', '꺽정이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1988-04-04', '010-0000-0003', 'lim@example.com', 'profile4.jpg'),
  ('장보고', '보고', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1985-05-05', '010-0000-0004', 'jang@example.com', 'profile5.jpg'),
  ('김유신', '유신이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1991-06-06', '010-0000-0005', 'kim@example.com', 'profile6.jpg'),
  ('박보검', '보검이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1993-07-07', '010-0000-0006', 'park@example.com', 'profile7.jpg'),
  ('최지우', '지우이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1995-08-08', '010-0000-0007', 'choi@example.com', 'profile8.jpg'),
  ('정우성', '우성이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1989-09-09', '010-0000-0008', 'jung@example.com', 'profile9.jpg'),
  ('손흥민', '흥민이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1996-10-10', '010-0000-0009', 'son@example.com', 'profile10.jpg'),
  ('홍길순', '길순이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1990-11-11', '010-0000-0010', 'hongs@example.com', 'profile11.jpg'),
  ('이시영', '시영이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1992-12-12', '010-0000-0011', 'lee@example2.com', 'profile12.jpg'),
  ('박신혜', '신혜이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1994-01-13', '010-0000-0012', 'park@example2.com', 'profile13.jpg'),
  ('김혜수', '혜수이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1988-02-14', '010-0000-0013', 'kim@example2.com', 'profile14.jpg'),
  ('최강창민', '강창민이', '$2b$12$Z3Nx4eWqGZeHY8IANPkbgeEBXM71dySrabk6pzHtwTThsQWxVsE6e', '1985-03-15', '010-0000-0014', 'choi@example3.com', 'profile15.jpg');
-- 5. calendar 테이블에 샘플 데이터 삽입
INSERT INTO calendar () VALUES
  (), (), (), (), ();

-- 6. contest 테이블에 샘플 데이터 삽입
INSERT INTO contest (title, subtitle, description, host, location, online_offline_type, application_start_date, application_end_date, start_date, end_date) VALUES
  ('AI 해커톤', '인공지능 개발 대회', 'AI 기술을 활용한 해커톤 대회입니다.', '한국정보산업협회', ST_GeomFromText('POINT(126.9780 37.5665)'), '오프라인', '2023-11-01 09:00:00', '2023-11-30 18:00:00', '2023-12-05 09:00:00', '2023-12-07 18:00:00'),
  ('웹 개발 경진대회', '웹 개발 능력 평가', '웹 개발 능력을 평가하는 대회입니다.', '한국소프트웨어산업협회', ST_GeomFromText('POINT(129.0756 35.1796)'), '온라인', '2023-10-01 09:00:00', '2023-10-31 18:00:00', '2023-11-05 09:00:00', '2023-11-07 18:00:00'),
  ('IoT 경진대회', '사물인터넷 기술 경진', 'IoT 기술을 활용한 경진대회입니다.', '전자통신연구원', ST_GeomFromText('POINT(128.6014 35.8722)'), '오프라인', '2023-09-01 09:00:00', '2023-09-30 18:00:00', '2023-10-05 09:00:00', '2023-10-07 18:00:00'),
  ('게임 개발 대회', '게임 개발 능력 평가', '게임 개발 능력을 평가하는 대회입니다.', '한국게임산업협회', ST_GeomFromText('POINT(126.7052 37.4563)'), '온라인', '2023-08-01 09:00:00', '2023-08-31 18:00:00', '2023-09-05 09:00:00', '2023-09-07 18:00:00'),
  ('로봇 경진대회', '로봇 기술 경진', '로봇 기술을 활용한 경진대회입니다.', '로봇산업진흥원', ST_GeomFromText('POINT(126.8530 35.1595)'), '오프라인', '2023-07-01 09:00:00', '2023-07-31 18:00:00', '2023-08-05 09:00:00', '2023-08-07 18:00:00');

-- 7. studyroom 테이블에 샘플 데이터 삽입
INSERT INTO studyroom (title, subtitle, area_id, profile_image, target_type, target_id, status) VALUES
  ('AI 해커톤 스터디룸', 'AI 해커톤 준비', 1, 'studyroom1.jpg', 'contest', 1, 'active'),
  ('웹 개발 스터디룸', '웹 개발 공부', 2, 'studyroom2.jpg', 'contest', 2, 'active'),
  ('IoT 스터디룸', 'IoT 기술 공유', 3, 'studyroom3.jpg', 'contest', 3, 'active'),
  ('게임 개발 스터디룸', '게임 개발 학습', 4, 'studyroom4.jpg', 'contest', 4, 'active'),
  ('로봇 기술 스터디룸', '로봇 기술 연구', 5, 'studyroom5.jpg', 'contest', 5, 'active');

-- 8. studyroom_videocall 테이블에 샘플 데이터 삽입
INSERT INTO studyroom_videocall () VALUES
  (), (), (), (), ();

-- 9. todo 테이블에 샘플 데이터 삽입
INSERT INTO todo (deadline, title, subtitle, content, creater_id, status) VALUES
  ('2023-12-31 23:59:59', '프로젝트 계획 수립', '초기 계획', '프로젝트 초기 계획을 수립합니다.', 1, '진행 중'),
  ('2024-01-15 18:00:00', '데이터 분석', '데이터 수집 및 분석', '데이터를 수집하고 분석합니다.', 2, '진행 중'),
  ('2024-02-28 17:00:00', '보고서 작성', '최종 보고서', '최종 결과를 보고서로 작성합니다.', 3, '진행 중'),
  ('2024-03-15 12:00:00', '발표 준비', '발표 자료 준비', '발표를 위한 자료를 준비합니다.', 4, '진행 중'),
  ('2024-04-01 09:00:00', '코드 리뷰', '코드 검토', '코드를 리뷰하고 개선점을 찾습니다.', 5, '진행 중');

-- 10. kakao_user_info 테이블에 샘플 데이터 삽입
INSERT INTO kakao_user_info (kakao_id, nickname, profile_image_url, email) VALUES
  (100001, '카카오유저1', 'http://example.com/profile1.jpg', 'kakao1@example.com'),
  (100002, '카카오유저2', 'http://example.com/profile2.jpg', 'kakao2@example.com'),
  (100003, '카카오유저3', 'http://example.com/profile3.jpg', 'kakao3@example.com'),
  (100004, '카카오유저4', 'http://example.com/profile4.jpg', 'kakao4@example.com'),
  (100005, '카카오유저5', 'http://example.com/profile5.jpg', 'kakao5@example.com');

-- 11. email_verification_code 테이블에 샘플 데이터 삽입
INSERT INTO email_verification_code (email, code) VALUES
  ('hong@example.com', 'CODE1234'),
  ('lee@example.com', 'CODE2345'),
  ('sung@example.com', 'CODE3456'),
  ('lim@example.com', 'CODE4567'),
  ('jang@example.com', 'CODE5678');

-- 12. schedule 테이블에 샘플 데이터 삽입
INSERT INTO schedule (calendar_id, starts_at, ends_at, location, memo) VALUES
  (1, '2023-11-01 09:00:00', '2023-11-01 11:00:00', '회의실 A', '프로젝트 킥오프 미팅'),
  (2, '2023-11-02 14:00:00', '2023-11-02 15:00:00', '온라인', '데일리 스탠드업 미팅'),
  (3, '2023-11-03 10:00:00', '2023-11-03 12:00:00', '강의실 B', '기술 세미나'),
  (4, '2023-11-04 16:00:00', '2023-11-04 17:30:00', '카페 C', '클라이언트 미팅'),
  (5, '2023-11-05 13:00:00', '2023-11-05 14:30:00', '온라인', '팀원 교육 세션');

-- 13. user_area 테이블에 샘플 데이터 삽입
INSERT INTO user_area (user_id, area_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- 14. user_calendar 테이블에 샘플 데이터 삽입
INSERT INTO user_calendar (user_id, calendar_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- 15. user_spec 테이블에 샘플 데이터 삽입
INSERT INTO user_spec (user_id, spec_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- 16. user_studyroom 테이블에 샘플 데이터 삽입
INSERT INTO user_studyroom (studyroom_id, user_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- 17. user_term 테이블에 샘플 데이터 삽입
-- 사용자 1
INSERT INTO user_term (term_id, user_id, is_agreed) VALUES
  (1, 1, 1),
  (2, 1, 1),
  (3, 1, 1),
  (4, 1, 1),
  (5, 1, 1);
-- 사용자 2
INSERT INTO user_term (term_id, user_id, is_agreed) VALUES
  (1, 2, 1),
  (2, 2, 1),
  (5, 2, 1);
-- 사용자 3
INSERT INTO user_term (term_id, user_id, is_agreed) VALUES
  (1, 3, 1),
  (2, 3, 1),
  (3, 3, 0),
  (4, 3, 0),
  (5, 3, 1);
-- 사용자 4
INSERT INTO user_term (term_id, user_id, is_agreed) VALUES
  (1, 4, 1),
  (2, 4, 1),
  (3, 4, 1),
  (5, 4, 1);
-- 사용자 5
INSERT INTO user_term (term_id, user_id, is_agreed) VALUES
  (1, 5, 1),
  (2, 5, 1),
  (4, 5, 1),
  (5, 5, 1);

-- 18. user_oauth 테이블에 샘플 데이터 삽입
INSERT INTO user_oauth (user_id, oauth_type, oauth_id) VALUES
  (1, 'kakao', 'oauth1'),
  (2, 'google', 'oauth2'),
  (3, 'naver', 'oauth3'),
  (4, 'facebook', 'oauth4'),
  (5, 'github', 'oauth5');

-- 19. user_refresh_token 테이블에 샘플 데이터 삽입
INSERT INTO user_refresh_token (user_id, refresh_token) VALUES
  (1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNmJ5T1RMbnA2cUZxS29BZktKMEN6NnZVMjV4bEVsZWJnTDBKWWphTkw4WiIsImlhdCI6MTczMzQ5MjcwNSwiZXhwIjoxNzM0MDk3NTA1fQ.JRqcQRlI0_a9kJWx52LP_JkhTBQPq3THDDTNPfq5414'),
  (2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiaFkyQVdheVgxNWFOR2hHUGVtUmJQN25RVUc5YU5pT2JSREludk1Wdml3UCIsImlhdCI6MTczMzQ5MjcwNSwiZXhwIjoxNzM0MDk3NTA1fQ.GdFc6QMiXYHLIWuP4v-CK5Sjxt20DqoxRImg50xDztk'),
  (3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiSUg1TFEwVHhrQk5nSlJ5aXpuZDJIQWVTN2RvSEM3allETlRKbndoelo1dCIsImlhdCI6MTczMzQ5MjcwNSwiZXhwIjoxNzM0MDk3NTA1fQ.1M3oZNd5nYS2Wa9aMtQmPQX06f0XvjUPlmX_8noMDBY'),
  (4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiVzFIUTdBRnJMbEc1dFp6bG43NWJpTURnN3V6SkJJckJMd3Zkc3dKcDJldyIsImlhdCI6MTczMzQ5MjcwNSwiZXhwIjoxNzM0MDk3NTA1fQ.gGwOuE_W6QwMJCxV2sJjN2VofkmRxNcB9bxFBPAEhDM'),
  (5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiQWRaczR4RWtHT2xuNFY5MzVBRkN4NzRkN1RWc1g5WEF0OUZwcjNQeVlGcCIsImlhdCI6MTczMzQ5MjcwNSwiZXhwIjoxNzM0MDk3NTA1fQ.Jn8sbYKdBkuYFDI-aJPDcM3O6RzPWy8HtubDMCvOEfc'),
  (6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoieGpxaU1qTmlYZmNMWTFQQWpmejlqUVNrVlhxZ2EyNjlhSGVINVV4TDkyOSIsImlhdCI6MTczMzQ5MjcwNSwiZXhwIjoxNzM0MDk3NTA1fQ.O-zK1GArALS7t-uFN6WkGMPI8tSCWX7LCBrmPUM431s');

-- 20. user_verified_email 테이블에 샘플 데이터 삽입
INSERT INTO user_verified_email (user_id, verified_email, verification_type, status) VALUES
  (1, 'hong@example.com', 'signup', 'verified'),
  (2, 'lee@example.com', 'signup', 'verified'),
  (3, 'sung@example.com', 'signup', 'verified'),
  (4, 'lim@example.com', 'signup', 'verified'),
  (5, 'jang@example.com', 'signup', 'verified');

-- 21. board 테이블에 샘플 데이터 삽입
INSERT INTO board (title, content, author, image_url) VALUES
  ('공지사항 1', '첫 번째 공지사항입니다.', 1, 'board1.jpg'),
  ('공지사항 2', '두 번째 공지사항입니다.', 2, 'board2.jpg'),
  ('공지사항 3', '세 번째 공지사항입니다.', 3, 'board3.jpg'),
  ('공지사항 4', '네 번째 공지사항입니다.', 4, 'board4.jpg'),
  ('공지사항 5', '다섯 번째 공지사항입니다.', 5, 'board5.jpg');

-- 22. contest_calendar 테이블에 샘플 데이터 삽입
INSERT INTO contest_calendar (contest_id, calendar_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- 23. contest_question 테이블에 샘플 데이터 삽입
INSERT INTO contest_question (contest_id, user_id, title, content) VALUES
  (1, 1, '질문 1', '첫 번째 질문입니다.'),
  (2, 2, '질문 2', '두 번째 질문입니다.'),
  (3, 3, '질문 3', '세 번째 질문입니다.'),
  (4, 4, '질문 4', '네 번째 질문입니다.'),
  (5, 5, '질문 5', '다섯 번째 질문입니다.');

-- 24. inquiry 테이블에 샘플 데이터 삽입
INSERT INTO inquiry (user_id, title, content, image_url, read_at, answered_at, status) VALUES
  (1, '문의 1', '첫 번째 문의 내용입니다.', 'inquiry1.jpg', '2023-11-01 10:00:00', '2023-11-02 15:00:00', 'answered'),
  (2, '문의 2', '두 번째 문의 내용입니다.', 'inquiry2.jpg', '2023-11-03 11:00:00', '2023-11-04 16:00:00', 'answered'),
  (3, '문의 3', '세 번째 문의 내용입니다.', 'inquiry3.jpg', '2023-11-05 12:00:00', '2023-11-06 17:00:00', 'answered'),
  (4, '문의 4', '네 번째 문의 내용입니다.', 'inquiry4.jpg', '2023-11-07 13:00:00', '2023-11-08 18:00:00', 'answered'),
  (5, '문의 5', '다섯 번째 문의 내용입니다.', 'inquiry5.jpg', '2023-11-09 14:00:00', '2023-11-10 19:00:00', 'answered');

-- 25. studyroom_chat 테이블에 샘플 데이터 삽입
INSERT INTO studyroom_chat (sender_id, studyroom_id, type, content) VALUES
  (1, 1, 'text', '안녕하세요, 스터디 시작하겠습니다.'),
  (2, 2, 'text', '오늘 회의 시간은 언제인가요?'),
  (3, 3, 'text', '자료 공유 부탁드립니다.'),
  (4, 4, 'text', '질문이 있습니다.'),
  (5, 5, 'text', '다음 주 일정 조율합시다.');

-- 26. studyroom_member 테이블에 샘플 데이터 삽입
INSERT INTO studyroom_member (studyroom_id, user_id, role, status) VALUES
  (1, 1, 'leader', 'active'),
  (2, 2, 'member', 'active'),
  (3, 3, 'member', 'active'),
  (4, 4, 'member', 'active'),
  (5, 5, 'member', 'active');

-- 27. studyroom_videocall_member 테이블에 샘플 데이터 삽입
INSERT INTO studyroom_videocall_member (studyroom_videocall_id, member_id, type) VALUES
  (1, 1, 'host'),
  (2, 2, 'participant'),
  (3, 3, 'participant'),
  (4, 4, 'participant'),
  (5, 5, 'participant');

-- 28. todo_member 테이블에 샘플 데이터 삽입
INSERT INTO todo_member (todo_id, assigned_user_id, status, comment, photo) VALUES
  (1, 1, '진행 중', '작업 중입니다.', 'photo1.jpg'),
  (2, 2, '진행 중', '곧 완료 예정입니다.', 'photo2.jpg'),
  (3, 3, '완료', '작업 완료하였습니다.', 'photo3.jpg'),
  (4, 4, '진행 중', '문제가 발생했습니다.', 'photo4.jpg'),
  (5, 5, '진행 중', '검토 중입니다.', 'photo5.jpg');

-- 29. schedule_participant 테이블에 샘플 데이터 삽입
INSERT INTO schedule_participant (schedule_id, participant_id, type) VALUES
  (1, 1, 'attendee'),
  (2, 2, 'attendee'),
  (3, 3, 'attendee'),
  (4, 4, 'attendee'),
  (5, 5, 'attendee');

-- 30. studyroom_todo 테이블에 샘플 데이터 삽입
INSERT INTO studyroom_todo (studyroom_id, todo_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- 31. contest_board 테이블에 샘플 데이터 삽입
INSERT INTO contest_board (contest_id, board_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- 32. contest_schedule 테이블에 샘플 데이터 삽입
INSERT INTO contest_schedule (contest_id, schedule_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- 33. contest_answer 테이블에 샘플 데이터 삽입
INSERT INTO contest_answer (contest_question_id, answer_id, title, content) VALUES
  (1, 2, '답변 1', '첫 번째 답변입니다.'),
  (2, 3, '답변 2', '두 번째 답변입니다.'),
  (3, 4, '답변 3', '세 번째 답변입니다.'),
  (4, 5, '답변 4', '네 번째 답변입니다.'),
  (5, 1, '답변 5', '다섯 번째 답변입니다.');

-- 34. inquiry_answer 테이블에 샘플 데이터 삽입
INSERT INTO inquiry_answer (inquiry_id, admin_id, title, content, image_url) VALUES
  (1, 1, '답변 1', '첫 번째 문의에 대한 답변입니다.', 'answer1.jpg'),
  (2, 2, '답변 2', '두 번째 문의에 대한 답변입니다.', 'answer2.jpg'),
  (3, 3, '답변 3', '세 번째 문의에 대한 답변입니다.', 'answer3.jpg'),
  (4, 4, '답변 4', '네 번째 문의에 대한 답변입니다.', 'answer4.jpg'),
  (5, 5, '답변 5', '다섯 번째 문의에 대한 답변입니다.', 'answer5.jpg');