import Link from "next/link";
import {
  AlertTriangle as AlertSquare,
  BookOpen,
  Download,
  Eye,
  FileClock,
  Users,
} from "lucide-react";

import { adminResearchSamples } from "@/src/features/admin/admin-data";
import { getStats } from "@/src/features/research/api";

export default async function AdminOverview() {
  const statsResult = await getStats();
  const stats = statsResult.ok
    ? statsResult.data
    : {
        total_users: 0,
        total_research_works: 0,
        total_views: 0,
        total_downloads: 0,
      };

  const cards = [
    {
      label: "ผลงานทั้งหมด",
      value: stats.total_research_works,
      detail: "ผลงานตีพิมพ์ทั้งหมด",
      icon: BookOpen,
    },
    {
      label: "รอตรวจสอบ",
      value: adminResearchSamples.filter((item) => item.status === "pending")
        .length,
      detail: "รอตรวจสอบผลงาน",
      icon: FileClock,
      featured: true,
    },
    {
      label: "ผู้ใช้งานทั้งหมด",
      value: stats.total_users,
      detail: "ผู้เขียนผลงานวิจัย",
      icon: Users,
    },
    {
      label: "การเข้าชมทั้งหมด",
      value: stats.total_views,
      detail: "การเข้าดูคลังข้อมูล",
      icon: Eye,
    },
    {
      label: "การดาวน์โหลดทั้งหมด",
      value: stats.total_downloads,
      detail: "ดาวน์โหลดฉบับเต็ม",
      icon: Download,
      wide: true,
    },
  ];

  return (
    <main className="admin-main">
      <header className="admin-page-heading admin-dashboard-heading">
        <p>
          <span /> ข้อมูลภาพรวมของผู้ดูแลระบบ
        </p>
        <h1>ภาพรวมระบบ</h1>
        <div className="admin-heading-rule">
          <span>
            ติดตามกิจกรรมการเก็บถาวรผลงานวิจัย การมีส่วนร่วมของผู้ใช้
            และการตรวจสอบผลงานที่รอดำเนินการในคลังสถาบันการศึกษา
          </span>
        </div>
      </header>

      <section className="admin-metric-grid">
        {cards.map(
          ({ label, value, detail, icon: Icon, featured, wide }) => (
            <article
              className={`${featured ? "featured" : ""} ${wide ? "wide" : ""}`}
              key={label}
            >
              <div>
                <span>{label}</span>
                <Icon size={18} />
              </div>
              <strong>{value.toLocaleString()}</strong>
              <small>{detail}</small>
            </article>
          ),
        )}
      </section>

      <div className="admin-dashboard-columns">
        <section className="admin-attention">
          <header>
            <h2>
                งานที่ต้องดำเนินการ
            </h2>
            <span>ต้องดำเนินการด่วน</span>
          </header>

          {adminResearchSamples
            .filter((item) => item.status === "pending")
            .slice(0, 3)
            .map((item) => (
              <article key={item.id}>
                <div>
                  <p>
                    <span>รอตรวจสอบ</span> [อ้างอิง: {item.ref}]
                  </p>
                  <h3>{item.title}</h3>
                  <small>
                    ส่งโดย: {item.author} • {item.updated}
                  </small>
                </div>
                <Link href={`/admin/reviews/${item.id}`}>ตรวจสอบ</Link>
              </article>
            ))}

          <Link className="admin-view-all" href="/admin/reviews">
            ดูรายการรอดำเนินการทั้งหมด →
          </Link>
        </section>

        <aside className="admin-dashboard-insights">
          <section>
            <h3>สัดส่วนสถานะ</h3>
            <div className="admin-donut">
              <strong>94%</strong>
              <span>เผยแพร่แล้ว</span>
            </div>
            <ul>
              <li>
                <i className="published" />
                เผยแพร่แล้ว
                <strong>
                  {Math.max(
                    stats.total_research_works - 2,
                    0,
                  ).toLocaleString()}
                </strong>
              </li>
              <li>
                <i className="pending" />
                รอตรวจสอบ <strong>2</strong>
              </li>
              <li>
                <i className="draft" />
                แบบร่าง <strong>4</strong>
              </li>
            </ul>
          </section>

          <section>
            <h3>ผลงานวิจัยตามปีการศึกษา</h3>
            <div className="admin-mini-bars">
              {[35, 48, 42, 62, 74, 88].map((height, index) => (
                <i style={{ height: `${height}%` }} key={index} />
              ))}
            </div>
          </section>

          <section>
            <h3>คำค้นหายอดนิยม [ 30 วันที่ผ่านมา ]</h3>
            <div className="admin-keywords">
              <span>Machine Learning</span>
              <span>การศึกษาปฐมวัย</span>
              <span>Sustainability</span>
              <span>Data Science</span>
              <span>AI</span>
              <span>Public Health</span>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
