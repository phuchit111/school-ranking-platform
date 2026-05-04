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
