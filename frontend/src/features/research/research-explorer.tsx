"use client";

import { useMemo, useState, type FormEvent } from "react";
import { FileSearch, Grid2X2, List, Search } from "lucide-react";

import { FolioCard } from "@/src/components/research";
import { Button, Input, StatePanel } from "@/src/components/ui";
import type { ResearchViewModel } from "@/src/features/research/adapters";

export const RESEARCH_CATEGORIES = [
  "เทคโนโลยีสารสนเทศและคอมพิวเตอร์",
  "วิศวกรรมศาสตร์และเทคโนโลยี",
  "วิทยาศาสตร์และนวัตกรรม",
  "สุขภาพและการแพทย์",
  "เกษตรและอาหาร",
  "สิ่งแวดล้อมและทรัพยากรธรรมชาติ",
  "บริหารธุรกิจและเศรษฐศาสตร์",
  "การศึกษาและการเรียนรู้",
  "สังคมศาสตร์และพฤติกรรมศาสตร์",
  "รัฐศาสตร์ กฎหมาย และการบริหารรัฐกิจ",
  "มนุษยศาสตร์ ภาษา และศิลปกรรม",
  "นิเทศศาสตร์และสื่อดิจิทัล",
  "การท่องเที่ยวและบริการ",
  "การพัฒนาชุมชนและท้องถิ่น",
  "สหวิทยาการ",
] as const;

type ResearchCategory = (typeof RESEARCH_CATEGORIES)[number];

type ResearchExplorerProps = {
  works: ResearchViewModel[];
  initialQuery?: string;
  errorMessage?: string;
};

