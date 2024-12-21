# Database 수정이력

1. user : password 컬럼이 없었음
2. user : spec_level, manner_level에 default value 부여 (speclevel = 1, manner_level = 36.5)
3. user : phone_number에 unique 추가

4. ...

5. sturyroom 의 target_type, target_id 를 사용해 contest, spec 테이블과 다형성 관계 구현한 것을
   contest_id, spec_id 컬럼으로 변경해 FK 로 연결한다. 추가로 FK는 Nullable로 설정하고 트리거를 정의해 두 컬럼 중 하나만 값을 같도록 구현한다.

```MYSQL
SELECT * FROM information_schema.TRIGGERS;


ALTER TABLE studyroom
  DROP COLUMN target_type, -- 기존 target_type 컬럼 제거
  DROP COLUMN target_id,   -- 기존 target_id 컬럼 제거
  ADD COLUMN contest_id BIGINT NULL, -- 새로운 contest_id 컬럼 추가
  ADD COLUMN spec_id BIGINT NULL,    -- 새로운 spec_id 컬럼 추가
  ADD CONSTRAINT fk_contest_id FOREIGN KEY (contest_id) REFERENCES contest(contest_id),
  ADD CONSTRAINT fk_spec_id FOREIGN KEY (spec_id) REFERENCES spec(spec_id);


DELIMITER //

CREATE TRIGGER check_studyroom_before_insert
BEFORE INSERT ON studyroom
FOR EACH ROW
BEGIN
  IF (NEW.contest_id IS NOT NULL AND NEW.spec_id IS NOT NULL) OR (NEW.contest_id IS NULL AND NEW.spec_id IS NULL) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Either contest_id or spec_id must be set, but not both.';
  END IF;
END //

CREATE TRIGGER check_studyroom_before_update
BEFORE UPDATE ON studyroom
FOR EACH ROW
BEGIN
  IF (NEW.contest_id IS NOT NULL AND NEW.spec_id IS NOT NULL) OR (NEW.contest_id IS NULL AND NEW.spec_id IS NULL) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Either contest_id or spec_id must be set, but not both.';
  END IF;
END //

DELIMITER ;


SELECT * FROM information_schema.TRIGGERS;
```
