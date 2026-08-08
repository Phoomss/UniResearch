# DESIGN-ADMIN.md

# UniResearch — Admin Redesign Design Specification

เอกสารนี้ใช้เป็น **Design Specification + Implementation Guide สำหรับ Codex** เพื่อปรับ redesign หน้า Admin ของ UniResearch ทั้งระบบให้มีทิศทางเดียวกัน โดยอิงโครงสร้างจาก Modern SaaS Admin Dashboard / Bento Dashboard ที่เน้นความสะอาด อ่านง่าย มี hierarchy ชัดเจน และใช้ card-based layout

> เป้าหมายหลัก: เปลี่ยน Admin เดิมที่ใช้พื้นขาวเป็นหลัก ให้ใช้ Brand Color ของ UniResearch อย่างเป็นระบบ โดย **ไม่ทำให้หน้าจอสีจัดเกินไป** และยังคงอ่านข้อมูลจำนวนมากได้ง่าย

---

## 1. Design Direction

ใช้แนวทาง:

- Modern Minimal SaaS Dashboard
- Bento / Card-based Layout
- Rounded UI
- Soft Gradient
- Tinted Surface
- Clean Typography
- Data-focused Admin UI
- Responsive Desktop / Tablet / Mobile
- Consistent Design System ทุกหน้า Admin

ความรู้สึกโดยรวม:

- ทันสมัย
- เป็นระบบ
- Professional
- Academic / Research Technology
- Friendly แต่ไม่ดูเป็นเว็บเด็ก
- มีสี Brand ชัดเจน แต่ไม่ใช้สีแรงทุกพื้นที่พร้อมกัน

---

# 2. UniResearch Admin Color Palette

ใช้สีหลักต่อไปนี้เป็น Design Token ของ Admin ทั้งระบบ

| Token | Color | Usage |
|---|---|---|
| `--admin-teal` | `#0A9396` | Primary brand, active navigation, primary action |
| `--admin-cyan` | `#59DBDE` | Secondary accent, chart, hover, info |
| `--admin-blue-soft` | `#569DD1` | Analytics, chart, secondary card |
| `--admin-blue` | `#016FBF` | Strong blue accent, links, focus |
| `--admin-purple` | `#8E24AA` | Secondary brand, gradient endpoint |
| `--admin-purple-soft` | `#D989F0` | Soft accent, chart, decorative area |

## Primary Gradient

```css
linear-gradient(
  135deg,
  #0A9396 0%,
  #569DD1 48%,
  #8E24AA 100%
);
```

## Cyan Gradient

```css
linear-gradient(
  135deg,
  #0A9396 0%,
  #59DBDE 100%
);
```

## Purple Gradient

```css
linear-gradient(
  135deg,
  #8E24AA 0%,
  #D989F0 100%
);
```

---

# 3. Important Color Rule

## ห้ามใช้ `#FFFFFF` เป็นสีหลักของทั้งหน้าเหมือน Admin แบบเดิม

ต้องเปลี่ยนจาก White-heavy UI เป็น **Brand-tinted UI**

อย่างไรก็ตาม:

- สามารถใช้สีขาวกับ text/icon บน background สีเข้มได้
- ไม่ควรเปลี่ยนทุก card ให้เป็นสีสด 100%
- Card ที่เป็นข้อมูลจำนวนมากต้องใช้ tinted surface หรือ translucent gradient เพื่อรักษา readability
- Primary gradient ใช้เฉพาะจุดสำคัญ เช่น selected KPI / CTA / active state
- หลีกเลี่ยง Rainbow Dashboard ที่แต่ละ card คนละสีแบบไม่มี hierarchy

---

# 4. Global Admin Background

Admin App Background ห้ามเป็น pure white

ใช้ background แบบ soft brand wash:

