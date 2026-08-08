# 📊 แผนภาพ UML ฉบับเต็มสำหรับระบบ UniResearch (Full UML Diagrams)

เอกสารฉบับนี้รวบรวมแผนภาพ **UML (Unified Modeling Language)** และแบบจำลองกระบวนการทำงานของระบบ **UniResearch** ครบถ้วนทุกมิติ พัฒนาขึ้นโดยใช้ไวยากรณ์ **Mermaid** ซึ่งสามารถแสดงผลเป็นไดอะแกรมโดยตรงบน GitHub/GitLab หรือนำไปเปิดใช้งานร่วมกับโปรแกรมที่รองรับ Mermaid ทั่วไปได้ทันที

---



---

## 1. Use Case Diagram (แผนภาพยูสเคส)

แสดงบทบาทของผู้ใช้ (Actors) ทั้ง 4 กลุ่มและความสัมพันธ์กับฟังก์ชันหลักของระบบ (Use Cases):

```mermaid
flowchart LR
    subgraph Actors [บทบาทผู้ใช้]
        Guest["Guest (ผู้เข้าชมทั่วไป)"]
        Student["Student (นักศึกษา/ผู้แต่ง)"]
        Advisor["Advisor (อาจารย์/ผู้ประเมิน)"]
        Admin["Admin (ผู้ดูแลระบบ)"]
    end

    subgraph UniResearch [ระบบ UniResearch]
        UC_Register("สมัครสมาชิก (เฉพาะ Student)")
        UC_Login("เข้าสู่ระบบ / จัดการเซสชัน")
        UC_EditProfile("ดู/แก้ไขโปรไฟล์ตนเอง")
        UC_Search("ค้นหาและกรองผลงานวิจัย")
        UC_Download("ดาวน์โหลดเอกสาร PDF")
        UC_Submit("ส่งผลงานวิจัยใหม่")
        UC_Upload("อัปโหลดปก/ไฟล์ PDF")
        UC_Revision("ส่งเอกสารรุ่นปรับปรุง (Revision)")
        UC_Favorite("บันทึกผลงานโปรด (Bookmark)")
        UC_Review("ตรวจประเมินผลงาน (คิวงาน)")
        UC_ManageUsers("จัดการบัญชีและสิทธิ์ผู้ใช้")
        UC_ManageCats("จัดการหมวดหมู่และตัวเลือก")
        UC_Dashboard("ดูสถิติภาพรวมระบบ")
    end

    Guest --> UC_Register
    Guest --> UC_Login
    Guest --> UC_Search
    Guest --> UC_Download

    Student --> UC_Login
    Student --> UC_EditProfile
    Student --> UC_Search
    Student --> UC_Download
    Student --> UC_Submit
    Student --> UC_Upload
    Student --> UC_Revision
    Student --> UC_Favorite

    Advisor --> UC_Login
    Advisor --> UC_EditProfile
    Advisor --> UC_Search
    Advisor --> UC_Download
    Advisor --> UC_Review
    Advisor --> UC_Favorite

    Admin --> UC_Login
    Admin --> UC_EditProfile
    Admin --> UC_Search
    Admin --> UC_Download
    Admin --> UC_Submit
    Admin --> UC_Review
    Admin --> UC_ManageUsers
    Admin --> UC_ManageCats
    Admin --> UC_Dashboard
```

---

## 2. Class Diagram (แผนภาพคลาส)

แสดงคลาสของระบบฝั่งหลังบ้าน (Backend Models) โครงสร้างข้อมูล ชนิดข้อมูล และความสัมพันธ์ระหว่างกัน:

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string hashed_password
        +string role
        +string student_id
        +string department
        +string first_name
        +string last_name
        +boolean is_active
    }

    class ResearchWork {
        +int id
        +string title_th
        +string title_en
        +string abstract
        +int category_id
        +string department
        +string work_type
        +int academic_year
        +string keywords
        +string cover_image_path
        +string file_path
        +string status
        +int view_count
        +int download_count
        +datetime published_at
        +datetime created_at
        +datetime updated_at
        +int submitted_by_id
    }

    class Category {
        +int id
        +string category_name
        +string description
    }

    class ResearchAuthor {
        +int id
        +int research_id
        +int user_id
        +string role_in_work
    }

    class ResearchAdvisor {
        +int id
        +int research_id
        +int user_id
    }

    class FileRevision {
        +int id
        +int research_id
        +string file_path
        +int version_no
        +int uploaded_by
        +datetime uploaded_at
    }

    class ReviewComment {
        +int id
        +int research_id
        +int reviewer_id
        +string comment_text
        +string status_result
        +datetime created_at
    }

    class Favorite {
        +int id
        +int user_id
        +int research_id
        +datetime saved_at
    }

    class DownloadViewLog {
        +int id
        +int research_id
        +int user_id
        +string action_type
        +datetime action_at
    }

    class SearchLog {
        +int id
        +string keyword
        +datetime searched_at
    }

    User "1" <-- "many" ResearchWork : submitted_by
    ResearchWork "many" --> "1" Category : has_category
    ResearchWork "1" *-- "many" ResearchAuthor : has_authors
    ResearchWork "1" *-- "many" ResearchAdvisor : has_advisors
    ResearchWork "1" *-- "many" FileRevision : has_revisions
    ResearchWork "1" *-- "many" ReviewComment : has_reviews
    
    ResearchAuthor "many" --> "1" User : represents
    ResearchAdvisor "many" --> "1" User : represents
    FileRevision "many" --> "1" User : uploaded_by
    ReviewComment "many" --> "1" User : reviewed_by

    User "1" <-- "many" Favorite : bookmarks
    ResearchWork "1" <-- "many" Favorite : bookmarked_in

    ResearchWork "1" <-- "many" DownloadViewLog : logs
    User "0..1" <-- "many" DownloadViewLog : logs_by
