"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button, Field, Input, Select } from "@/src/components/ui";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Eye, Edit2 } from "lucide-react";
import { AIWritingAssistant } from "@/src/features/ai/writing-assistant";
import { useToast } from "@/src/components/ui/Toast";
import type {
  CategoryResponse,
  ResearchParticipant,
  ResearchParticipantsResponse,
  ResearchWorkResponse,
  ValidationIssue,
} from "@/src/lib/api/types";

const steps = [
  "ข้อมูลงานวิจัย",
  "ผู้จัดทำและอาจารย์",
  "บทคัดย่อ",
  "ไฟล์",
  "ตรวจสอบ",
] as const;

type Values = {
  title_th: string;
  title_en: string;
  category_id: string;
  department: string;
  work_type: string;
  academic_year: string;
  abstract: string;
  keywords: string;
};
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;
type Result =
  | { kind: "error" | "forbidden"; message: string }
  | { kind: "success"; research: ResearchWorkResponse }
  | null;
const initial: Values = {
  title_th: "",
  title_en: "",
  category_id: "",
  department: "",
  work_type: "",
  academic_year: "",
  abstract: "",
  keywords: "",
};
const COVER_LIMIT = 5 * 1024 * 1024,
  DOCUMENT_LIMIT = 25 * 1024 * 1024;
const COVER_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
function participantLabel(person: ResearchParticipant) {
  const name = [person.first_name, person.last_name].filter(Boolean).join(" ");
  return `${name || person.email}${person.student_id ? ` · ${person.student_id}` : ""}`;
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!values.title_th.trim()) errors.title_th = "กรุณากรอกชื่อผลงานภาษาไทย";
  if (!values.title_en.trim())
    errors.title_en = "กรุณากรอกชื่อผลงานภาษาอังกฤษ";
  if (!values.category_id) errors.category_id = "กรุณาเลือกหมวดหมู่";
  if (values.academic_year && !/^\d+$/.test(values.academic_year))
    errors.academic_year = "ปีการศึกษาต้องเป็นจำนวนเต็ม";
  return errors;
}
function fileText(file: File | null) {
  return file
    ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
    : "ไม่ได้เลือก (ไม่บังคับ)";
}

function FileDrop({
  label,
  name,
  file,
  onFile,
  disabled,
  accept,
  error,
}: {
  label: string;
  name: "cover_image" | "document";
  file: File | null;
  onFile: (file: File | null) => void;
  disabled: boolean;
  accept: string;
  error?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  function select(files: FileList | null) {
    onFile(files?.[0] ?? null);
  }
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) select(event.dataTransfer.files);
  }
  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!disabled && (event.key==="Enter"||event.key===" ")) {
      event.preventDefault();
      input.current?.click();
    }
  }
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} <span className="optional">(ไม่บังคับ)</span>
      </label>
      <div
        className="file-drop"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
        onClick={() => !disabled && input.current?.click()}
        onKeyDown={keyDown}
        onDragOver={(event) => event.preventDefault()}
        onDrop={drop}
      >
        <strong>
          {file ? "เลือกไฟล์แล้ว" : "ลากไฟล์มาวาง หรือกดเพื่อเลือกไฟล์"}
        </strong>
        {file && <span>{fileText(file)}</span>}
        <input
          ref={input}
          id={id}
          name={name}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => select(event.target.files)}
        />
      </div>
      <small id={`${id}-hint`} className="field-hint">
        {name === "cover_image"
          ? "JPEG, PNG หรือ WebP ขนาดไม่เกิน 5 MB"
          : "PDF ขนาดไม่เกิน 25 MB"}
      </small>
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
      {file && (
        <Button
          type="button"
          variant="ghost"
          className="file-remove"
          disabled={disabled}
          onClick={() => {
            onFile(null);
            if (input.current) input.current.value = "";
          }}
        >
          นำไฟล์ออก
        </Button>
      )}
    </div>
  );
}

