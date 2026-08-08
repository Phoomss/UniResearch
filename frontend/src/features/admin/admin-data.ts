export type AdminResearchRecord = {
  id: number;
  ref: string;
  title: string;
  titleEn: string;
  author: string;
  advisor: string;
  category: string;
  year: string;
  status: "pending" | "approved" | "rejected" | "revision_needed";
  updated: string;
  abstract: string;
  views: number;
  downloads: number;
};

export const adminResearchSamples: AdminResearchRecord[] = [
  {
    id: 89,
    ref: "SS-2024-089",
    title: "ผลกระทบของสื่อสังคมออนไลน์ต่อพฤติกรรมการมีส่วนร่วมทางการเมืองของเยาวชนไทยในเขตเมือง",
    titleEn: "The Impact of Social Media on Political Participation Behaviors among Thai Urban Youth",
    author: "วิไลลักษณ์ มหาวงศ์",
    advisor: "ผศ. ดร.สุดา มณีรัตน์",
    category: "สังคมศาสตร์",
    year: "2567",
    status: "pending",
    updated: "2 ชั่วโมงที่แล้ว",
    abstract: "งานวิจัยนี้มุ่งเน้นการศึกษาผลกระทบของการใช้สื่อสังคมออนไลน์ต่อพฤติกรรมการมีส่วนร่วมทางการเมืองของเยาวชนไทยระดับอุดมศึกษาในเขตกรุงเทพมหานครและปริมณฑล โดยใช้ระเบียบวิธีวิจัยแบบผสมผสาน เก็บรวบรวมข้อมูลเชิงปริมาณจากกลุ่มตัวอย่าง 800 คน และข้อมูลเชิงคุณภาพผ่านการสัมภาษณ์เชิงลึกจำนวน 30 คน",
    views: 12450,
    downloads: 3210,
  },
  {
    id: 42,
    ref: "CS-2024-041",
    title: "การพัฒนาโปรแกรมประยุกต์บนเว็บเพื่อการจัดการห้องสมุด",
    titleEn: "Web Application Development for Library Management",
    author: "สมชาย รักเรียน",
    advisor: "อ.ปทีปรักษา ดร. สมศักดิ์ สุขใจ",
    category: "เทคโนโลยี",
    year: "2567",
    status: "pending",
    updated: "2 ชั่วโมงที่แล้ว",
    abstract: "การพัฒนาระบบสารสนเทศเพื่อเพิ่มประสิทธิภาพการจัดการทรัพยากรห้องสมุดและการค้นคืนข้อมูลสำหรับผู้ใช้งานระดับมหาวิทยาลัย",
    views: 8540,
    downloads: 1890,
  },
  {
    id: 21,
    ref: "SOC-2023-112",
    title: "ผลกระทบของโซเชียลมีเดียต่อสุขภาพจิตของวัยรุ่นในเขตเมืองหลวง",
    titleEn: "Social Media and Adolescent Mental Health",
    author: "มารี แสงสว่าง",
    advisor: "ผศ. นารี งามดี",
    category: "สังคมศาสตร์",
    year: "2566",
    status: "approved",
    updated: "15 มิ.ย. 67",
    abstract: "การสำรวจความสัมพันธ์ระหว่างระยะเวลาการใช้งานสื่อสังคมออนไลน์และสุขภาวะทางจิตของวัยรุ่นในเขตเมือง",
    views: 9820,
    downloads: 2150,
  },
  {
    id: 9,
    ref: "ENG-2024-009",
    title: "การออกแบบโครงสร้างต้านแผ่นดินไหวเบื้องต้น",
    titleEn: "Preliminary Seismic Resistant Structural Design",
    author: "ก้องเกียรติ มั่นคง",
    advisor: "อ.ทวีปวิชา รศ. ชัยชาญ ชำนาญ",
    category: "วิศวกรรมศาสตร์",
    year: "2567",
    status: "rejected",
    updated: "เมื่อวานนี้",
    abstract: "แนวทางการวิเคราะห์และออกแบบโครงสร้างอาคารเพื่อรองรับแรงสั่นสะเทือนตามมาตรฐานวิศวกรรม",
    views: 6200,
    downloads: 950,
  },
];

export const adminUsers = [
  { name: "ดร. พิมพกานต์ ศรีสมุทร", subtitle: "Assoc. Professor", email: "pimpakan.s@uni.ac.th", id: "STAFF-9021", department: "สังคมวิทยา", role: "admin", active: true },
  { name: "ณัฐวุฒิ ใจดี", subtitle: "Senior Researcher", email: "nattawut.j@uni.ac.th", id: "RES-4412", department: "วิทยาการคอมพิวเตอร์", role: "reviewer", active: true },
  { name: "สิริวิมล แสงทอง", subtitle: "Undergraduate", email: "siri.s@student.uni.ac.th", id: "64010245", department: "ประวัติศาสตร์ศิลปะ", role: "student", active: true },
  { name: "ผู้ใช้ชั่วคราว #921", subtitle: "External Visitor", email: "guest921@example.com", id: "–", department: "ไม่ระบุ", role: "guest", active: false },
] as const;
