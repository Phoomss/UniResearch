import Link from "next/link";
import { Eye, Download, Calendar, ArrowRight } from "lucide-react";

import type { ResearchViewModel } from "@/src/features/research/adapters";

import { ArchiveTab, Status } from "./ui";

function statusTone(
  status: ResearchViewModel["status"],
): "approved" | "review" | "revision" | "error" {
  return status === "approved"
    ? "approved"
    : status === "revision_needed"
      ? "revision"
      : status === "rejected"
        ? "error"
        : "review";
}

function statusLabel(item: ResearchViewModel) {
  return item.status === "approved"
    ? "เผยแพร่แล้ว"
    : item.status === "pending"
      ? "รอตรวจสอบ"
      : item.status === "rejected"
        ? "ไม่ผ่านการตรวจสอบ"
        : item.status === "revision_needed"
          ? "ต้องแก้ไข"
          : `สถานะ: ${item.statusRaw}`;
}

type ResearchItemProps = {
  item: ResearchViewModel;
  variant?: "default" | "explore";
};

export function FolioCard({ item, variant = "default" }: ResearchItemProps) {
  if (variant === "explore") {
    return (
      <article className="explore-folio">
        <header>
          <div>
            <span className="explore-folio-category"><i />{item.category}</span>
            <span className="explore-folio-status">[ {statusLabel(item)} ]</span>
          </div>
          <div className="explore-folio-reference">
            <span>REF. {item.ref}</span>
            <span>{item.published}</span>
          </div>
        </header>

        <div className="explore-folio-copy">
          <h3><Link prefetch={false} href={`/research/${item.id}`}>{item.titleTh}</Link></h3>
          <p className="explore-folio-english">{item.titleEn}</p>
          <p className="explore-folio-abstract">{item.abstract}</p>
        </div>

        <footer>
          <div className="explore-folio-details">
            <span><small>Department</small>{item.department}</span>
            <span><small>Academic year</small>{item.year}</span>
          </div>
          <div className="explore-folio-stats" aria-label="สถิติผลงาน">
            <span title="จำนวนการเข้าชม"><Eye size={14} className="inline-icon" /> {item.views.toLocaleString()}</span>
            <span title="จำนวนดาวน์โหลด"><Download size={14} className="inline-icon" /> {item.downloads.toLocaleString()}</span>
          </div>
        </footer>
      </article>
    );
  }

  const truncatedAbstract = item.abstract && item.abstract.length > 140
    ? item.abstract.substring(0, 140) + "..."
    : item.abstract || "ไม่มีบทคัดย่อ";

  return (
    <article className="folio">
      <div className="folio-head">
        <ArchiveTab>{item.category}</ArchiveTab>
        <span className="mono muted">[ {item.ref} ]</span>
      </div>

      <div className="folio-body">
        <h2>
          <Link prefetch={false} href={`/research/${item.id}`}>
            {item.titleTh}
          </Link>
        </h2>
        {item.titleEn && <em className="latin">{item.titleEn}</em>}
        <p className="muted folio-abstract">{truncatedAbstract}</p>
      </div>

      <div className="folio-meta">
        <Status tone={statusTone(item.status)}>
          {statusLabel(item)}
        </Status>

        <span className="meta-year" title="ปีการศึกษา">
          <Calendar size={14} className="inline-icon" /> {item.year}
        </span>

        <span className="meta-stats">
          <span title="จำนวนการเข้าชม"><Eye size={14} className="inline-icon" /> {item.views}</span>
          <span title="จำนวนดาวน์โหลด"><Download size={14} className="inline-icon" /> {item.downloads}</span>
        </span>
      </div>

      <div className="folio-action">
        <Link prefetch={false} href={`/research/${item.id}`} className="read-more-link">
          <span>อ่านรายละเอียด</span>
          <ArrowRight size={15} className="arrow-icon" />
        </Link>
      </div>

      <span className="citation-line" aria-hidden="true" />
    </article>
  );
}

export function ResearchRow({ item }: ResearchItemProps) {
  return (
    <article className="research-row">
      <div>
        <span className="mono">{item.ref}</span>

        <div style={{ marginTop: 7 }}>
          <Status tone={statusTone(item.status)}>
            {statusLabel(item)}
          </Status>
        </div>
      </div>

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: 21,
          }}
        >
          <Link prefetch={false} href={`/research/${item.id}`}>
            {item.titleTh}
          </Link>
        </h3>

        <span className="muted">
          สร้างเมื่อ: {item.created} • {item.category}
        </span>
      </div>

      <span className="latin muted">
        ◉ {item.views}　⇩ {item.downloads}
      </span>
    </article>
  );
}
