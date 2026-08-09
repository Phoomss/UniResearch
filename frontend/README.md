# 🌐 UniResearch Frontend

ระบบหน้าบ้าน (Frontend) ของแพลตฟอร์ม **UniResearch** พัฒนาด้วย **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4** และ **pnpm**

---

## 🛠️ Tech Stack

| เทคโนโลยี | วัตถุประสงค์ |
| :--- | :--- |
| [Next.js 16](https://nextjs.org/) | React Framework (App Router, Server Components) |
| [TypeScript](https://www.typescriptlang.org/) | เพิ่มความปลอดภัยและความถูกต้องของชนิดข้อมูล |
| [Tailwind CSS v4](https://tailwindcss.com/) | ระบบ CSS Utility-first |
| [Framer Motion](https://www.framer.com/motion/) | Animation Library |
| [Lucide React](https://lucide.dev/) | ชุดไอคอน |
| [pnpm](https://pnpm.io/) | ตัวจัดการ Package |
| [Playwright](https://playwright.dev/) | การทดสอบ End-to-end (E2E) |

---

## 📁 โครงสร้างโปรเจกต์ (Directory Structure)

```text
frontend/
├── app/                  # หน้าเว็บของระบบ (App Router)
│   ├── api/              # API Route Handlers (Proxy ไปยัง Backend)
│   ├── login/            # หน้าเข้าสู่ระบบ
│   ├── register/         # หน้าลงทะเบียน
│   ├── dashboard/        # แผงควบคุมผู้ใช้
│   ├── admin/            # หน้าจัดการระบบ (Admin)
│   ├── advisor/          # หน้าอาจารย์ที่ปรึกษา
│   ├── student/          # หน้านักศึกษา
│   ├── research/         # หน้าแสดงผลงานวิจัย
│   └── layout.tsx        # Layout หลักของแอปพลิเคชัน
├── src/
│   ├── features/         # ฟีเจอร์หลัก (Auth, Research, Review, Admin)
│   ├── lib/              # ตัวช่วย API Client, Session, Error Handling
│   └── components/       # UI Components ที่ใช้ซ้ำได้
├── tests/                # Unit Tests
├── e2e/                  # E2E Tests (Playwright)
├── Dockerfile            # 🐳 Docker Container (multi-stage: dev + prod)
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript Configuration
└── next.config.ts        # Next.js Configuration (standalone output)
```

---

## 🐳 วิธีการรันด้วย Docker (แนะนำ)

ระบบ Docker Compose หลักอยู่ที่ **root ของโปรเจกต์** (`UniResearch/docker-compose.yml`):

```bash
# จาก root directory ของโปรเจกต์
make dev-build

# หรือรันด้วย Docker Compose โดยตรง
docker compose up --build
```

คำสั่งที่มีประโยชน์:
```bash
make logs-frontend     # ดู log เฉพาะ frontend
make shell-frontend    # เปิด shell ใน frontend container
```

---

## 💻 วิธีการรันแบบ Local (ไม่ใช้ Docker)

### ข้อกำหนดเบื้องต้น
- Node.js 20+
- pnpm 9+
- Backend API กำลังทำงานอยู่ที่ `http://localhost:8000`

### ขั้นตอนการติดตั้ง

1. ติดตั้ง dependencies:
   ```bash
   pnpm install
   ```

2. สร้างไฟล์ตัวแปรสภาพแวดล้อม:
   ```bash
   echo 'BACKEND_API_URL=http://localhost:8000' > .env
   ```

3. รันในโหมดพัฒนา:
   ```bash
   pnpm dev
   ```

4. เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 🧪 การทดสอบระบบ (Testing)

```bash
# Unit Tests
pnpm test

# E2E Tests (ต้องรันระบบอยู่ก่อน)
pnpm test:e2e
```

---

## ⚙️ ตัวแปรสภาพแวดล้อม (Environment Variables)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
| :--- | :--- | :--- |
| `BACKEND_API_URL` | `http://127.0.0.1:8000` | URL ของ Backend API (Server-side) |
| `NEXT_TELEMETRY_DISABLED` | `1` | ปิดการส่งข้อมูล Telemetry |