```css
.admin-shell {
  min-height: 100vh;

  background:
    radial-gradient(
      circle at 10% 0%,
      rgba(89, 219, 222, 0.22),
      transparent 30%
    ),
    radial-gradient(
      circle at 100% 10%,
      rgba(217, 137, 240, 0.20),
      transparent 28%
    ),
    linear-gradient(
      145deg,
      rgba(10, 147, 150, 0.10),
      rgba(86, 157, 209, 0.08) 48%,
      rgba(142, 36, 170, 0.10)
    );
}
```

Design intent:

- Background มีสี UniResearch แต่ต้องเบา
- Content ต้องเด่นกว่า background
- ไม่ใส่ gradient ที่ contrast สูงจนรบกวน table / form

---

# 5. Core Design Tokens

Codex ควรสร้าง Admin Design Tokens กลาง และให้ทุกหน้า reuse

ตัวอย่าง:

```css
:root {
  --admin-teal: #0A9396;
  --admin-cyan: #59DBDE;
  --admin-blue-soft: #569DD1;
  --admin-blue: #016FBF;
  --admin-purple: #8E24AA;
  --admin-purple-soft: #D989F0;

  --admin-gradient-main:
    linear-gradient(
      135deg,
      #0A9396 0%,
      #569DD1 48%,
      #8E24AA 100%
    );

  --admin-gradient-cyan:
    linear-gradient(
      135deg,
      #0A9396 0%,
      #59DBDE 100%
    );

  --admin-gradient-purple:
    linear-gradient(
      135deg,
      #8E24AA 0%,
      #D989F0 100%
    );

  --admin-radius-sm: 10px;
  --admin-radius-md: 14px;
  --admin-radius-lg: 18px;
  --admin-radius-xl: 24px;

  --admin-gap-sm: 8px;
  --admin-gap-md: 12px;
  --admin-gap-lg: 16px;
  --admin-gap-xl: 24px;

  --admin-shadow-soft:
    0 10px 35px rgba(1, 111, 191, 0.08);

  --admin-shadow-hover:
    0 14px 40px rgba(142, 36, 170, 0.13);
}
```

> ถ้า project มี design token / CSS variable / Tailwind theme เดิมอยู่แล้ว ให้ integrate เข้าของเดิม ห้ามสร้าง style system ซ้ำซ้อนโดยไม่จำเป็น

---

# 6. Overall Admin Layout

โครงสร้างหลัก:

```text
┌──────────────┬─────────────────────────────────────────┐
│              │ Topbar                                  │
│   Sidebar    ├─────────────────────────────────────────┤
│              │                                         │
│              │ Admin Page Content                      │
│              │                                         │
│              │ KPI / Charts / Tables / Forms           │
│              │                                         │
└──────────────┴─────────────────────────────────────────┘
```

Desktop:

```css
sidebar width: 230px - 250px;
content gap: 16px;
page padding: 20px - 28px;
```

ใช้ max-width เฉพาะ content ที่จำเป็น

Dashboard หลักควรใช้พื้นที่กว้างเต็ม available viewport

---

# 7. Sidebar Design

Sidebar ต้องดูเด่นแต่ไม่แย่ง Content

## Appearance

- Rounded outer container
- background แบบ translucent/tinted
- border บางมาก
- backdrop blur ใช้ได้
- active navigation ใช้ gradient หรือ teal
- inactive navigation ใช้ neutral/dark text
- hover ใช้ cyan/purple tint

ตัวอย่าง:

```css
.admin-sidebar {
  background:
    linear-gradient(
      180deg,
      rgba(10, 147, 150, 0.12),
      rgba(86, 157, 209, 0.08),
      rgba(142, 36, 170, 0.10)
    );

  border: 1px solid rgba(89, 219, 222, 0.22);
  border-radius: 24px;
}
```

## Active Item

```css
.admin-nav-item.active {
  background: linear-gradient(
    135deg,
    #0A9396,
    #016FBF
  );

  color: #fff;
}
```

หรือใช้:

```text
▌ Dashboard
```

มี left indicator bar สี `#8E24AA`

## Navigation Sections

