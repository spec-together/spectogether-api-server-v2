import pymysql
import random
import string
from datetime import datetime, timedelta

# 데이터베이스 연결 설정
connection = pymysql.connect(
    host='localhost',
    user='root',
    password='your_password',
    database='your_database',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

# 랜덤 문자열 생성 함수
def random_string(length):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for _ in range(length))

# 랜덤 숫자 문자열 생성 함수
def random_digits(length):
    digits = string.digits
    return ''.join(random.choice(digits) for _ in range(length))

# 랜덤 날짜 생성 함수
def random_date(start, end):
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )

try:
    with connection.cursor() as cursor:
        # 1. user 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user (name, nickname, birthdate, phone_number, email, profile_image, spec_level, manner_level)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            name = random_string(10)
            nickname = random_string(8)
            birthdate = random_date(datetime(1970, 1, 1), datetime(2000, 12, 31)).date()
            phone_number = f"010-{random_digits(4)}-{random_digits(4)}"
            email = f"{random_string(5)}@example.com"
            profile_image = f"https://example.com/profile/{random.randint(1,1000)}.jpg"
            spec_level = random.randint(1, 10)
            manner_level = random.randint(1, 10)
            cursor.execute(sql, (name, nickname, birthdate, phone_number, email, profile_image, spec_level, manner_level))

        # 2. term 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO term (name, description, is_required, term_version, status)
            VALUES (%s, %s, %s, %s, %s)
            """
            name = f"이용약관_{random_string(5)}"
            description = f"이용약관 내용 {random_string(20)}"
            is_required = random.choice([True, False])
            term_version = random.randint(1, 5)
            status = random.choice(['active', 'inactive'])
            cursor.execute(sql, (name, description, is_required, term_version, status))

        # 3. area 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO area (name, location, legal_areacode)
            VALUES (%s, ST_GeomFromText('POINT(%s %s)'), %s)
            """
            name = f"지역_{random_string(5)}"
            lat = random.uniform(-90, 90)
            lon = random.uniform(-180, 180)
            legal_areacode = random_digits(5)
            cursor.execute(sql, (name, lat, lon, legal_areacode))

        # 4. spec 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO spec (title)
            VALUES (%s)
            """
            title = f"스펙_{random_string(5)}"
            cursor.execute(sql, (title,))

        # 5. email_verification_code 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO email_verification_code (email, code)
            VALUES (%s, %s)
            """
            email = f"{random_string(5)}@example.com"
            code = random_digits(6)
            cursor.execute(sql, (email, code))

        # 6. calendar 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO calendar ()
            VALUES ()
            """
            cursor.execute(sql)

        # 7. contest 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO contest (title, subtitle, description, host, location, online_offline_type, application_start_date, application_end_date, start_date, end_date)
            VALUES (%s, %s, %s, %s, ST_GeomFromText('POINT(%s %s)'), %s, %s, %s, %s, %s)
            """
            title = f"대회_{random_string(5)}"
            subtitle = f"부제_{random_string(5)}"
            description = f"대회 설명 {random_string(20)}"
            host = f"주최자_{random_string(5)}"
            lat = random.uniform(-90, 90)
            lon = random.uniform(-180, 180)
            online_offline_type = random.choice(['online', 'offline', 'both'])
            app_start_date = random_date(datetime.now(), datetime.now() + timedelta(days=30))
            app_end_date = app_start_date + timedelta(days=random.randint(1,10))
            start_date = app_end_date + timedelta(days=1)
            end_date = start_date + timedelta(days=random.randint(1,5))
            cursor.execute(sql, (title, subtitle, description, host, lat, lon, online_offline_type, app_start_date, app_end_date, start_date, end_date))

        # 8. studyroom_videocall 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO studyroom_videocall ()
            VALUES ()
            """
            cursor.execute(sql)

        # 9. user_term 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user_term (term_id, user_id, is_agreed)
            VALUES (%s, %s, %s)
            """
            term_id = random.randint(1, 100)
            user_id = random.randint(1, 100)
            is_agreed = random.choice([True, False])
            cursor.execute(sql, (term_id, user_id, is_agreed))

        # 10. user_spec 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user_spec (user_id, spec_id)
            VALUES (%s, %s)
            """
            user_id = random.randint(1, 100)
            spec_id = random.randint(1, 100)
            cursor.execute(sql, (user_id, spec_id))

        # 11. user_area 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user_area (user_id, area_id)
            VALUES (%s, %s)
            """
            user_id = random.randint(1, 100)
            area_id = random.randint(1, 100)
            cursor.execute(sql, (user_id, area_id))

        # 12. user_oauth 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user_oauth (user_id, oauth_type, oauth_id)
            VALUES (%s, %s, %s)
            """
            user_id = random.randint(1, 100)
            oauth_type = random.choice(['google', 'facebook', 'kakao', 'naver'])
            oauth_id = random_string(15)
            cursor.execute(sql, (user_id, oauth_type, oauth_id))

        # 13. user_verified_email 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user_verified_email (user_id, verified_email, verification_type, status)
            VALUES (%s, %s, %s, %s)
            """
            user_id = random.randint(1, 100)
            verified_email = f"{random_string(5)}@example.com"
            verification_type = random.choice(['registration', 'password_reset'])
            status = random.choice(['verified', 'unverified'])
            cursor.execute(sql, (user_id, verified_email, verification_type, status))

        # 14. user_refresh_token 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user_refresh_token (user_id, refresh_token)
            VALUES (%s, %s)
            """
            user_id = random.randint(1, 100)
            refresh_token = random_string(50)
            cursor.execute(sql, (user_id, refresh_token))

        # 15. studyroom 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO studyroom (title, subtitle, area_id, profile_image, target_type, target_id, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            title = f"스터디룸_{random_string(5)}"
            subtitle = f"부제_{random_string(5)}"
            area_id = random.randint(1, 100)
            profile_image = f"https://example.com/studyroom/{random.randint(1,1000)}.jpg"
            target_type = random.choice(['type1', 'type2', 'type3'])
            target_id = random.randint(1, 100)
            status = random.choice(['active', 'inactive', 'closed'])
            cursor.execute(sql, (title, subtitle, area_id, profile_image, target_type, target_id, status))

        # 16. user_studyroom 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user_studyroom (studyroom_id, user_id)
            VALUES (%s, %s)
            """
            studyroom_id = random.randint(1, 100)
            user_id = random.randint(1, 100)
            cursor.execute(sql, (studyroom_id, user_id))

        # 17. studyroom_member 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO studyroom_member (studyroom_id, user_id, role, status)
            VALUES (%s, %s, %s, %s)
            """
            studyroom_id = random.randint(1, 100)
            user_id = random.randint(1, 100)
            role = random.choice(['member', 'admin', 'guest'])
            status = random.choice(['active', 'inactive'])
            cursor.execute(sql, (studyroom_id, user_id, role, status))

        # 18. studyroom_calendar 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO studyroom_calendar (studyroom_id, calendar_id)
            VALUES (%s, %s)
            """
            studyroom_id = random.randint(1, 100)
            calendar_id = random.randint(1, 100)
            cursor.execute(sql, (studyroom_id, calendar_id))

        # 19. schedule 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO schedule (calendar_id, starts_at, ends_at, location, memo)
            VALUES (%s, %s, %s, %s, %s)
            """
            calendar_id = random.randint(1, 100)
            starts_at = random_date(datetime.now(), datetime.now() + timedelta(days=30))
            ends_at = starts_at + timedelta(hours=random.randint(1, 5))
            location = f"장소_{random_string(5)}"
            memo = f"메모_{random_string(20)}"
            cursor.execute(sql, (calendar_id, starts_at, ends_at, location, memo))

        # 20. schedule_participant 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO schedule_participant (schedule_id, participant_id, type)
            VALUES (%s, %s, %s)
            """
            schedule_id = random.randint(1, 100)
            participant_id = random.randint(1, 100)
            type = random.choice(['attendee', 'organizer'])
            cursor.execute(sql, (schedule_id, participant_id, type))

        # 21. contest_calendar 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO contest_calendar (contest_id, calendar_id)
            VALUES (%s, %s)
            """
            contest_id = random.randint(1, 100)
            calendar_id = random.randint(1, 100)
            cursor.execute(sql, (contest_id, calendar_id))

        # 22. contest_schedule 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO contest_schedule (contest_id, schedule_id)
            VALUES (%s, %s)
            """
            contest_id = random.randint(1, 100)
            schedule_id = random.randint(1, 100)
            cursor.execute(sql, (contest_id, schedule_id))

        # 23. user_calendar 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO user_calendar (user_id, calendar_id)
            VALUES (%s, %s)
            """
            user_id = random.randint(1, 100)
            calendar_id = random.randint(1, 100)
            cursor.execute(sql, (user_id, calendar_id))

        # 24. todo 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO todo (deadline, title, subtitle, content, creater_id, status)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            deadline = random_date(datetime.now(), datetime.now() + timedelta(days=30))
            title = f"할일_{random_string(5)}"
            subtitle = f"부제_{random_string(5)}"
            content = f"내용_{random_string(20)}"
            creater_id = random.randint(1, 100)
            status = random.choice(['pending', 'completed'])
            cursor.execute(sql, (deadline, title, subtitle, content, creater_id, status))

        # 25. studyroom_todo 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO studyroom_todo (studyroom_id, todo_id)
            VALUES (%s, %s)
            """
            studyroom_id = random.randint(1, 100)
            todo_id = random.randint(1, 100)
            cursor.execute(sql, (studyroom_id, todo_id))

        # 26. todo_member 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO todo_member (todo_id, assigned_user_id, status, comment, photo)
            VALUES (%s, %s, %s, %s, %s)
            """
            todo_id = random.randint(1, 100)
            assigned_user_id = random.randint(1, 100)
            status = random.choice(['pending', 'completed'])
            comment = f"코멘트_{random_string(20)}"
            photo = f"https://example.com/photo/{random.randint(1,1000)}.jpg"
            cursor.execute(sql, (todo_id, assigned_user_id, status, comment, photo))

        # 27. contest_question 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO contest_question (contest_id, user_id, title, content)
            VALUES (%s, %s, %s, %s)
            """
            contest_id = random.randint(1, 100)
            user_id = random.randint(1, 100)
            title = f"질문_{random_string(5)}"
            content = f"질문 내용_{random_string(20)}"
            cursor.execute(sql, (contest_id, user_id, title, content))

        # 28. contest_answer 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO contest_answer (contest_question_id, answer_id, title, content)
            VALUES (%s, %s, %s, %s)
            """
            contest_question_id = random.randint(1, 100)
            answer_id = random.randint(1, 100)
            title = f"답변_{random_string(5)}"
            content = f"답변 내용_{random_string(20)}"
            cursor.execute(sql, (contest_question_id, answer_id, title, content))

        # 29. board 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO board (title, content, author, image_url)
            VALUES (%s, %s, %s, %s)
            """
            title = f"게시글_{random_string(5)}"
            content = f"내용_{random_string(20)}"
            author = random.randint(1, 100)
            image_url = f"https://example.com/board/{random.randint(1,1000)}.jpg"
            cursor.execute(sql, (title, content, author, image_url))

        # 30. contest_board 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO contest_board (contest_id, board_id)
            VALUES (%s, %s)
            """
            contest_id = random.randint(1, 100)
            board_id = random.randint(1, 100)
            cursor.execute(sql, (contest_id, board_id))

        # 31. inquiry 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO inquiry (user_id, title, content, image_url, read_at, answered_at, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            user_id = random.randint(1, 100)
            title = f"문의_{random_string(5)}"
            content = f"문의 내용_{random_string(20)}"
            image_url = f"https://example.com/inquiry/{random.randint(1,1000)}.jpg"
            read_at = random_date(datetime.now() - timedelta(days=10), datetime.now())
            answered_at = read_at + timedelta(days=random.randint(0,2))
            status = random.choice(['pending', 'read', 'answered'])
            cursor.execute(sql, (user_id, title, content, image_url, read_at, answered_at, status))

        # 32. inquiry_answer 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO inquiry_answer (inquiry_id, admin_id, title, content, image_url)
            VALUES (%s, %s, %s, %s, %s)
            """
            inquiry_id = random.randint(1, 100)
            admin_id = random.randint(1, 100)
            title = f"답변_{random_string(5)}"
            content = f"답변 내용_{random_string(20)}"
            image_url = f"https://example.com/inquiry_answer/{random.randint(1,1000)}.jpg"
            cursor.execute(sql, (inquiry_id, admin_id, title, content, image_url))

        # 33. studyroom_videocall_member 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO studyroom_videocall_member (studyroom_videocall_id, member_id, type)
            VALUES (%s, %s, %s)
            """
            studyroom_videocall_id = random.randint(1, 100)
            member_id = random.randint(1, 100)
            type = random.choice(['participant', 'host'])
            cursor.execute(sql, (studyroom_videocall_id, member_id, type))

        # 34. studyroom_chat 테이블에 데이터 삽입
        for _ in range(100):
            sql = """
            INSERT INTO studyroom_chat (sender_id, studyroom_id, type, content)
            VALUES (%s, %s, %s, %s)
            """
            sender_id = random.randint(1, 100)
            studyroom_id = random.randint(1, 100)
            chat_type = random.choice(['text', 'image', 'file'])
            content = f"메시지_{random_string(50)}"
            cursor.execute(sql, (sender_id, studyroom_id, chat_type, content))

        # 변경 사항 커밋
        connection.commit()
except Exception as e:
    print(f"오류 발생: {e}")
    connection.rollback()
finally:
    connection.close()