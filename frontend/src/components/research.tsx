import Link from "next/link";

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
            <span title="จำนวนการเข้าชม">◉ {item.views.toLocaleString()}</span>
            <span title="จำนวนดาวน์โหลด">⇩ {item.downloads.toLocaleString()}</span>
          </div>
        </footer>
      </article>
    );
  }

  return (
    <article className="folio">
      <div className="folio-head">
        <ArchiveTab>{item.category}</ArchiveTab>

        <span className="mono muted">[ {item.ref} ]</span>
      </div>

      <h2>
        <Link prefetch={false} href={`/research/${item.id}`}>
          {item.titleTh}
        </Link>
      </h2>

      <em className="latin">{item.titleEn}</em>

      <p className="muted">{item.abstract}</p>

      <div className="folio-meta">
        <Status tone={statusTone(item.status)}>
          {statusLabel(item)}
        </Status>

        <span>
          ปีการศึกษา: <b>{item.year}</b>
        </span>

        <span className="latin">
          ◉ {item.views}　⇩ {item.downloads}
        </span>
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