แนะนำ:

```text
OVERVIEW
- Dashboard

RESEARCH
- ผลงานวิจัย
- รอตรวจสอบ
- เผยแพร่แล้ว
- ต้องแก้ไข / ถูกส่งกลับ

MANAGEMENT
- ผู้ใช้งาน
- อาจารย์ / ผู้ตรวจสอบ
- หมวดหมู่
- เอกสาร

ANALYTICS
- สถิติ
- การค้นหา
- การเข้าชม
- การดาวน์โหลด

SYSTEM
- ตั้งค่า
- ออกจากระบบ
```

ให้ใช้ route / permission จริงของ project เป็นหลัก

ห้ามสร้าง menu ที่ระบบไม่มีจริงโดยไม่จำเป็น

---

# 8. Topbar

Topbar ให้ใช้ layout คล้าย Modern SaaS

ประกอบด้วย:

```text
Page title / Breadcrumb       Search       Notification       User
```

## Search

- pill shape
- background teal/cyan tint
- ไม่มี border หนา
- focus ring ใช้ `#016FBF`
- รองรับ search admin ถ้ามี functionality อยู่แล้ว

## Notification

Icon button:

```css
width: 40px;
height: 40px;
border-radius: 50%;
```

Hover:

```css
background: rgba(89, 219, 222, 0.22);
```

## Admin Profile

แสดง:

- avatar
- display name
- role
- dropdown

---

# 9. Typography

ถ้า project ใช้ `Kanit` อยู่แล้ว ให้ใช้ Kanit ต่อเพื่อรักษา Brand

แนะนำ hierarchy:

```text
Page Title
30 - 36px
font-weight: 600

Page Description
14 - 16px
font-weight: 400

Card Title
15 - 18px
font-weight: 500 - 600

KPI Number
36 - 48px
font-weight: 500 - 600

Table Text
13 - 15px

Metadata
12 - 13px
```

ห้ามใช้ font-size ใหญ่เกินแบบต้นฉบับ

Admin ต้องเน้น information density ที่สมดุล

---

# 10. Dashboard Header

ตัวอย่าง:

```text
Dashboard

ภาพรวมข้อมูลและสถานะของระบบ UniResearch

[ + เพิ่มผลงาน ] [ Export / Import ถ้ามีจริง ]
```

Primary Button:

```css
background: linear-gradient(
  135deg,
  #0A9396,
  #016FBF
);
```

Secondary Button:

```css
background: rgba(217, 137, 240, 0.12);
border: 1px solid rgba(142, 36, 170, 0.35);
color: #8E24AA;
```

Button:

```css
border-radius: 999px;
height: 42px - 46px;
padding-inline: 18px - 24px;
```

---

# 11. KPI Cards

Admin Dashboard ควรมี KPI สำคัญจากระบบจริง

ตัวอย่าง:

```text
ผลงานทั้งหมด
รอตรวจสอบ
เผยแพร่แล้ว
ต้องแก้ไข
```

ถ้าข้อมูล backend มี:

```text
จำนวนผู้ใช้งาน
จำนวนอาจารย์ที่ปรึกษา
จำนวนเข้าชม
จำนวนดาวน์โหลด
```

สามารถเพิ่มด้านล่างหรือปรับตาม requirement จริง

## Selected / Hero KPI

Card แรกใช้ gradient:

```css
background:
  linear-gradient(
    135deg,
    #0A9396,
    #569DD1,
    #8E24AA
  );

color: #fff;
```

## Secondary KPI

ใช้ tinted surface เช่น:

```css
background:
  linear-gradient(
    135deg,
    rgba(89, 219, 222, 0.16),
    rgba(86, 157, 209, 0.10)
  );
```

หรือ

```css
background:
  linear-gradient(
    135deg,
    rgba(142, 36, 170, 0.12),
    rgba(217, 137, 240, 0.14)
  );
```

ทุก card ไม่ควรใช้ gradient เข้มเหมือนกันทั้งหมด

