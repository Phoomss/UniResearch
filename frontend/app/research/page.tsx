import { FolioCard } from "@/src/components/research";
import { SiteFooter, SiteHeader } from "@/src/components/shells";
import { Button, Input, Select, StatePanel } from "@/src/components/ui";
import { getCategories, searchResearch } from "@/src/features/research/api";
import { adaptResearch } from "@/src/features/research/adapters";

export default async function ResearchPage({ searchParams }: { searchParams: Promise<{ q?: string; category_id?: string }> }) {
  const query = await searchParams;
  const categoryId = query.category_id && Number.isInteger(Number(query.category_id)) ? Number(query.category_id) : undefined;
  const [result, categories] = await Promise.all([searchResearch({ q: query.q, categoryId }), getCategories()]);
  const cats = categories.ok ? categories.data : [];
  const works = result.ok ? result.data.map(x => adaptResearch(x, cats)) : [];

  return <><SiteHeader /><main className="container search-layout"><aside className="filters"><p className="eyebrow">Explore Research</p><h1 className="section-title">ค้นหาดัชนี</h1><form className="filter-body"><section><label htmlFor="q">คำค้น</label><Input id="q" name="q" defaultValue={query.q} /></section><section><label htmlFor="category_id">หมวดหมู่</label><Select id="category_id" name="category_id" defaultValue={query.category_id ?? ""}><option value="">ทุกหมวดหมู่</option>{cats.map(x => <option key={x.id} value={x.id}>{x.category_name}</option>)}</Select></section><Button type="submit">ใช้ตัวกรอง</Button></form><p className="muted" style={{ marginTop: 24 }}>ระบบรองรับเฉพาะคำค้นและหมวดหมู่ ไม่มีการเรียงลำดับหรือแบ่งหน้าจากระบบหลังบ้าน</p></aside><section><p className="eyebrow">Search Results • Bare Array</p><h1 className="title">{works.length.toLocaleString()} ผลลัพธ์{query.q ? `สำหรับ “${query.q}”` : ""}</h1>{result.ok ? (works.length ? <div className="result-list">{works.map(item => <FolioCard key={item.id} item={item} />)}</div> : <StatePanel kind="empty" title="ไม่พบผลงาน" detail="ลองเปลี่ยนคำค้นหรือหมวดหมู่" />) : <StatePanel kind="error" title="โหลดผลงานไม่สำเร็จ" detail={result.error.message} />}</section></main><SiteFooter /></>;
}