export function SubmissionForm({
  categories,
  participants,
  research,
  returnPath = "/account/saved",
  formPath,
}: {
  categories: CategoryResponse[];
  participants: ResearchParticipantsResponse;
  research?: ResearchWorkResponse;
  returnPath?: string;
  formPath?: string;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(() => {
      if (research) {
        return {
          title_th: research.title_th ?? "",
          title_en: research.title_en ?? "",
          category_id: research.category_id ? String(research.category_id) : "",
          department: research.department ?? "",
          work_type: research.work_type ?? "",
          academic_year: research.academic_year ? String(research.academic_year) : "",
          abstract: research.abstract ?? "",
          keywords: research.keywords ?? "",
        };
      }
      return initial;
    });
  const [errors, setErrors] = useState<Errors>({});
  const [departments, setDepartments] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/options")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments || []);
        setWorkTypes(data.work_types || []);
      })
      .catch(() => {});
  }, []);

  const rowSequence = useRef(1);
  const currentAuthor = participants.authors.find(
    (person) => person.is_current,
  );
  const currentStudentIdPrefix = currentAuthor?.student_id ? currentAuthor.student_id.substring(0, 2) : "";
  const filteredAuthors = participants.authors.filter((person) => {
    if (!currentStudentIdPrefix) return true;
    return person.student_id?.startsWith(currentStudentIdPrefix);
  });

  const [authors, setAuthors] = useState(() => {
    if (research && research.authors && research.authors.length > 0) {
      return research.authors.map((a, index) => ({
        key: `author-${index}`,
        userId: String(a.user_id),
      }));
    }
    return [
      { key: "author-0", userId: currentAuthor ? String(currentAuthor.id) : "" },
    ];
  });
  const [advisorId, setAdvisorId] = useState(() => {
    if (research && research.advisors && research.advisors.length > 0) {
      return String(research.advisors[0].user_id);
    }
    return "";
  });
  const [cover, setCover] = useState<File | null>(null),
    [document, setDocument] = useState<File | null>(null),
    [fileErrors, setFileErrors] = useState<{
      cover?: string;
      document?: string;
    }>({}),
    [result, setResult] = useState<Result>(null),
    [pending, setPending] = useState(false);
  const { error, warning } = useToast();
  const alertRef = useRef<HTMLDivElement>(null);
  const abstractRef = useRef<HTMLTextAreaElement>(null);
  const [abstractMode, setAbstractMode] = useState<"edit" | "preview">("edit");

  function insertFormat(before: string, after: string = "") {
    const el = abstractRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = before + (selected || "") + after;
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    update("abstract", newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + (selected || "").length);
    }, 0);
  }
  const [keywordInput, setKeywordInput] = useState("");

  function addKeyword() {
    const term = keywordInput.trim();
    if (!term) return;
    const currentList = values.keywords ? values.keywords.split(",").map(k => k.trim()).filter(Boolean) : [];
    if (!currentList.includes(term)) {
      const newList = [...currentList, term];
      update("keywords", newList.join(", "));
    }
    setKeywordInput("");
  }

  function removeKeyword(termToRemove: string) {
    const currentList = values.keywords ? values.keywords.split(",").map(k => k.trim()).filter(Boolean) : [];
    const newList = currentList.filter(k => k !== termToRemove);
    update("keywords", newList.join(", "));
  }

  function handleKeywordKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    }
  }
  const dirty =
    Object.values(values).some(Boolean) || Boolean(cover || document);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty && result?.kind !== "success") {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, result]);
  function update(name: FieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setResult(null);
  }
  function chooseCover(file: File | null) {
    setCover(file);
    setFileErrors((current) => ({
      ...current,
      cover:
        file && !COVER_TYPES.has(file.type)
          ? "ภาพหน้าปกต้องเป็น JPEG, PNG หรือ WebP"
          : file && file.size > COVER_LIMIT
            ? "ภาพหน้าปกต้องมีขนาดไม่เกิน 5 MB"
            : undefined,
    }));
  }
  function chooseDocument(file: File | null) {
    setDocument(file);
    setFileErrors((current) => ({
      ...current,
      document:
        file && file.type !== "application/pdf"
          ? "เอกสารต้องเป็นไฟล์ PDF"
          : file && file.size > DOCUMENT_LIMIT
            ? "เอกสารต้องมีขนาดไม่เกิน 25 MB"
            : undefined,
    }));
  }
  function focusAlert() {
    queueMicrotask(() => alertRef.current?.focus());
  }
  function edit(target: number) {
    setStep(target);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function next() {
    const nextErrors = validate(values);
    if (step === 0 && Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      error("กรุณาตรวจสอบข้อมูลในขั้นตอนแรกก่อนไปขั้นตอนถัดไป");
      focusAlert();
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function issueErrors(issues: ValidationIssue[] | undefined) {
    const mapped: Errors = {};
    for (const issue of issues ?? []) {
      const field = issue.loc.at(-1);
      if (typeof field === "string" && field in initial)
        mapped[field as FieldName] = issue.msg;
    }
    return mapped;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(pending)return;
    const nextErrors = validate(values);
    if (
      Object.keys(nextErrors).length ||
      fileErrors.cover ||
      fileErrors.document
    ) {
      setErrors(nextErrors);
      setStep(Object.keys(nextErrors).length ? 0 : 3);
      error("กรุณาตรวจสอบข้อมูลที่จำเป็นก่อนส่งผลงาน");
      focusAlert();
      return;
    }
    setPending(true);
    setResult(null);
    const form = new FormData();
    for (const [name, value] of Object.entries(values))
      if (value.trim()) form.set(name, value.trim());
    form.set(
      "author_ids",
      JSON.stringify(authors.map((row) => Number(row.userId)).filter((id) => Number.isInteger(id) && id > 0)),
    );
    form.set(
      "advisor_ids",
      JSON.stringify(advisorId ? [Number(advisorId)] : []),
    );
    if (cover) form.set("cover_image", cover);
    if (document) form.set("document", document);
    const isEdit = !!research;
    const url = isEdit ? `/api/research/${research.id}` : "/api/research";
    const method = isEdit ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method: method,
        body: form,
      });
      const body = await response.json().catch(() => ({}));
      if (response.status===401) {
        window.location.assign(
          `/login?next=${encodeURIComponent(formPath ?? (isEdit ? `/student/research/edit/${research.id}` : "/student/research/new"))}`,
        );
        return;
      }
      if (response.status===403) {
        warning(isEdit ? "บัญชีนี้ไม่มีสิทธิ์แก้ไขผลงานวิจัยนี้" : "บัญชีนี้ไม่มีสิทธิ์ส่งผลงาน ระบบอนุญาตเฉพาะนักศึกษา อาจารย์ที่ปรึกษา และผู้ดูแลระบบ");
        return;
      }
      if (!response.ok) {
        const mapped = issueErrors(body.error?.issues);
        if (Object.keys(mapped).length) setErrors(mapped);
        const msg = response.status===413
          ? "ไฟล์มีขนาดเกินขีดจำกัดของเซิร์ฟเวอร์หรือโครงสร้างพื้นฐาน"
          : (body.error?.message ?? (isEdit ? "ไม่สามารถแก้ไขผลงานได้ กรุณาลองอีกครั้ง" : "ไม่สามารถส่งผลงานได้ กรุณาลองอีกครั้ง"));
        error(msg);
        return;
      }
      setResult({ kind: "success", research: body as ResearchWorkResponse });
    } catch {
      error("ไม่สามารถเชื่อมต่อบริการได้ ข้อมูลในแบบฟอร์มยังคงอยู่และสามารถลองใหม่ได้");
    } finally {
      setPending(false);
      focusAlert();
    }
  }
  if (result?.kind === "success") {
    const isEdit = !!research;
    return (
      <section
        ref={alertRef}
        tabIndex={-1}
        className="panel submission-result"
        role="status"
      >
        <p className="eyebrow">{isEdit ? "[ Update complete ]" : "[ Submission complete ]"}</p>
        <h2 className="section-title">{isEdit ? "แก้ไขผลงานเรียบร้อยแล้ว" : "ส่งผลงานเรียบร้อยแล้ว"}</h2>
        <p>
          ระบบ{isEdit ? "อัปเดต" : "สร้าง"}ผลงานหมายเลข {result.research.id} และกำหนดสถานะเป็น{" "}
          <code>{result.research.status}</code>
        </p>
        <div className="form-actions">
          <Link
            className="btn btn-primary"
            href={`/research/${result.research.id}`}
          >
            ดูรายละเอียดผลงาน
          </Link>
          <Link className="btn btn-secondary" href={returnPath}>
            กลับหน้าผลงานของฉัน
          </Link>
          {!isEdit && (
            <Button
              variant="ghost"
              onClick={() => {
                setValues(initial);
                setAuthors([
                  {
                    key: "author-reset",
                    userId: currentAuthor ? String(currentAuthor.id) : "",
                  },
                ]);
                setAdvisorId("");
                setCover(null);
                setDocument(null);
              setFileErrors({});
              setErrors({});
              setStep(0);
              setResult(null);
            }}
          >
            ส่งผลงานอีกชิ้น
          </Button>
          )}
        </div>
      </section>
    );
  }
  return (
    <form className="submission-workflow" onSubmit={submit} noValidate>
      <ol className="stepper" aria-label="ขั้นตอนการส่งผลงาน">
        {steps.map((label, index) => (
          <li
            key={label}
            className={`step ${index === step ? "active" : ""} ${index < step ? "complete" : ""}`}
            aria-current={index === step ? "step" : undefined}
          >
            <button
              type="button"
              onClick={() => index <= step && edit(index)}
              disabled={pending || index > step}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>
      {Object.keys(errors).length > 0 && (
        <div
          ref={alertRef}
          tabIndex={-1}
          className="status-message error"
          role="alert"
        >
          <strong>กรุณาตรวจสอบข้อมูล</strong>
          <ul>
            {Object.values(errors)
              .filter(Boolean)
              .map((message) => (
                <li key={message}>{message}</li>
              ))}
          </ul>
        </div>
      )}
      <section
        className="panel submission-form"
        aria-labelledby="submission-step-title"
      >
        <p className="eyebrow">
          [ {String(step + 1).padStart(2, "0")} /{" "}
          {String(steps.length).padStart(2, "0")} ]
        </p>
        <h2 id="submission-step-title" className="section-title">
          {steps[step]}
        </h2>
        {step === 0 && (
          <>
            <Field label="ชื่อผลงานภาษาไทย" required>
              <Input
                name="title_th"
                value={values.title_th}
                onChange={(e) => update("title_th", e.target.value)}
                required
                aria-invalid={Boolean(errors.title_th)}
                aria-describedby={
                  errors.title_th ? "title_th-error" : undefined
                }
                disabled={pending}
              />
            </Field>
            {errors.title_th && (
              <p id="title_th-error" className="field-error">
                {errors.title_th}
              </p>
            )}
            <Field
              label="ชื่อผลงานภาษาอังกฤษ"
              required
              hint="จำเป็น"
            >
              <Input
                name="title_en"
                className="latin"
                value={values.title_en}
                onChange={(e) => update("title_en", e.target.value)}
                required
                aria-invalid={Boolean(errors.title_en)}
                disabled={pending}
              />
            </Field>
            {errors.title_en && (
              <p className="field-error">{errors.title_en}</p>
            )}
            <Field label="หมวดหมู่" required>
              <Select
                name="category_id"
                value={values.category_id}
                onChange={(e) => update("category_id", e.target.value)}
                required
                aria-invalid={Boolean(errors.category_id)}
                disabled={pending}
              >
                <option value="" disabled>
                  เลือกหมวดหมู่
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </Select>
            </Field>
            {errors.category_id && (
              <p className="field-error">{errors.category_id}</p>
            )}
            <div className="form-grid">
              <Field label="ภาควิชา / หลักสูตร" hint="ไม่บังคับ">
                <Select
                  name="department"
                  value={values.department}
                  onChange={(e) => update("department", e.target.value)}
                  disabled={pending}
                >
                  <option value="">เลือกภาควิชา / หลักสูตร</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="ประเภทผลงาน"
                hint="ไม่บังคับ"
              >
                <Select
                  name="work_type"
                  value={values.work_type}
                  onChange={(e) => update("work_type", e.target.value)}
                  disabled={pending}
                >
                  <option value="">เลือกประเภทผลงาน</option>
                  {workTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="ปีการศึกษา"
                hint="ไม่บังคับ"
              >
                <Input
                  name="academic_year"
                  inputMode="numeric"
                  value={values.academic_year}
                  onChange={(e) => update("academic_year", e.target.value)}
                  aria-invalid={Boolean(errors.academic_year)}
                  disabled={pending}
                />
              </Field>
            </div>
            <AIWritingAssistant
              values={{
                title_th: values.title_th,
                title_en: values.title_en,
                abstract: values.abstract,
                keywords: values.keywords,
                category_id: values.category_id,
              }}
              onUpdate={(field, value) => update(field as FieldName, value)}
              categories={categories}
              disabled={pending}
            />
          </>
        )}
        {step === 1 && (
          <div className="people-fields">
            <div>
              <h3>ผู้จัดทำ</h3>
              {authors.map((row, index) => (
                <div className="person-row" key={row.key}>
                  <Field label={`ผู้จัดทำคนที่ ${index + 1}`}>
                    <Select
                      value={row.userId}
                      onChange={(event) =>
                        setAuthors((current) =>
                          current.map((item) =>
                            item.key === row.key
                              ? { ...item, userId: event.target.value }
                              : item,
                          ),
                        )
                      }
                      disabled={pending}
                    >
                      <option value="">ไม่ระบุ</option>
                      {filteredAuthors.map((person) => (
                        <option key={person.id} value={person.id}>
                          {participantLabel(person)}
                          {person.is_current ? " (บัญชีปัจจุบัน)" : ""}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label={`นำผู้จัดทำคนที่ ${index + 1} ออก`}
                    disabled={pending || authors.length === 1}
                    onClick={() =>
                      setAuthors((current) =>
                        current.filter((item) => item.key !== row.key),
                      )
                    }
                  >
                    นำออก
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                disabled={
                  pending || authors.length >= filteredAuthors.length
                }
                onClick={() =>
                  setAuthors((current) => [
                    ...current,
                    { key: `author-${rowSequence.current++}`, userId: "" },
                  ])
                }
              >
                เพิ่มผู้จัดทำ
              </Button>
              {filteredAuthors.length === 0 && (
                <p className="field-hint">ไม่พบบัญชีนักศึกษาที่ใช้งานอยู่</p>
              )}
            </div>
            <Field
              label="อาจารย์ที่ปรึกษา"
              hint="ไม่บังคับ"
            >
              <Select
                value={advisorId}
                onChange={(event) => setAdvisorId(event.target.value)}
                disabled={pending}
              >
                <option value="">ไม่ระบุ</option>
                {participants.advisors.map((person) => (
                  <option key={person.id} value={person.id}>
                    {participantLabel(person)}
                  </option>
                ))}
              </Select>
            </Field>
            {participants.advisors.length === 0 && (
              <p className="field-hint">ไม่พบบัญชีอาจารย์ที่ใช้งานอยู่</p>
            )}
          </div>
        )}
        {step === 2 && (
          <>
            <div className="abstract-editor-container">
              <div className="abstract-header-row">
                <label className="field-label">
                  บทคัดย่อ (Abstract) <span className="muted-hint">- ไม่บังคับ</span>
                </label>
                <div className="abstract-tabs">
                  <button
                    type="button"
                    className={`abstract-tab-btn ${abstractMode === "edit" ? "active" : ""}`}
                    onClick={() => setAbstractMode("edit")}
                  >
                    <Edit2 size={13} /> เขียน
                  </button>
                  <button
                    type="button"
                    className={`abstract-tab-btn ${abstractMode === "preview" ? "active" : ""}`}
                    onClick={() => setAbstractMode("preview")}
                  >
                    <Eye size={13} /> ดูตัวอย่าง
                  </button>
                </div>
              </div>

              {abstractMode === "edit" ? (
                <div className="abstract-editor-wrapper">
                  <div className="abstract-toolbar">
                    <button type="button" title="ตัวหนา" onClick={() => insertFormat("**", "**")}><Bold size={14} /></button>
                    <button type="button" title="ตัวเอียง" onClick={() => insertFormat("*", "*")}><Italic size={14} /></button>
                    <button type="button" title="หัวข้อหลัก" onClick={() => insertFormat("# ", "")}><Heading1 size={14} /></button>
                    <button type="button" title="หัวข้อรอง" onClick={() => insertFormat("## ", "")}><Heading2 size={14} /></button>
                    <button type="button" title="รายการแบบสัญลักษณ์" onClick={() => insertFormat("- ", "")}><List size={14} /></button>
                    <button type="button" title="รายการแบบตัวเลข" onClick={() => insertFormat("1. ", "")}><ListOrdered size={14} /></button>
                  </div>
                  <textarea
                    ref={abstractRef}
                    name="abstract"
                    className="textarea abstract-textarea"
                    rows={9}
                    value={values.abstract}
                    onChange={(e) => update("abstract", e.target.value)}
                    disabled={pending}
                    placeholder="กรอกบทคัดย่องานวิจัยที่นี่ คุณสามารถจัดรูปแบบข้อความด้วยแถบเครื่องมือด้านบน..."
                  />
                </div>
              ) : (
                <div className="abstract-preview-panel">
                  {values.abstract.trim() ? (
                    <div
                      className="abstract-preview-content"
                      dangerouslySetInnerHTML={{
                        __html: values.abstract
                          .split("\n")
                          .map((line) => {
                            let parsed = line;
                            if (parsed.startsWith("## ")) {
                              return `<h3>${parsed.substring(3)}</h3>`;
                            } else if (parsed.startsWith("# ")) {
                              return `<h2>${parsed.substring(2)}</h2>`;
                            }
                            parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                            parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>");
                            return `<p>${parsed || "&nbsp;"}</p>`;
                          })
                          .join(""),
                      }}
                    />
                  ) : (
                     <p className="muted-empty-preview">ยังไม่มีข้อความบทคัดย่อ กรุณาเปลี่ยนเป็นแท็บ &quot;เขียน&quot; เพื่อกรอกข้อมูล</p>
                  )}
                </div>
              )}
            </div>
            <p className="character-count" aria-live="polite">
              {values.abstract.length.toLocaleString("th-TH")} ตัวอักษร
            </p>
            <div className="keywords-customizer-container">
              <label className="field-label">คำสำคัญ (Keywords) <span className="muted-hint">- ไม่บังคับ</span></label>
              <div className="keywords-input-wrapper">
                <Input
                  name="keyword_input_temp"
                  placeholder="พิมพ์คำสำคัญแล้วกด Enter หรือ comma (,)"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  disabled={pending}
                />
                <Button type="button" variant="secondary" onClick={addKeyword} disabled={pending || !keywordInput.trim()}>
                  เพิ่ม
                </Button>
              </div>
              <div className="keywords-tags-container">
                {(() => {
                  const keywordList = values.keywords ? values.keywords.split(",").map(k => k.trim()).filter(Boolean) : [];
                  return keywordList.length > 0 ? (
                    keywordList.map((tag) => (
                      <span className="keyword-tag" key={tag}>
                        {tag}
                        <button type="button" className="remove-tag-btn" onClick={() => removeKeyword(tag)} disabled={pending} title={`นำ ${tag} ออก`}>
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="muted-hint font-13">ยังไม่ได้เพิ่มคำสำคัญ</span>
                  );
                })()}
              </div>
              <input type="hidden" name="keywords" value={values.keywords} />
            </div>
            <AIWritingAssistant
              values={{
                title_th: values.title_th,
                title_en: values.title_en,
                abstract: values.abstract,
                keywords: values.keywords,
                category_id: values.category_id,
              }}
              onUpdate={(field, value) => update(field as FieldName, value)}
              categories={categories}
              disabled={pending}
            />
          </>
        )}
        {step === 3 && (
          <>
            <FileDrop
              label="ภาพหน้าปก"
              name="cover_image"
              file={cover}
              onFile={chooseCover}
              accept="image/jpeg,image/png,image/webp"
              error={fileErrors.cover}
              disabled={pending}
            />
            <FileDrop
              label="เอกสารงานวิจัย"
              name="document"
              file={document}
              onFile={chooseDocument}
              accept="application/pdf"
              error={fileErrors.document}
              disabled={pending}
            />
            <div className="state compact-state">
              <p>
                ไฟล์จะถูกส่งพร้อมแบบฟอร์มในขั้นตอนสุดท้าย
                ไม่มีการอัปโหลดล่วงหน้าหรือสถานะบันทึกร่าง
              </p>
            </div>
          </>
        )}
        {step === 4 && (
          <div className="review-sections">
            <section>
              <div>
                <h3>ข้อมูลงานวิจัย</h3>
                <button type="button" onClick={() => edit(0)}>
                  แก้ไข
                </button>
              </div>
              <dl>
                <dt>ชื่อภาษาไทย</dt>
                <dd>{values.title_th || "— ข้อมูลจำเป็นยังขาด"}</dd>
                <dt>ชื่อภาษาอังกฤษ</dt>
                <dd>{values.title_en || "— ข้อมูลจำเป็นยังขาด"}</dd>
                <dt>หมวดหมู่</dt>
                <dd>
                  {categories.find((x) => String(x.id) === values.category_id)
                    ?.category_name || "— ข้อมูลจำเป็นยังขาด"}
                </dd>
                <dt>ภาควิชา / ประเภท / ปี</dt>
                <dd>
                  {[values.department, values.work_type, values.academic_year]
                    .filter(Boolean)
                    .join(" · ") || "ไม่ได้ระบุ (ไม่บังคับ)"}
                </dd>
              </dl>
            </section>
            <section>
              <div>
                <h3>ผู้จัดทำและอาจารย์</h3>
                <button type="button" onClick={() => edit(1)}>
                  แก้ไข
                </button>
              </div>
              <p>
                ผู้จัดทำ:{" "}
                {authors
                  .map((row) =>
                    participants.authors.find(
                      (person) => String(person.id) === row.userId,
                    ),
                  )
                  .filter((person): person is ResearchParticipant =>
                    Boolean(person),
                  )
                  .map(participantLabel)
                  .join(", ") || "ไม่ได้ระบุ"}
              </p>
              <p>
                อาจารย์ที่ปรึกษา:{" "}
                {participants.advisors.find(
                  (person) => String(person.id) === advisorId,
                )?.email || "ไม่ได้ระบุ"}
              </p>
            </section>
            <section>
              <div>
                <h3>บทคัดย่อและคำสำคัญ</h3>
                <button type="button" onClick={() => edit(2)}>
                  แก้ไข
                </button>
              </div>
              <p>{values.abstract || "ไม่ได้ระบุบทคัดย่อ (ไม่บังคับ)"}</p>
              <p>{values.keywords || "ไม่ได้ระบุคำสำคัญ (ไม่บังคับ)"}</p>
            </section>
            <section>
              <div>
                <h3>ไฟล์</h3>
                <button type="button" onClick={() => edit(3)}>
                  แก้ไข
                </button>
              </div>
              <p>ภาพหน้าปก: {fileText(cover)}</p>
              <p>เอกสาร: {fileText(document)}</p>
            </section>
          </div>
        )}
        <div className="form-actions">
          {step > 0 && (
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => setStep((current) => current - 1)}
            >
              ย้อนกลับ
            </Button>
          )}
          <span className="action-spacer" />
          {step < steps.length - 1 ? (
            <Button
              key="continue"
              type="button"
              disabled={pending}
              onClick={next}
            >
              ดำเนินการต่อ
            </Button>
          ) : (
            <Button key="submit" type="submit" disabled={pending}>
              {pending ? "กำลังส่งผลงาน…" : "ยืนยันและส่งผลงาน"}
            </Button>
          )}
        </div>
      </section>
    </form>
  );
}