export function ResearchExplorer({
  works,
  initialQuery = "",
  errorMessage,
}: ResearchExplorerProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<ResearchCategory[]>([]);
  const [academicYearRange, setAcademicYearRange] = useState({ from: "", to: "" });

  const fromYear = Number.parseInt(academicYearRange.from, 10);
  const toYear = Number.parseInt(academicYearRange.to, 10);
  const hasFromYear = academicYearRange.from.trim().length > 0;
  const hasToYear = academicYearRange.to.trim().length > 0;
  const hasAcademicYearFilter = hasFromYear || hasToYear;
  const hasFilter = selectedCategories.length > 0 || hasAcademicYearFilter;
  const invalidYearRange = hasFromYear && hasToYear && fromYear > toYear;

  const filteredWorks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase("th");

    return works.filter((item) => {
      const searchableText = [
        item.titleTh,
        item.titleEn,
        item.abstract,
        item.category,
        item.department,
        item.workType,
        ...item.keywords,
      ]
        .join(" ")
        .toLocaleLowerCase("th");
      const matchesSearch =
        normalizedSearch.length === 0 || searchableText.includes(normalizedSearch);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) => category === item.category);
      const itemYear = Number.parseInt(item.year, 10);
      const matchesAcademicYear =
        (!hasFromYear && !hasToYear) ||
        (Number.isFinite(itemYear) &&
          (!hasFromYear || itemYear >= fromYear) &&
          (!hasToYear || itemYear <= toYear));

      return matchesSearch && matchesAcademicYear && matchesCategory;
    });
  }, [fromYear, hasFromYear, hasToYear, searchTerm, selectedCategories, toYear, works]);

  function toggleCategory(category: ResearchCategory) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  function preventSearchReload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function clearFilters() {
    setAcademicYearRange({ from: "", to: "" });
    setSelectedCategories([]);
  }

  return (
    <div className="research-explore-layout">
      <aside className="research-filters">
        <div className="research-filter-intro">
          <h1>สำรวจงานวิจัย</h1>
          <p>
            ค้นหาผลงานวิชาการด้วยตัวกรองที่ตรงใจ
          </p>
        </div>

        {hasFilter && (
          <section className="research-active-filters" aria-label="ตัวกรองที่เลือก">
            <span className="research-filter-label">ตัวกรองที่เลือก</span>
            <div>
              {hasAcademicYearFilter && (
                <button
                  className="research-filter-chip"
                  type="button"
                  onClick={() => setAcademicYearRange({ from: "", to: "" })}
                  aria-label="ยกเลิกตัวกรองปีการศึกษา"
                >
                  ปีการศึกษา: {hasFromYear ? academicYearRange.from : "เริ่มต้น"}
                  {" – "}
                  {hasToYear ? academicYearRange.to : "ปัจจุบัน"}
                  <span aria-hidden="true">×</span>
                </button>
              )}
              {selectedCategories.map((category) => (
                <button
                  key={category}
                  className="research-filter-chip category"
                  type="button"
                  onClick={() => toggleCategory(category)}
                  aria-label={`ยกเลิกตัวกรอง ${category}`}
                >
                  {category} <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <form className="research-filter-form" onSubmit={preventSearchReload}>
          <section>
            <label className="research-filter-label" htmlFor="research-keyword">
              Keyword
            </label>
            <div className="research-keyword-field">
              <Search aria-hidden="true" size={17} />
              <Input
                id="research-keyword"
                name="q"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="ค้นหาชื่อหรือคำสำคัญ"
              />
            </div>
          </section>

          <section>
            <span className="research-filter-label">ปีการศึกษา</span>
            <div className="research-academic-year-fields">
              <label className="sr-only" htmlFor="academic-year-from">
                ปีการศึกษาเริ่มต้น
              </label>
              <Input
                id="academic-year-from"
                type="number"
                inputMode="numeric"
                min="0"
                value={academicYearRange.from}
                onChange={(event) =>
                  setAcademicYearRange((current) => ({
                    ...current,
                    from: event.target.value,
                  }))
                }
                placeholder="จาก (พ.ศ. 2565)"
                aria-invalid={invalidYearRange}
                aria-describedby={invalidYearRange ? "academic-year-error" : undefined}
              />
              <label className="sr-only" htmlFor="academic-year-to">
                ปีการศึกษาสิ้นสุด
              </label>
              <Input
                id="academic-year-to"
                type="number"
                inputMode="numeric"
                min="0"
                value={academicYearRange.to}
                onChange={(event) =>
                  setAcademicYearRange((current) => ({
                    ...current,
                    to: event.target.value,
                  }))
                }
                placeholder="ถึง (พ.ศ. 2568)"
                aria-invalid={invalidYearRange}
                aria-describedby={invalidYearRange ? "academic-year-error" : undefined}
              />
            </div>
            {invalidYearRange && (
              <small className="research-year-error" id="academic-year-error" role="alert">
                ปีเริ่มต้นต้องไม่มากกว่าปีสิ้นสุด
              </small>
            )}
          </section>

          <section>
            <div className="research-category-heading">
              <span className="research-filter-label">หมวดหมู่งานวิจัย</span>
              {selectedCategories.length > 0 && (
                <span className="research-category-count">
                  {selectedCategories.length} เลือก
                </span>
              )}
            </div>
            <div className="research-category-options">
              {RESEARCH_CATEGORIES.map((category) => {
                const selected = selectedCategories.includes(category);

                return (
                  <label className={selected ? "selected" : undefined} key={category}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {hasFilter && (
            <Button
              className="research-clear-category-button"
              type="button"
              variant="ghost"
              onClick={clearFilters}
            >
              ล้างตัวกรอง
            </Button>
          )}
        </form>
      </aside>

      <section className="research-results" aria-labelledby="research-results-title">
        <div className="research-results-header">
          <div>
            <p className="research-results-kicker">
              <span>Search results</span><i /> <span>Folio index</span>
            </p>
            <h2 id="research-results-title">
              {filteredWorks.length.toLocaleString()} Results
              {searchTerm.trim() && <> for <em>“{searchTerm.trim()}”</em></>}
            </h2>
          </div>
          <div className="research-view-tools" aria-label="รูปแบบการแสดงผล">
            <span>Sort: ค่าเริ่มต้น</span>
            <button type="button" aria-label="แสดงแบบรายการ" aria-pressed="true">
              <List size={18} />
            </button>
            <button type="button" aria-label="มุมมองตารางยังไม่พร้อมใช้งาน" disabled>
              <Grid2X2 size={16} />
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="research-error-state">
            <StatePanel
              kind="error"
              title="โหลดผลงานไม่สำเร็จ"
              detail={errorMessage}
            />
          </div>
        ) : filteredWorks.length ? (
          <div className="research-folio-list">
            {filteredWorks.map((item) => (
              <FolioCard key={item.id} item={item} variant="explore" />
            ))}
          </div>
        ) : (
          <div className="research-empty-state">
            <StatePanel
              kind="empty"
              title="ไม่พบผลงาน"
              detail="ลองเปลี่ยนคำค้นหรือหมวดหมู่งานวิจัย"
              icon={<FileSearch size={22} strokeWidth={1.8} />}
            />
          </div>
        )}
      </section>
    </div>
  );
}
