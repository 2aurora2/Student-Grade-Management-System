# 基于PL/SQL的学生成绩管理系统

### 项目运行准备

1. 安装前后端项目的相关依赖
```bash
cd frontend
npm install
cd ..
cd backend
npm install
```
2. 建立数据库表空间、用户以及相关表、视图、触发器等，具体的SQL语句在`./backend/db/sgma.sql`中
3. 建立PL/SQL函数（本项目的Oracle版本为`21c`）
4. 完善`./backend/.env.example`的变量，并更名为`.env`；如按照本项目提供的SQL执行，则修改为下述内容：
```bash
ORACLE_USER='c##sgms'
ORACLE_PASSWORD=sgms
ORACLE_CONNECT_STRING=localhost/orcl2
```

### 项目运行

```bash
# 前端运行
cd frontend
npm run dev
# 后端运行
cd backend
npm start
```