---

# 12. Card Component

สร้าง reusable Admin Card

```css
.admin-card {
  border-radius: 18px;
  border: 1px solid rgba(86, 157, 209, 0.14);

  background:
    linear-gradient(
      145deg,
      rgba(89, 219, 222, 0.10),
      rgba(217, 137, 240, 0.08)
    );

  box-shadow:
    0 10px 30px rgba(1, 111, 191, 0.06);
}
```

Padding:

```css
padding: 18px - 22px;
```

Hover เฉพาะ card ที่ clickable:

```css
transform: translateY(-2px);
box-shadow: var(--admin-shadow-hover);
```

Transition:

```css
transition: 180ms ease;
```

---

# 13. Bento Grid Dashboard

Dashboard desktop ควรจัด card แบบ Bento แทนการเรียง card ขนาดเท่ากันทั้งหมด

ตัวอย่าง:

```text
┌──────────┬──────────┬──────────┬──────────┐
│ Total    │ Pending  │ Published│ Revision │
├─────────────────────┼──────────┴──────────┤
│ Research Analytics  │ Pending Reviews     │
├──────────────┬──────┴─────────────────────┤
│ Categories   │ Views / Downloads          │
└──────────────┴────────────────────────────┘
```

ใช้ CSS Grid

```css
grid-template-columns: repeat(12, minmax(0, 1fr));
gap: 14px;
```

---

# 14. Research Analytics

Admin Dashboard ต้องรองรับข้อมูลตามระบบ เช่น:

- จำนวนผลงานต่อปี
- จำนวนผลงานต่อเดือน
- จำนวนผลงานต่อหมวดหมู่
- จำนวนการเข้าชม
- จำนวนดาวน์โหลด
- คำค้นหายอดนิยม

## Chart Colors

ใช้ palette:

```text
#0A9396
#59DBDE
#569DD1
#016FBF
#8E24AA
#D989F0
```

ห้ามใช้ random colors นอก palette ถ้าไม่จำเป็น

## Chart Rule

- grid line บาง
- axis text เล็ก
- tooltip rounded
- ไม่มี legend ที่กินพื้นที่มากเกินไป
- chart background โปร่ง / tinted
- highlight data สำคัญด้วย `#8E24AA` หรือ `#016FBF`

---

# 15. Research Review Queue

สร้าง card สำหรับ:

```text
รอตรวจสอบล่าสุด
```

แต่ละ row:

```text
[cover/icon] ชื่อผลงาน
             ผู้จัดทำ
             วันที่ส่ง

             [รอตรวจสอบ]
```

ด้านขวา:

```text
→
```

เมื่อ click ไปหน้าตรวจสอบผลงานจริง

Status ใช้ chip

---

# 16. Status System

ใช้ status visual ให้ consistent ทั้งระบบ

## Draft

```css
background: rgba(86, 157, 209, 0.14);
color: #016FBF;
```

## Pending Review

```css
background: rgba(89, 219, 222, 0.18);
color: #0A9396;
```

## Needs Revision

```css
background: rgba(217, 137, 240, 0.16);
color: #8E24AA;
```

## Approved

```css
background: rgba(10, 147, 150, 0.16);
color: #0A9396;
```

## Published

ใช้ stronger visual:

```css
background: linear-gradient(
  135deg,
  #0A9396,
  #016FBF
);

color: #fff;
```

## Rejected

ถ้า project มี semantic error/danger color อยู่แล้ว สามารถเก็บ danger token เดิมไว้ได้

**ไม่ควรใช้ม่วงหรือฟ้าแทน error จนผู้ใช้แยกสถานะไม่ได้**

---

# 17. Tables

หน้า Admin ส่วนใหญ่จะมี table เยอะ ดังนั้นต้อง redesign อย่างระวัง

ใช้กับ:

- Research list
- User list
- Category
- Review history
- Documents
- Logs

## Table Container

```css
border-radius: 18px;
overflow: hidden;
```

