import requests
from bs4 import BeautifulSoup
import pymysql
import random
from datetime import datetime, timedelta


def generate_random_dates():
  dates = sorted([datetime.now() + timedelta(days=random.randint(1, 30)) for _ in range(4)])
  return tuple(date.strftime('%Y-%m-%d %H:%M:%S') for date in dates)

def generate_random_point():
  lat = random.uniform(-90.0, 90.0)
  lon = random.uniform(-180.0, 180.0)
  return f"POINT({lon} {lat})"

# MySQL 연결 설정
db = pymysql.connect(
    host='skyofseoul.synology.me',
    port=40003,
    user='root',
    password='root_sesac_mysql',
    database='spectogether',
    charset='utf8mb4'
)
cursor = db.cursor()

# # 테이블 생성 (필요 시)
# create_table_query = """
# CREATE TABLE IF NOT EXISTS events (
#     id INT AUTO_INCREMENT PRIMARY KEY,
#     category VARCHAR(50),
#     page INT,
#     link VARCHAR(255),
#     image VARCHAR(255),
#     title VARCHAR(255),
#     subtitle VARCHAR(255),
#     host VARCHAR(100),
#     location VARCHAR(100),
#     date VARCHAR(100),
#     application_date VARCHAR(100)
# )
# """
# cursor.execute(create_table_query)

# 핵심 파라미터 설정
interest_mapping = {
    "A0101": "비즈니스/스타트업", "A0102": "경제/금융/투자", "A0103": "과학/IT/AI",
    "A0104": "마케팅/PR", "A0105": "자기계발/학습/독서", "A0106": "사회/역사",
    "A0107": "인문/심리", "A0108": "문화/예술/디자인", "A0109": "영화/드라마/미디어",
    "A0110": "게임", "A0111": "패션/뷰티", "A0112": "여행/레저",
    "A0113": "운동/건강/웰빙", "A0114": "자연/환경", "A0115": "가족/육아",
    "A0116": "동식물/반려동물", "A0117": "음식/음료", "A0118": "DIY/공예",
    "A0119": "종교", "A0199": "기타"
}
interests = list(interest_mapping.keys()) # 전체 카테고리 ID 리스트

for interest in interests:
    max_page = int(1e9) # 더이상 해당 카테고리에 이벤트가 없을 때까지 크롤링
    for page in range(max_page):
        try:
            url = f"https://onoffmix.com/event/main/?interest={interest}&page={page}" # 크롤링 대상 URL
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Whale/3.28.266.14 Safari/537.36'
            }
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")

            event_list = soup.find("ul", class_="event_lists thumbnail_mode")
            if not event_list:
                break
            lis = event_list.find_all("li")

            if len(lis) == 0:
                break

            for li in lis:
                try:
                    href = li.find("a").attrs["href"]
                    sub_page_url = f"https://onoffmix.com{href}"
                    sub_page_response = requests.get(sub_page_url, headers=headers)
                    sub_page_response.raise_for_status()
                    sub_page_soup = BeautifulSoup(sub_page_response.content, "html.parser")

                    image = sub_page_soup.find("div", class_="event_thumbnail main_thumbnail").find("img").attrs["src"]
                    title = sub_page_soup.find("h3", class_="event_title").text.strip()
                    sub_title = sub_page_soup.find("p", class_="summary_txt").text.strip()
                    host = sub_page_soup.find("div", class_="host_name_wrap").text.strip()
                    location_tag = sub_page_soup.find("p", class_="description place")
                    location = "" if location_tag is None else location_tag.find("span").text.strip()
                    date_tag = sub_page_soup.find("p", class_="description date")
                    date = "" if date_tag is None else date_tag.text.replace("구글 캘린더 저장", "").strip()
                    application_date_tag = sub_page_soup.find("li", class_="etc_group date")
                    application_date = "" if application_date_tag is None else application_date_tag.text.strip()
                    

                    application_start_date, application_end_date, start_date, end_date = generate_random_dates()

                    # 데이터베이스에 삽입
                    insert_query = """
                    INSERT INTO contest (title, subtitle, description, host, location, online_offline_type, application_start_date, application_end_date, start_date, end_date, image_url, application_url)
                    VALUES (%s, %s, %s, %s, ST_GeomFromText(%s), %s, %s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(insert_query, (
                        title, sub_title, f"{title} {sub_title}", host, generate_random_point(), "offline", application_start_date, application_end_date, start_date, end_date, image, sub_page_url
                    ))
                    db.commit()

                    print("< 이벤트 >")
                    print("[카테고리]", interest_mapping[interest])
                    print("[현재 페이지]", page + 1)
                    print("이벤트 링크:", sub_page_url)
                    print("이벤트 이미지:", image)
                    print("이벤트 제목:", title)
                    print("이벤트 소제목:", sub_title)
                    print("이벤트 주최자:", host)
                    print("이벤트 장소:", location)
                    print("이벤트 일정:", date)
                    print("이벤트 모집 일정:", application_date)
                except Exception as e:
                    print(f"이벤트 처리 중 오류 발생: {e}")
                    continue
        except Exception as e:
            print(f"페이지 {page}에서 오류 발생: {e}")
            break

cursor.close()
db.close()