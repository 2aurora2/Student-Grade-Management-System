-- 新建课程
CREATE OR REPLACE FUNCTION insert_course(
    p_name IN course_tb.name%TYPE,
    p_credit IN course_tb.credit%TYPE,
    p_daily_ratio IN course_tb.daily_ratio%TYPE
) RETURN course_tb.id%TYPE
IS v_id course_tb.id%TYPE;
BEGIN
-- 插入数据到课程表
INSERT INTO course_tb (name, credit, daily_ratio)
    VALUES (p_name, p_credit, p_daily_ratio)
        RETURNING id INTO v_id;  -- 获取自增主键的值

DBMS_OUTPUT.PUT_LINE('插入课程成功，课程ID为: '  || v_id);
COMMIT;  -- 提交事务，确保数据持久化
RETURN v_id;  -- 返回插入记录的主键值
EXCEPTION
    WHEN OTHERS THEN
ROLLBACK;  -- 如果出现异常，回滚事务，并返回-1
DBMS_OUTPUT.PUT_LINE('插入课程失败，具体错误信息: ' || SQLERRM);
RETURN -1;
END;
/

-- 删除课程
CREATE OR REPLACE FUNCTION delete_course_by_id(p_course_id NUMBER)
    RETURN NUMBER IS
    v_count NUMBER;
BEGIN
    -- 先检查要删除的课程id是否存在
    SELECT COUNT(*)
    INTO v_count
    FROM course_tb
    WHERE id = p_course_id;

    IF v_count > 0 THEN
        -- 如果存在则执行删除操作
        DELETE FROM course_tb
        WHERE id = p_course_id;
        COMMIT;
        -- 返回表示成功删除的代码（这里可以自定义合适的值，比如1表示成功）
        RETURN 1;
    ELSE
        -- 如果不存在，返回表示未找到对应课程的代码（这里可以自定义合适的值，比如 -1表示没找到）
        RETURN -1;
    END IF;
END;
/

-- 根据课程名称查询课程列表
CREATE OR REPLACE FUNCTION get_course_class_count(p_course_name IN VARCHAR2 DEFAULT NULL) RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
    v_sql VARCHAR2(4000);
BEGIN
    -- 根据参数是否为NULL来构建不同的查询语句
    IF p_course_name IS NULL THEN
        v_sql := 'SELECT c.id AS id, c.name AS name, c.credit AS credit, c.daily_ratio AS daily_ratio, COUNT(cc.class_id) AS count
                  FROM course_tb c
                  LEFT JOIN cou_class_tb cc ON c.id = cc.course_id
                  GROUP BY c.id, c.name, c.credit, c.daily_ratio';
    ELSE
        v_sql := 'SELECT c.id AS id, c.name AS name, c.credit AS credit, c.daily_ratio AS daily_ratio, COUNT(cc.class_id) AS count
                  FROM course_tb c
                  LEFT JOIN cou_class_tb cc ON c.id = cc.course_id
                  WHERE c.name LIKE ''%' || p_course_name || '%''
                  GROUP BY c.id, c.name, c.credit, c.daily_ratio';
    END IF;

    -- 打开游标执行构建好的查询语句
    OPEN v_cursor FOR v_sql;
    RETURN v_cursor;
END;
/

-- 新建班级
CREATE OR REPLACE FUNCTION insert_class(
    c_name IN class_tb.name%TYPE,
    c_capacity IN class_tb.capacity%TYPE,
    p_id IN course_tb.id%TYPE
) RETURN class_tb.id%TYPE
    IS v_id class_tb.id%TYPE;
BEGIN
    -- 插入数据到班级表
    INSERT INTO class_tb (name, capacity)
    VALUES (c_name, c_capacity)
    RETURNING id INTO v_id;  -- 获取自增主键的值

    -- 插入关联到课程-班级表
    INSERT INTO cou_class_tb (class_id, course_id)
    VALUES (v_id, p_id);

    DBMS_OUTPUT.PUT_LINE('插入班级成功，班级ID为: '  || v_id);
    COMMIT;  -- 提交事务，确保数据持久化
    RETURN v_id;  -- 返回插入记录的主键值
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;  -- 如果出现异常，回滚事务，并返回-1
        DBMS_OUTPUT.PUT_LINE('插入班级失败，具体错误信息: ' || SQLERRM);
        RETURN -1;
END;
/

-- 删除班级
CREATE OR REPLACE FUNCTION delete_class_by_id(p_class_id NUMBER)
    RETURN NUMBER IS
    v_count NUMBER;
BEGIN
    -- 先检查要删除的班级id是否存在
    SELECT COUNT(*)
    INTO v_count
    FROM class_tb
    WHERE id = p_class_id;

    IF v_count > 0 THEN
        -- 如果存在则执行删除操作
        DELETE FROM class_tb
        WHERE id = p_class_id;
        COMMIT;
        RETURN 1;
    ELSE
        RETURN -1;
    END IF;
END;
/

-- 根据班级名查询班级列表
CREATE OR REPLACE FUNCTION get_class(p_class_name IN VARCHAR2 DEFAULT NULL) RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
    v_sql VARCHAR2(4000);
BEGIN
    -- 根据参数是否为NULL来构建不同的查询语句
    IF p_class_name IS NULL THEN
        v_sql := 'SELECT c1.id AS id, c1.name AS name, c1.capacity AS capacity, c2.id AS course_id, c2.name AS course_name
                  FROM class_tb c1
                  LEFT JOIN cou_class_tb cc ON c1.id = cc.class_id
                  LEFT JOIN course_tb c2 ON c2.id = cc.course_id
                  GROUP BY c1.id, c1.name, c1.capacity, c2.id, c2.name';
    ELSE
        v_sql := 'SELECT c1.id AS id, c1.name AS name, c1.capacity AS capacity, c2.id AS course_id, c2.name AS course_name
                  FROM class_tb c1
                  LEFT JOIN cou_class_tb cc ON c1.id = cc.class_id
                  LEFT JOIN course_tb c2 ON c2.id = cc.course_id
                  WHERE c1.name LIKE ''%' || p_class_name || '%''
                  GROUP BY c1.id, c1.name, c1.capacity, c2.id, c2.name';
    END IF;

    -- 打开游标执行构建好的查询语句
    OPEN v_cursor FOR v_sql;
    RETURN v_cursor;