background ใช้ tinted surface

Header:

```css
background:
  linear-gradient(
    90deg,
    rgba(10, 147, 150, 0.15),
    rgba(86, 157, 209, 0.12),
    rgba(142, 36, 170, 0.12)
  );
```

Rows:

- ไม่ใช้เส้น border เข้ม
- ใช้ divider แบบ opacity ต่ำ
- hover ใช้ `rgba(89,219,222,.10)`

Action icon:

- View
- Edit
- Review
- Delete

ใช้ Lucide icons ถ้า project มี `lucide-react`

---

# 18. Search / Filter Area

Research Management ต้องมี filter ที่อ่านง่าย

layout:

```text
[ Search research........................ ]

[ Status ▼ ] [ Category ▼ ] [ Year ▼ ] [ Type ▼ ]

[Reset]                           [Search]
```

Desktop สามารถอยู่ row เดียว

Mobile stack vertical

Input Design:

```css
border: 1px solid rgba(86, 157, 209, 0.24);
background: rgba(89, 219, 222, 0.07);
border-radius: 12px;
```

Focus:

```css
outline: none;
border-color: #016FBF;
box-shadow: 0 0 0 3px rgba(1, 111, 191, 0.12);
```

---

# 19. Forms

ใช้กับ:

- Research form
- User management
- Category management
- Admin settings

## Form Layout

Large form:

```text
Section Card

ข้อมูลพื้นฐาน
--------------------------------

ชื่อภาษาไทย
[..............................]

ชื่อภาษาอังกฤษ
[..............................]

หมวดหมู่     ปีการศึกษา
[........]     [........]
```

แบ่ง long form เป็น section card

ห้ามทำ form ยาวติดกันทั้งหมดโดยไม่มี grouping

---

# 20. Modal / Dialog

Modal:

```css
border-radius: 20px;
```

Background overlay:

```css
background: rgba(1, 30, 45, 0.38);
backdrop-filter: blur(4px);
```

Modal surface:

```css
background:
  linear-gradient(
    145deg,
    rgba(89, 219, 222, 0.14),
    rgba(217, 137, 240, 0.12)
  );
```

Delete confirmation ยังคงใช้ semantic danger color เดิมของระบบได้

---

# 21. Empty State

ห้ามให้หน้า table ว่างเปล่าแบบไม่มี guidance

ตัวอย่าง:

```text
ยังไม่มีผลงานที่ตรงกับตัวกรอง

ลองเปลี่ยนเงื่อนไขการค้นหา
หรือเพิ่มผลงานใหม่เข้าสู่ระบบ

[ เพิ่มผลงาน ]
```

ใช้ icon outline + soft gradient background

---

# 22. Loading State

ใช้ skeleton ที่ match card layout

ห้ามใช้ full screen spinner สำหรับทุกการโหลด

ใช้:

- table row skeleton
- chart skeleton
- KPI skeleton
- button loading state

---

# 23. Icons

ถ้า project ใช้ `lucide-react` อยู่แล้ว ให้ใช้ library เดิม

แนะนำ:

```text
LayoutDashboard
BookOpen
FileText
ClipboardCheck
Users
GraduationCap
Tags
ChartNoAxesCombined
Search
Eye
Download
Upload
Settings
Bell
LogOut
Plus
ArrowUpRight
ChevronRight
Filter
Pencil
Trash2
```

ใช้ icon style แบบ outline เป็นหลัก

Icon size:

```text
Navigation: 18-20px
Button: 16-18px
KPI: 20-24px
Empty state: 36-48px
```

---

# 24. Border Radius

ใช้ consistency:

```text
Small controls:   10px
Inputs:           12px
Small cards:      14px
Main cards:       18px
Large panels:     20-24px
Pill buttons:     999px
Avatar:           50%
```

ห้าม random radius แต่ละ component

---

# 25. Spacing

ใช้ spacing scale:

```text
4px
8px
12px
16px
20px
24px
32px
40px
```

