import Link from "next/link";
import { FolioCard } from "@/src/components/research";
import { SiteFooter, SiteHeader } from "@/src/components/shells";
import { Button } from "@/src/components/ui";
import { adaptResearch } from "@/src/features/research/adapters";
import { getCategories, getLatest, getPopular, getStats } from "@/src/features/research/api";
import { FileUp, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import SearchTypewriter from "@/src/components/ui/SearchTypewriter";
const SEARCH_SUGGESTIONS = [
  "ค้นหาจากชื่อผลงานวิจัย",
  "ค้นหาจากชื่อผู้จัดทำ",
  "ค้นหาจากอาจารย์ที่ปรึกษา",
  "ค้นหาด้วยคำสำคัญ เช่น AI หรือ Data Science",
  "ค้นหาโครงงาน Web Application",
  "ค้นหาผลงานตามปีการศึกษา",
];

export default async function Home() {
  const [stats, latest, popular, categories] = await Promise.all([
    getStats(),
    getLatest(3),
    getPopular(3),
    getCategories(),
  ]);
  const categoryItems = categories.ok ? categories.data : [];
  const latestWorks = latest.ok ? latest.data.map(item => adaptResearch(item, categoryItems)) : [];
  const popularWorks = popular.ok ? popular.data.map(item => adaptResearch(item, categoryItems)) : [];
  const featuredWork = popularWorks[0];

  return (
    <>
      <SiteHeader variant="home" />
      <main>
        <section className="discovery-hero">
          <div className="discovery-grid container home-container">
            <div className="discovery-copy">
              <div className="discovery-kicker">
                <i aria-hidden="true" />
                <small>University Research Repository</small>
                <i aria-hidden="true" />
              </div>
              <h1 className="discovery-title">
                ทุกงานวิจัย คือ
                <br />
                <span>จุดเริ่มต้นของคำถามถัดไป</span>
              </h1>
              <p className="discovery-intro">
                ฐานข้อมูลงานวิจัย โครงงาน และวิทยานิพนธ์ ที่เปิดพื้นที่ให้องค์ความรู้ถูกส่งต่อ<br></br>และต่อยอดอย่างไม่มีที่สิ้นสุด
              </p>
              <form className="discovery-search" action="/research">
  <label className="sr-only" htmlFor="home-search">
    คำค้นงานวิจัย
  </label>

  <span aria-hidden="true" className="search-glyph">
    ⌕
  </span>

  <input
    id="home-search"
    name="q"
    type="search"
    placeholder=" "
    autoComplete="off"
  />

  <SearchTypewriter
    texts={SEARCH_SUGGESTIONS}
    typingSpeed={70}
    deletingSpeed={40}
    waitTime={1400}
    className="search-typewriter"
  />

  <Link
    className="search-filter"
    href="/research"
    aria-label="เปิดตัวกรองการค้นหา"
  >
    <SlidersHorizontal size={18} />
  </Link>

  <Button type="submit">ค้นหา</Button>
</form>
            </div>

            <aside className="discovery-feature" aria-label="ผลงานวิจัยยอดนิยม">

              <div className="ghost-folio" aria-hidden="true">
                <span>REF.492</span>
                <div /><div />
                <figure><b>∿</b><b>⌁</b><b>∿</b></figure>
              </div>
              <article className="featured-folio">
                <span className="featured-tab">Featured</span>
                <div className="featured-art" aria-hidden="true"><span>◌</span><i /><i /><i /></div>
                <div className="featured-body">
                  {featuredWork ? (
                    <>
                      <div className="featured-meta"><span>{featuredWork.ref}</span><b>••</b></div>
                      <h2>{featuredWork.titleTh}</h2>
                      <p>{featuredWork.category} · {featuredWork.year}</p>
                      <Link href={`/research/${featuredWork.id}`} prefetch={false} aria-label={`เปิด ${featuredWork.titleTh}`}>
                        <span>เปิดผลงาน</span> ↗
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="featured-meta"><span>FEATURED</span><b>••</b></div>
                      <h2>{popular.ok ? "ยังไม่มีผลงานยอดนิยม" : "ไม่สามารถโหลดผลงานยอดนิยมได้"}</h2>
                      <p>คลังความรู้ของมหาวิทยาลัย</p>
                    </>
                  )}
                </div>
              </article>
            </aside>
          </div>
        </section>

        <section className="discovery-stats" aria-label="สถิติคลังงานวิจัย">
          <div className="container home-container discovery-stat-grid">
            {stats.ok ? (
              <>
                <div><strong>{stats.data.total_research_works.toLocaleString()}</strong><span>ผลงานวิจัยทั้งหมด</span></div>
                <div><strong>{stats.data.total_users.toLocaleString()}</strong><span>ผู้จัดทำและนักวิจัย</span></div>
                <div><strong>{categoryItems.length.toLocaleString()}</strong><span>หมวดหมู่วิชาการ</span></div>
                <div><strong>{stats.data.total_downloads.toLocaleString()}</strong><span>ยอดดาวน์โหลดทั้งหมด</span></div>
              </>
            ) : (
              <div className="discovery-stat-error"><strong>—</strong><span>{stats.error.message}</span></div>
            )}
          </div>
        </section>

        <section className="discovery-section container home-container" aria-labelledby="latest-research">
          <div className="discovery-section-heading">
            <div><p className="eyebrow">[ Latest Research ]</p><h2 className="eyebrow-h2" id="latest-research">ผลงานล่าสุดจากคลังวิจัย</h2></div>
            <Link href="/research">สำรวจทั้งหมด <span aria-hidden="true">→</span></Link>
          </div>
          {latestWorks.length ? (
            <div className="discovery-cards">{latestWorks.map(item => <FolioCard key={item.id} item={item} />)}</div>
          ) : (
            <div className="state"><p>{latest.ok ? "ยังไม่มีผลงานที่เผยแพร่" : latest.error.message}</p></div>
          )}
        </section>

        <section className="discovery-categories" id="about">
          <div className="container home-container">
            <div className="discovery-section-heading">
              <div><p className="eyebrow">[ Research Index ]</p><h2 className="eyebrow-h2">สำรวจองค์ความรู้ตามหมวดหมู่</h2></div>
              <Link href="/research">ค้นหาผลงาน <span aria-hidden="true">→</span></Link>
            </div>
            {categoryItems.length ? (
              <nav className="category-index" aria-label="หมวดหมู่งานวิจัย">
                {categoryItems.map((category, index) => (
                  <Link href={`/research?category_id=${category.id}`} key={category.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{category.category_name}</strong>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                ))}
              </nav>
            ) : <p className="muted">{categories.ok ? "ยังไม่มีหมวดหมู่ในคลัง" : "ไม่สามารถโหลดหมวดหมู่ได้"}</p>}
          </div>
        </section>

        <section className="discovery-cta container home-container">
          <div><p className="eyebrow">[ Contribute ]</p><h2 className="eyebrow-h2">เริ่มต้นบทสนทนาทางวิชาการครั้งถัดไป</h2><p>เผยแพร่ผลงานของคุณในคลังกลางที่เชื่อมโยงผู้เรียน นักวิจัย และสังคมแห่งการเรียนรู้</p></div>
          <Link href="/dashboard/student/submit" className="btn btn-primary">ส่งผลงานวิจัย  <FileUp size={18} /></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
