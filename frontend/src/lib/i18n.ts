import { cookies } from "next/headers";

export type Language = "th" | "en";

export async function getLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("lang")?.value;
    return lang === "en" ? "en" : "th";
  } catch {
    return "th";
  }
}

export const translations = {
  th: {
    // Navigation & Shells
    searchWorks: "ค้นหาผลงาน",
    exploreCategories: "สำรวจหมวดหมู่",
    aboutSystem: "เกี่ยวกับระบบ",
    login: "เข้าสู่ระบบ",
    submitResearch: "ส่งผลงานวิจัย",
    logout: "ออกจากระบบ",
    quickLinks: "ลิงก์ด่วน",
    support: "ติดต่อช่วยเหลือ",
    rightsReserved: "© 2026 University Research Index. จัดทำโดย SE67",
    contribute: "มีส่วนร่วม",
    institutionalPortal: "คลังสถาบัน",
    
    // Homepage
    heroTitlePart1: "ทุกงานวิจัย คือ",
    heroTitlePart2: "จุดเริ่มต้นของคำถามถัดไป",
    heroSubtitle: "ฐานข้อมูลงานวิจัย โครงงาน และวิทยานิพนธ์ ที่เปิดพื้นที่ให้องค์ความรู้ถูกส่งต่อ และต่อยอดอย่างไม่มีที่สิ้นสุด",
    searchPlaceholder: "ค้นหาผลงานวิจัย, ผู้แต่ง, อาจารย์ที่ปรึกษา, หรือคำสำคัญ...",
    searchButton: "ค้นหา",
    featured: "ผลงานแนะนำ",
    openFolio: "เปิดผลงาน",
    noFeatured: "ยังไม่มีผลงานแนะนำ",
    totalResearch: "ผลงานวิจัยทั้งหมด",
    totalResearchers: "ผู้จัดทำและนักวิจัย",
    academicCategories: "หมวดหมู่วิชาการ",
    totalDownloads: "ยอดดาวน์โหลดทั้งหมด",
    latestResearch: "ผลงานล่าสุดจากคลังวิจัย",
    exploreAll: "สำรวจทั้งหมด",
    noLatest: "ยังไม่มีผลงานที่เผยแพร่",
    researchIndex: "สำรวจองค์ความรู้ตามหมวดหมู่",
    ctaTitle: "เริ่มต้นบทสนทนาทางวิชาการครั้งถัดไป",
    ctaSubtitle: "เผยแพร่ผลงานของคุณในคลังกลางที่เชื่อมโยงผู้เรียน นักวิจัย และสังคมแห่งการเรียนรู้",
    
    // Search Page / Explorer
    exploreResearch: "สำรวจงานวิจัย",
    filterDescription: "ค้นหาผลงานวิชาการด้วยตัวกรองที่ตรงใจ",
    activeFilters: "ตัวกรองที่เลือก",
    academicYear: "ปีการศึกษา",
    fromYear: "จาก (พ.ศ.)",
    toYear: "ถึง (พ.ศ.)",
    yearRangeError: "ปีเริ่มต้นต้องไม่มากกว่าปีสิ้นสุด",
    clearFilters: "ล้างตัวกรอง",
    searchResults: "ผลการค้นหา",
    resultsCount: "รายการผลลัพธ์",
    noResults: "ไม่พบผลงาน",
    noResultsDetail: "ลองเปลี่ยนคำค้นหรือหมวดหมู่งานวิจัย",
    loadFailed: "โหลดผลงานไม่สำเร็จ",
    sortDefault: "ค่าเริ่มต้น",
    searchSuggestions: [
      "ค้นหาจากชื่อผลงานวิจัย",
      "ค้นหาจากชื่อผู้จัดทำ",
      "ค้นหาจากอาจารย์ที่ปรึกษา",
      "ค้นหาด้วยคำสำคัญ เช่น AI หรือ Data Science",
      "ค้นหาโครงงาน Web Application",
      "ค้นหาผลงานตามปีการศึกษา",
    ],
  },
  en: {
    // Navigation & Shells
    searchWorks: "Search Works",
    exploreCategories: "Explore Categories",
    aboutSystem: "About System",
    login: "Log In",
    submitResearch: "Submit Research",
    logout: "Log Out",
    quickLinks: "QUICK LINKS",
    support: "SUPPORT",
    rightsReserved: "© 2026 University Research Index. Edited by SE67",
    contribute: "Contribute",
    institutionalPortal: "Institutional Portal",

    // Homepage
    heroTitlePart1: "Every research is",
    heroTitlePart2: "the start of the next question",
    heroSubtitle: "A repository of research, projects, and theses designed to pass on knowledge and build upon it endlessly.",
    searchPlaceholder: "Search research titles, authors, advisors, or keywords...",
    searchButton: "Search",
    featured: "Featured",
    openFolio: "Open Folio",
    noFeatured: "No featured works available",
    totalResearch: "Total Research Works",
    totalResearchers: "Authors & Researchers",
    academicCategories: "Academic Categories",
    totalDownloads: "Total Downloads",
    latestResearch: "Latest Research",
    exploreAll: "Explore All",
    noLatest: "No published works yet",
    researchIndex: "Explore Knowledge by Category",
    ctaTitle: "Start the Next Academic Conversation",
    ctaSubtitle: "Publish your work in the central repository that connects learners, researchers, and a learning society.",

    // Search Page / Explorer
    exploreResearch: "Explore Research",
    filterDescription: "Find academic work with search filters tailored for you",
    activeFilters: "Active Filters",
    academicYear: "Academic Year",
    fromYear: "From (B.E.)",
    toYear: "To (B.E.)",
    yearRangeError: "Starting year cannot exceed ending year",
    clearFilters: "Clear Filters",
    searchResults: "Search Results",
    resultsCount: "results found",
    noResults: "No results found",
    noResultsDetail: "Try changing your search terms or research category",
    loadFailed: "Failed to load research works",
    sortDefault: "Default Sort",
    searchSuggestions: [
      "Search by research title",
      "Search by author name",
      "Search by advisor",
      "Search by keywords like AI or Data Science",
      "Search for Web Applications",
      "Search by academic year",
    ],
  }
} as const;

export type TranslationKey = keyof typeof translations["th"];
export type TranslationDict = typeof translations["th"];