Dashboard:

```text
Page padding: 24px
Card gap: 14-16px
Card padding: 18-22px
Section gap: 24px
```

---

# 26. Animation

Animation ต้อง subtle

ใช้:

```css
transition:
  color 160ms ease,
  background 160ms ease,
  border-color 160ms ease,
  box-shadow 180ms ease,
  transform 180ms ease;
```

อนุญาต:

- hover lift 1-2px
- icon rotate เล็กน้อย
- dropdown fade/slide
- sidebar collapse animation

ห้าม:

- card เด้งแรง
- gradient animation ตลอดเวลา
- background animation ที่รบกวนข้อมูล

---

# 27. Admin Pages ที่ Codex ต้อง Redesign

Codex ต้องค้นหา Admin routes / Admin components ที่มีอยู่จริงใน project ก่อน

จากนั้น redesign **ทุกหน้า Admin ที่พบ** ให้ใช้ Design System เดียวกัน

อย่างน้อย scope ของ UniResearch Admin มีแนวโน้มประกอบด้วย:

1. Admin Dashboard
2. Research Management
3. Research Detail สำหรับ Admin
4. Review / Approval
5. Pending Review
6. Published Research
7. Revision / Rejected workflow
8. User Management
9. Reviewer / Advisor Management ถ้ามีหน้าแยก
10. Category Management
11. Document / File Management ถ้ามี
12. Statistics / Analytics
13. Search / Download statistics ถ้ามี
14. Admin Settings
15. Shared Admin Layout
16. Shared Admin Sidebar
17. Shared Admin Header
18. Tables / pagination
19. Modal / confirmation dialog
20. Loading / empty / error states

> ห้ามสร้าง page ใหม่เพียงเพราะมีชื่ออยู่ในเอกสารนี้ หาก repository ปัจจุบันไม่มี requirement หรือ route รองรับ

---

# 28. Research Workflow UI

Admin ต้องสะท้อนสถานะงานวิจัย:

```text
Draft
Pending Review
Needs Revision
Approved
Rejected
Published
```

Flow:

```text
Submitted
   ↓
Pending Review
   ↓
┌──────────────┬───────────────┐
│              │               │
Needs Revision Approved      Rejected
│              │
└── Resubmit   └── Published
```

หน้า Review ควรแสดง:

- Research metadata
- Authors
- Advisor
- Abstract
- Keywords
- Category
- Academic Year
- PDF
- Revision
- Review comments
- Current status
- Review actions

Actions ต้องชัดเจน

```text
[ ส่งกลับให้แก้ไข ]
[ ไม่อนุมัติ ]
[ อนุมัติ ]
```

---

# 29. Admin Dashboard Content Recommendation

ใช้เฉพาะข้อมูลที่ backend มีจริง

## Row 1 — KPI

```text
ผลงานทั้งหมด
รอตรวจสอบ
เผยแพร่แล้ว
ต้องแก้ไข
```

## Row 2

```text
Research Analytics     Pending Reviews
```

## Row 3

```text
Popular Categories     Views / Downloads
```

Optional:

```text
Top Searches
Recent Activity
Recent Publications
```

---

# 30. Sidebar Responsive Behavior

Desktop:

```text
230-250px sidebar
```

Tablet:

```text
72-84px collapsed sidebar
icon only
tooltip on hover
```

Mobile:

```text
sidebar -> drawer
hamburger menu
```

ห้ามทำ horizontal overflow

---

# 31. Responsive Breakpoints

สามารถใช้ breakpoint เดิมของ project

Concept:

```text
>= 1280px
Full Bento Dashboard

1024 - 1279px
Reduced Bento

768 - 1023px
2-column cards

< 768px
Single column
Drawer Sidebar
```

KPI:

```text
Desktop: 4 columns
Tablet: 2 columns
Mobile: 1 column
```

---

# 32. Accessibility

ต้องรักษา:

