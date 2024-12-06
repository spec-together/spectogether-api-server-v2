-- 샘플 데이터 삽입을 위한 SQL 쿼리문

INSERT INTO spectogether.area (
  name,
  location,
  legal_areacode,
  created_at,
  updated_at
) VALUES
  (
    '서울특별시',
    ST_GeomFromText('POINT(126.9780 37.5665)'),
    '11010',
    NOW(),
    NOW()
  ),
  (
    '부산광역시',
    ST_GeomFromText('POINT(129.0756 35.1796)'),
    '26010',
    NOW(),
    NOW()
  ),
  (
    '대구광역시',
    ST_GeomFromText('POINT(128.6014 35.8722)'),
    '27010',
    NOW(),
    NOW()
  ),
  (
    '인천광역시',
    ST_GeomFromText('POINT(126.7052 37.4563)'),
    '28010',
    NOW(),
    NOW()
  ),
  (
    '광주광역시',
    ST_GeomFromText('POINT(126.8526 35.1595)'),
    '29010',
    NOW(),
    NOW()
  );