END;
/

-- 根据班级ID查询现有人数与学生信息列表
CREATE OR REPLACE FUNCTION get_class_student_info(p_class_id NUMBER) RETURN SYS_REFCURSOR IS
    v_cursor SYS_REFCURSOR;
    v_sql VARCHAR2(4000);
BEGIN
    v_sql := 'SELECT st.id, st.name, st.campus_id, st.major, st.grade, scsv.daily_score, scsv.daily_ratio, scsv.exam_score, scsv.exam_ratio, scsv.final_score
              FROM stu_tb st
              JOIN stu_class_tb sct ON st.id = sct.stu_id
              JOIN cou_class_tb cct ON sct.class_id = cct.class_id
              LEFT JOIN stu_cou_score_view scsv ON st.id = scsv.stu_id AND cct.course_id = scsv.course_id
              WHERE cct.class_id = ' || p_class_id || '
              GROUP BY st.id, st.name, st.campus_id, st.major, st.grade, scsv.daily_score, scsv.daily_ratio, scsv.exam_score, scsv.exam_ratio, scsv.final_score';

    -- 打开游标执行构建好的查询语句
    OPEN v_cursor FOR v_sql;
    RETURN v_cursor;
END;
/

-- 向班级插入某一学生
CREATE OR REPLACE FUNCTION insert_student(
    s_name IN stu_tb.name%TYPE,
    s_campus_id IN stu_tb.campus_id%TYPE,
    s_major IN stu_tb.major%TYPE,
    s_grade IN stu_tb.grade%TYPE,
    c_id IN class_tb.id%TYPE
) RETURN stu_tb.id%TYPE IS
    s_id stu_tb.id%TYPE;
BEGIN
    -- 先查询学生是否已存在
    SELECT id
    INTO s_id
    FROM stu_tb
    WHERE name = s_name
      AND campus_id = s_campus_id
      AND major = s_major
      AND grade = s_grade;

    -- 插入关联到学生-班级表
    INSERT INTO stu_class_tb (stu_id, class_id)
    VALUES (s_id, c_id);

    DBMS_OUTPUT.PUT_LINE('插入学生成功，学生ID为: ' || s_id);
    COMMIT;
    RETURN s_id;  -- 返回插入记录的主键值

    -- 如果没有找到（即NO_DATA_FOUND异常被触发），则执行插入学生操作
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        BEGIN
            -- 插入数据到学生表
            INSERT INTO stu_tb (name, campus_id, major, grade)
            VALUES (s_name, s_campus_id, s_major, s_grade)
            RETURNING id INTO s_id;
            -- 插入关联到学生-班级表
            INSERT INTO stu_class_tb (stu_id, class_id)
            VALUES (s_id, c_id);
            DBMS_OUTPUT.PUT_LINE('插入学生成功，学生ID为: ' || s_id);
            COMMIT;
            RETURN s_id;  -- 返回插入记录的主键值
        EXCEPTION
            WHEN OTHERS THEN
                ROLLBACK;
                DBMS_OUTPUT.PUT_LINE('插入学生失败，具体错误信息: ' || SQLERRM);
                RETURN -1;
        END;
END;
/

-- 从班级里删除某一个学生
CREATE OR REPLACE FUNCTION delete_stu_class_by_id(
    p_stu_id NUMBER,
    p_class_id NUMBER
)
    RETURN NUMBER IS
    v_count NUMBER;
BEGIN
    -- 先检查要删除的班级id是否存在
    SELECT COUNT(*)
    INTO v_count
    FROM stu_class_tb
    WHERE stu_id = p_stu_id AND class_id = p_class_id;

    IF v_count > 0 THEN
        -- 如果存在则执行删除操作
        DELETE FROM stu_class_tb
        WHERE stu_id = p_stu_id AND class_id = p_class_id;
        COMMIT;
        RETURN 1;
    ELSE
        RETURN -1;
    END IF;
END;
/

-- 修改学生的平时成绩与考试成绩
CREATE OR REPLACE FUNCTION add_or_update_stu_cou_score(
    p_stu_id NUMBER,
    p_course_id NUMBER,
    p_daily_score NUMBER,
    p_exam_score NUMBER
) RETURN NUMBER IS
    v_count NUMBER;
BEGIN
    -- 先检查是否已存在对应学生和课程的成绩记录
    SELECT COUNT(*)
    INTO v_count
    FROM stu_cou_score_tb
    WHERE stu_id = p_stu_id
      AND course_id = p_course_id;

    IF v_count > 0 THEN
        -- 如果存在，更新成绩
        UPDATE stu_cou_score_tb
        SET daily_score = p_daily_score,
            exam_score = p_exam_score
        WHERE stu_id = p_stu_id
          AND course_id = p_course_id;
    ELSE
        -- 如果不存在，插入新记录
        INSERT INTO stu_cou_score_tb (stu_id, course_id, daily_score, exam_score)
        VALUES (p_stu_id, p_course_id, p_daily_score, p_exam_score);
    END IF;

    COMMIT;
    -- 返回受影响的行数（插入为1，更新则是更新的行数，通常为1，若有异常则为0）
    RETURN SQL%ROWCOUNT;
END;
/