- keyboard navigation
- visible focus state
- semantic button
- label ทุก input
- aria-label icon-only button
- text contrast
- ไม่ใช้ color อย่างเดียวในการบอกสถานะ
- status ต้องมี text label เสมอ

ตัวอย่าง:

```text
● รอตรวจสอบ
```

ไม่ใช้แค่จุดสี

---

# 33. Implementation Rules for Codex

## สำคัญมาก

Codex ต้อง:

1. วิเคราะห์โครงสร้าง Admin ปัจจุบันก่อนแก้
2. หา shared layout / shared component
3. ปรับจากส่วนกลางก่อน
4. reuse component ให้มากที่สุด
5. หลีกเลี่ยง duplicate CSS
6. ห้ามแก้ business logic โดยไม่จำเป็น
7. ห้ามเปลี่ยน API contract
8. ห้ามเปลี่ยน backend
9. ห้ามลบ feature ที่มีอยู่
10. ห้าม mock data ทับข้อมูลจริง
11. ห้าม hardcode role ถ้ามี RBAC อยู่แล้ว
12. รักษา authentication / authorization เดิม
13. รักษา route เดิม
14. รักษา i18n ถ้ามี
15. รักษา loading/error state
16. ทำ responsive ทุกหน้า
17. ตรวจ TypeScript / lint หลังแก้
18. ตรวจ build หลังแก้

---

# 34. Recommended Refactor Order

Codex ควร redesign ตามลำดับนี้:

```text
1. Analyze admin architecture
        ↓
2. Design tokens
        ↓
3. Admin layout
        ↓
4. Sidebar
        ↓
5. Header
        ↓
6. Reusable Card
        ↓
7. Button / Input / Badge
        ↓
8. Table
        ↓
9. Dashboard
        ↓
10. Research pages
        ↓
11. Review pages
        ↓
12. User / Category pages
        ↓
13. Analytics
        ↓
14. Responsive check
        ↓
15. Build / lint check
```

---

# 35. Component Strategy

ถ้า architecture รองรับ ให้แยก reusable components เช่น:

```text
AdminShell
AdminSidebar
AdminTopbar
AdminPageHeader
AdminCard
AdminStatCard
AdminSection
AdminTable
AdminStatusBadge
AdminFilterBar
AdminSearchInput
AdminEmptyState
AdminPagination
AdminModal
AdminActionButton
AdminChartCard
```

ไม่บังคับชื่อ component ตามนี้

ให้ Codex ใช้ naming convention เดิมของ project เป็นหลัก

---

# 36. Do / Don't

## DO

- ใช้ Brand palette ทั้ง 6 สีอย่างมี hierarchy
- ใช้ gradient เฉพาะจุดสำคัญ
- ใช้ tinted surface
- ใช้ whitespace
- ใช้ rounded card
- ใช้ modern typography
- ใช้ Lucide icons แบบ consistent
- จัด content เป็น section
- ทำ mobile responsive
- reuse components

## DON'T

- อย่าเปลี่ยนทุก card เป็น gradient สีสด
- อย่าใช้ pure white เป็น background หลักทั้งหน้า
- อย่าใช้ shadow หนา
- อย่าใช้ border ดำ
- อย่าใช้ font ใหญ่เกิน
- อย่าเพิ่ม animation เยอะ
- อย่าแก้ backend
- อย่าเปลี่ยน behavior เดิม
- อย่าลบ data field ที่ระบบใช้อยู่
- อย่าสร้าง fake dashboard metric เพื่อให้ UI ดูเต็ม

---

# 37. Visual Target

Admin ใหม่ควรให้ความรู้สึก:

```text
Modern SaaS
+
Research Management Platform
+
University Academic System
+
UniResearch Brand Gradient
```

ไม่ควรดูเหมือน:

```text
Bootstrap Admin Template
Corporate ERP เก่า
Neon Dashboard
Gaming Dashboard
Rainbow Analytics
```

---

# 38. Final Visual Hierarchy

