import requests
from bs4 import BeautifulSoup

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
        url = f"https://onoffmix.com/event/main/?interest={interest}&page={page}" # 크롤링 대상 URL
        # HTTP 요청 보내기
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Whale/3.28.266.14 Safari/537.36'
        }
        response = requests.get(url, headers=headers) # 웹 브라우저의 헤더를 달아야 정상적으로 접속 가능
        soup = BeautifulSoup(response.content, "html.parser")

        event_list = soup.find("ul", class_="event_lists thumbnail_mode") # 현재 페이지에 존재하는 전체 이벤트 목록
        lis = event_list.find_all("li")

        if len(lis) == 0: # 더이상 해당 카테고리에 이벤트가 없으면 반복문 종료
            break

        for li in lis: # 각 onoffmix 이벤트에 접근하며
            href = li.find("a").attrs["href"] # 해당 이벤트 상세 페이지 URL 접속
            sub_page_url = f"https://onoffmix.com{href}"
            sub_page_response = requests.get(sub_page_url, headers=headers)
            sub_page_soup = BeautifulSoup(sub_page_response.content, "html.parser")

            # 상세 페이지에 있는 세부 내용 크롤링
            image = sub_page_soup.find("div", class_="event_thumbnail main_thumbnail").find("img").attrs["src"]
            title = sub_page_soup.find("h3", class_="event_title").text.strip()
            sub_title = sub_page_soup.find("p", class_="summary_txt").text.strip()
            host = sub_page_soup.find("div", class_="host_name_wrap").text.strip()
            location_tag = sub_page_soup.find("p", class_="description place")
            location = "" if location_tag == None else location_tag.find("span").text.strip()
            date_tag = sub_page_soup.find("p", class_="description date")
            date = "" if date_tag == None else date_tag.text.replace("구글 캘린더 저장", "").strip()
            application_date_tag = sub_page_soup.find("li", class_="etc_group date")
            application_date = "" if application_date_tag == None else application_date_tag.text.strip()

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