```

---

## 3. Entity-Relationship Diagram (ER Diagram)

แสดงความเชื่อมโยงเชิงโครงสร้างฐานข้อมูล คีย์หลัก (PK) คีย์นอก (FK) และความสัมพันธ์แบบ Cardinality (1:1, 1:N, N:M) พร้อมรายละเอียดแอตทริบิวต์และประเภทข้อมูล:

```mermaid
erDiagram
    users {
        int id PK
        string email
        string hashed_password
        string role
        string student_id
        string department
        string first_name
        string last_name
        boolean is_active
    }
    departments {
        int id PK
        string name
    }
    work_types {
        int id PK
        string name
    }
    research_works {
        int id PK
        string title_th
        string title_en
        text abstract
        int category_id FK
        string department
        string work_type
        int academic_year
        string keywords
        string cover_image_path
        string file_path
        string status
        int view_count
        int download_count
        datetime published_at
        datetime created_at
        datetime updated_at
        int submitted_by_id FK
    }
    categories {
        int id PK
        string category_name
        string description
    }
    research_authors {
        int id PK
        int research_id FK
        int user_id FK
        string role_in_work
    }
    research_advisors {
        int id PK
        int research_id FK
        int user_id FK
    }
    file_revisions {
        int id PK
        int research_id FK
        string file_path
        int version_no
        int uploaded_by FK
        datetime uploaded_at
    }
    review_comments {
        int id PK
        int research_id FK
        int reviewer_id FK
        text comment_text
        string status_result
        datetime created_at
    }
    favorites {
        int id PK
        int user_id FK
        int research_id FK
        datetime saved_at
    }
    download_view_logs {
        int id PK
        int research_id FK
        int user_id FK
        string action_type
        datetime action_at
    }
    search_logs {
        int id PK
        string keyword
        datetime searched_at
    }

    users ||--o{ research_works : "submits"
    users ||--o{ research_authors : "authored_by"
    users ||--o{ research_advisors : "advises_by"
    users ||--o{ file_revisions : "uploads"
    users ||--o{ review_comments : "reviews_by"
    users ||--o{ favorites : "saved_by"
    users |o--o{ download_view_logs : "triggers"

    categories ||--o{ research_works : "categorizes"

    research_works ||--o{ research_authors : "has_authors"
    research_works ||--o{ research_advisors : "has_advisors"
    research_works ||--o{ file_revisions : "has_revisions"
    research_works ||--o{ review_comments : "has_comments"
    research_works ||--o{ favorites : "contains"
    research_works ||--o{ download_view_logs : "records_clicks"
```

---

## 4. State Diagram (แผนภาพสถานะ)

แสดงวงจรชีวิตของผลงานวิจัย (Research Work Lifecycle) ตั้งแต่การส่งร่างแรกไปจนถึงการอนุมัติเผยแพร่:

```mermaid
stateDiagram-v2
    [*] --> Draft : นักศึกษาสร้างผลงาน (ฉบับร่าง)
    Draft --> Pending : นักศึกษาส่งตรวจสอบ (Submit)
    
    state "รอตรวจสอบ (Pending)" as Pending
    state "ต้องส่งแก้ไข (Needs Revision)" as NeedsRevision
    state "อนุมัติแล้ว (Approved)" as Approved
    state "ไม่อนุมัติ (Rejected)" as Rejected

    Pending --> Approved : อาจารย์ที่ปรึกษา อนุมัติการเผยแพร่
    Pending --> NeedsRevision : อาจารย์ส่งข้อคิดเห็นให้แก้ไขข้อมูล/เอกสาร
    Pending --> Rejected : อาจารย์ไม่อนุมัติผลงาน

    NeedsRevision --> Pending : นักศึกษาอัปโหลดไฟล์แก้ไข (FileRevision) และกดส่งใหม่
    
    Approved --> [*] : แสดงผลในระบบและเผยแพร่ (Publicly Published)
    Rejected --> [*] : ไม่เผยแพร่และยุติกระบวนการ
```

---

## 5. Activity Diagram (แผนภาพกิจกรรม)

แสดงเวิร์กโฟลว์ของกระบวนการอัปโหลด ส่งผลงานวิจัย และการดำเนินงานของผู้ประเมินในการอนุมัติผลงาน:

```mermaid
flowchart TD
    Start([เริ่มต้น]) --> InputData[นักศึกษากรอกข้อมูลผลงานวิจัย]
    InputData --> UploadFiles[อัปโหลดภาพหน้าปกและไฟล์ PDF]
    UploadFiles --> SelectAdvisor[ระบุอาจารย์ที่ปรึกษาและเลือกหมวดหมู่]
    SelectAdvisor --> Submit[คลิกส่งผลงาน / Submit]
    Submit --> SetPending[ระบบเปลี่ยนสถานะเป็น Pending รอตรวจสอบ]
    
    SetPending --> ReviewQueue{อาจารย์ตรวจสอบผลงาน}
    
    ReviewQueue -- ข้อมูลถูกต้อง --> Approve[อนุมัติผลงาน / Approved]
    Approve --> Publish[ระบบตั้งค่าเผยแพร่ published_at และแสดงผลสาธารณะ]
    Publish --> End([สิ้นสุดกระบวนการ])

    ReviewQueue -- ข้อมูลไม่ถูกต้อง/ต้องปรับปรุง --> NeedsRevision[ส่งกลับแก้ไข / Needs Revision]
    NeedsRevision --> WriteComment[เขียนข้อคิดเห็น/ReviewComment แจ้งนักศึกษา]
    WriteComment --> ViewComment[นักศึกษาเปิดดูข้อคิดเห็นบนระบบ]
    ViewComment --> EditWork[นักศึกษาแก้ไขข้อมูลหรือแนบไฟล์เอกสารเพิ่มเติม]
    EditWork --> SubmitRevision[กดส่งเอกสารรุ่นปรับปรุง / FileRevision]
    SubmitRevision --> SetPending
```

---

## 6. Sequence Diagram (แผนภาพลำดับเหตุการณ์)

แสดงลำดับการส่งและตรวจสอบงานวิจัยระหว่าง นักศึกษา, ระบบหน้าบ้าน (Next.js), ระบบหลังบ้าน (FastAPI REST API), และฐานข้อมูล (PostgreSQL DB):

```mermaid
sequenceDiagram
    autonumber
    actor Student as นักศึกษา
    participant Frontend as Frontend (Next.js)
    participant Backend as Backend (FastAPI)
    participant DB as Database (PostgreSQL)

    Student->>Frontend: กรอกข้อมูลและส่งผลงานวิจัย (อัปโหลด PDF)
    activate Frontend
    Frontend->>Backend: HTTP POST /api/research (พร้อม JWT)
    activate Backend
    Backend->>Backend: ตรวจสอบความถูกต้องของสิทธิ์และข้อมูล
    Backend->>DB: บันทึกข้อมูลวิจัยใหม่ (สถานะ = 'pending')
    activate DB
    DB-->>Backend: ยืนยันบันทึกข้อมูล (research_id)
    deactivate DB
    Backend->>DB: บันทึกความสัมพันธ์ผู้เขียนและอาจารย์ที่ปรึกษา
    activate DB
    DB-->>Backend: ยืนยันบันทึกสำเร็จ
    deactivate DB
    Backend-->>Frontend: ส่งข้อมูลตอบรับ HTTP 201 (Created)
    deactivate Backend
    Frontend-->>Student: แสดงผลการส่งงานรอการตรวจสอบสำเร็จ
    deactivate Frontend
```

---

## 7. Component Diagram (แผนภาพคอมโพเนนต์)

แสดงสถาปัตยกรรมระดับซอฟต์แวร์ ส่วนประกอบของหน้าบ้าน (Next.js Component Modules) และหลังบ้าน (FastAPI Endpoints / Services / ORM):

```mermaid
graph TD
    subgraph UI_Client_Layer [Frontend: Next.js Platform]
        Pages[App Pages / Routes] --> Components[React UI Components]
        Components --> Features[Feature Modules: Submission, Review, Search]
        Features --> APIService[API Services / Axios client]
    end

    subgraph API_Server_Layer [Backend: FastAPI System]
        APIService -->|HTTP Requests + JWT| Routers[API Routers / Endpoints]
        Routers -->|Authorization dep| Deps[Dependency injection / JWT Verify]
        Routers --> Services[Business Services: Research, Auth, Stats]
        Services --> Models[SQLAlchemy Database Models]
    end

    subgraph Data_Storage_Layer [Relational & Static Storage]
        Models -->|Async connection| PostgreSQL[(PostgreSQL Database)]
        Services -->|File Write| StaticFolder[Static Disk Files: /static/documents/]
    end
```