สายตาผู้ใช้ควรเห็นตามลำดับ:

```text
1. Page title
2. Important actions
3. KPI / status
4. Analytics
5. Pending work
6. Detailed data
```

Admin ต้องสามารถเข้าใจสถานะระบบได้ภายในไม่กี่วินาที

---

# 39. Definition of Done

งาน redesign ถือว่าเสร็จเมื่อ:

- [ ] Admin ทุกหน้าที่มีอยู่จริงใช้ visual language เดียวกัน
- [ ] ไม่มีหน้า Admin ใดหลุดกลับไปใช้ layout เก่าโดยไม่มีเหตุผล
- [ ] Sidebar / Topbar consistent
- [ ] ใช้ color palette UniResearch ตาม specification
- [ ] ไม่ใช้ pure white เป็นสี dominant ของ Admin
- [ ] Dashboard เป็น Bento / responsive grid
- [ ] KPI hierarchy ชัดเจน
- [ ] Table อ่านง่าย
- [ ] Form ใช้งานง่าย
- [ ] Status consistent
- [ ] Responsive desktop/tablet/mobile
- [ ] Keyboard focus มองเห็น
- [ ] Existing functionality ยังทำงาน
- [ ] Existing RBAC ยังทำงาน
- [ ] API contract ไม่เปลี่ยน
- [ ] TypeScript ไม่มี error จากงาน redesign
- [ ] Lint ผ่าน หรือไม่มี error ใหม่
- [ ] Production build ผ่าน

---

# 40. Prompt สำหรับ Codex

ใช้ instruction ต่อไปนี้เป็นเป้าหมายหลัก:

```text
Analyze the current UniResearch frontend and locate every existing Admin route,
page, layout, component, and stylesheet.

Redesign the entire existing Admin interface using DESIGN-ADMIN.md as the
single visual specification.

The redesign must follow a Modern Minimal SaaS / Bento Dashboard style and
replace the current white-heavy Admin UI with the UniResearch brand palette:

#0A9396
#59DBDE
#569DD1
#016FBF
#8E24AA
#D989F0

Use the colors systematically through shared design tokens, soft gradients,
tinted surfaces, active states, charts, buttons, badges, navigation, tables,
forms, and dashboard cards.

Do not turn every surface into a strong gradient. Preserve readability and
information hierarchy.

Start by inspecting the current architecture and shared Admin components.
Refactor shared layout/styles first so the redesign propagates consistently
across all Admin pages.

Preserve all existing routes, authentication, RBAC, APIs, data flow, backend
integration, validation, loading states, error states, and business logic.

Do not modify backend behavior.
Do not replace real data with mock data.
Do not remove existing Admin features.
Do not invent unsupported Admin pages solely for visual completeness.

Use reusable components and avoid duplicated styling.

Make the Admin interface responsive:
- desktop: full sidebar + Bento dashboard
- tablet: collapsed navigation / reduced grid
- mobile: drawer navigation + single-column content

After implementation:
1. inspect all Admin pages visually,
2. fix inconsistent spacing/colors/components,
3. run TypeScript checks,
4. run lint,
5. run the production build,
6. fix any errors introduced by the redesign.

The final result should feel like a modern research management SaaS platform
using the UniResearch visual identity rather than a generic admin template.
```

---

# 41. Core Design Summary

```text
STYLE
Modern Minimal SaaS + Bento Dashboard

PRIMARY
#0A9396

ACCENT
#59DBDE
#569DD1
#016FBF
#8E24AA
#D989F0

MAIN GRADIENT
#0A9396 → #569DD1 → #8E24AA

CARD
18px radius

LAYOUT
Sidebar + Topbar + Bento Content

ICON
Lucide-style Outline

WHITE
Do not use as dominant Admin background

PRIORITY
Readability > Decoration

IMPLEMENTATION
Shared components + shared design tokens

FUNCTIONALITY
Must remain unchanged
```

---

**End of DESIGN-ADMIN.md**
