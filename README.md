# School Ranking Platform

Full-stack school ranking app: Next.js 14 (JavaScript), Express, PostgreSQL 16, Prisma, JWT, Docker.

**ขอบเขตนำร่อง (1.6):** พื้นที่ กรุงเทพมหานคร และจังหวัดสมุทรปราการ · กลุ่มเป้าหมาย โรงเรียนประถมศึกษาและมัธยมศึกษา ทั้งภาครัฐและเอกชน

## Quick start

1. Copy environment file:

   ```bash
   cp .env.example .env
   ```

2. Start all services:

   ```bash
   docker-compose up --build
   ```

3. Open:

   - Public ranking: [http://localhost:3007](http://localhost:3007)
   - Admin login: [http://localhost:3007/admin/login](http://localhost:3007/admin/login)  
     Default: `admin@school.com` / `admin1234`
   - API docs (Swagger): [http://localhost:3005/api/docs](http://localhost:3005/api/docs)

## Ports

| Service    | Host port |
| ---------- | --------- |
| Frontend   | 3007      |
| Backend    | 3005      |
| PostgreSQL | 5435      |

Stack uses JavaScript only (no TypeScript). Types are documented with JSDoc in `frontend/src/types/index.js`.

## Deploy: Vercel + Railway

**แนวทาง:** Frontend บน Vercel · API + DB บน Railway

### Railway (API + Postgres)

1. สร้างโปรเจกต์ Railway → เพิ่ม **PostgreSQL** → copy `DATABASE_URL` ไปที่ service ของ backend
2. **Deploy** จาก GitHub โดยตั้ง **Root Directory** เป็น `backend` (ใช้ `backend/Dockerfile` ที่รัน `migrate deploy` + `seed` + `node`)
3. ตั้ง **Public Networking** ให้ได้ URL เช่น `https://xxx.up.railway.app`
4. ตัวแปรสภาพแวดล้อมสำคัญ:
   - `DATABASE_URL` — จาก plugin Postgres
   - `FRONTEND_URL` — URL ของ Vercel (ถ้ามีหลาย URL ใช้คอมมาคั่น เช่น production + preview)  
     ตัวอย่าง: `https://your-app.vercel.app,https://your-app-git-dev.vercel.app`
   - `JWT_SECRET`, `JWT_REFRESH_SECRET` — สุ่มยาว ๆ ใน production
   - `NODE_ENV=production`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — บัญชีแรก (seed ใช้ `upsert` ต่อรอบ deploy)
5. **ไฟล์อัปโหลด:** ดิสก์คอนเทนเนอร์ Railway เป็นแบบชั่วคราว — ถ้าต้องการเก็บถาวร ให้เพิ่ม **Volume** mount ไปที่ `UPLOAD_PATH` (ค่าเริ่มต้นใน Docker คือ `/app/uploads`) หรือย้ายไป object storage ภายหลัง

### Vercel (Next.js)

1. Import repo → ตั้ง **Root Directory** เป็น `frontend`
2. **Environment Variables** (ต้องมีตอน build และ runtime):
   - `NEXT_PUBLIC_API_URL` — URL สาธารณะของ Railway API **ไม่มี slash ท้าย** (เช่น `https://xxx.up.railway.app`)  
     ใช้ทั้งฝั่งเบราว์เซอร์เรียก API และใน `next.config.js` rewrites / รูปจาก `/uploads`
3. Build มาตรฐาน `npm run build` / output standalone ตามที่ repo ตั้งไว้

### เช็กลิสต์หลัง deploy

- เปิดเว็บ Vercel แล้วลองล็อกอินแอดมิน / โหลดอันดับ
- ถ้า CORS error: ตรวจ `FRONTEND_URL` ให้ตรงกับ origin จริงของแท็บเบราว์เซอร์ (รวม `https://`)
- ถ้ารูปโลโก้/แบนเนอร์ไม่ขึ้น: ตรวจว่า `NEXT_PUBLIC_API_URL` ตั้งก่อน build และโดเมนนั้นตรงกับที่ใส่ใน `next.config.js` `remotePatterns`
