/** Translate system labels only. Research source text and quotations stay verbatim. */
const labels: Record<string, string> = {
  planner: "ผู้ประสานงานวิจัย", search: "ผู้ค้นหาแหล่งข้อมูล", paper: "ผู้วิเคราะห์บทความ",
  evidence: "ผู้รวบรวมหลักฐาน", verifier: "ผู้ตรวจสอบหลักฐาน", critic: "ผู้ประเมินงานวิจัย",
  writer: "ผู้เขียนรายงาน", citation: "ผู้ตรวจสอบการอ้างอิง",
  PLANNING: "กำลังวางแผน", SEARCHING: "กำลังค้นหา", READING: "กำลังอ่านบทความ",
  EXTRACTING_EVIDENCE: "กำลังรวบรวมหลักฐาน", VERIFYING: "กำลังตรวจสอบหลักฐาน",
  CRITIQUING: "กำลังประเมินงานวิจัย", WRITING: "กำลังเขียนรายงาน",
  VALIDATING_CITATIONS: "กำลังตรวจสอบการอ้างอิง", COMPLETED: "เสร็จสมบูรณ์",
  FAILED: "ดำเนินการไม่สำเร็จ", WAITING_FOR_HUMAN: "รอผู้วิจัยตรวจสอบ",
  PENDING: "รอดำเนินการ", RUNNING: "กำลังดำเนินการ", RETRYING: "กำลังลองใหม่", BLOCKED: "รอแก้ไขปัญหา",
  strong: "สูง", moderate: "ปานกลาง", weak: "ต่ำ", insufficient: "ไม่เพียงพอ",
  supporting: "หลักฐานสนับสนุน", contradicting: "หลักฐานที่ขัดแย้ง", abstract: "บทคัดย่อ",
  objective: "วัตถุประสงค์", methodology: "ระเบียบวิธีวิจัย", dataset: "ชุดข้อมูลหรือกลุ่มตัวอย่าง",
  "Executive Summary": "บทสรุปผู้บริหาร", Background: "ที่มาและความสำคัญ", "Key Findings": "ข้อค้นพบสำคัญ",
  "Evidence Analysis": "การวิเคราะห์หลักฐาน", "Conflicting Evidence": "หลักฐานที่ขัดแย้ง", Conclusion: "สรุปผล",
  evidence_coverage: "ความครอบคลุมของหลักฐาน", citation_coverage: "ความครอบคลุมของการอ้างอิง",
  source_agreement: "ความสอดคล้องของแหล่งข้อมูล", source_quality: "คุณภาพแหล่งข้อมูล",
  source_independence_proxy: "ค่าประมาณความเป็นอิสระของแหล่งข้อมูล",
  ACCEPT: "ยอมรับผล", SEARCH_MORE: "ค้นหาเพิ่มเติม", READ_MORE: "อ่านเพิ่มเติม",
  RECHECK_EVIDENCE: "ตรวจสอบหลักฐานอีกครั้ง", REWRITE: "เขียนใหม่",
  RECHECK_CITATIONS: "ตรวจสอบการอ้างอิงอีกครั้ง", REQUEST_HUMAN_REVIEW: "ขอให้ผู้วิจัยตรวจสอบ",
  INSUFFICIENT_EVIDENCE: "หลักฐานไม่เพียงพอ", UNSUPPORTED_CLAIM: "ข้อค้นพบไม่มีหลักฐานรองรับ",
  CONTRADICTION: "พบหลักฐานขัดแย้ง", OVERGENERALIZATION: "สรุปเกินขอบเขตหลักฐาน",
  CITATION_MISMATCH: "การอ้างอิงไม่ตรงกับข้อค้นพบ", MISSING_PERSPECTIVE: "ขาดมุมมองที่เกี่ยวข้อง",
  CITATION: "ปัญหาการอ้างอิง", CONTINUE: "ดำเนินการวิจัยต่อ", ACCEPT_CURRENT: "ยอมรับหลักฐานปัจจุบัน",
  MODIFY_QUESTION: "แก้ไขคำถามวิจัย", RETRY_AGENT: "ลองทำงานนี้อีกครั้ง",
  InvalidOutput: "ผลลัพธ์ไม่ผ่านการตรวจสอบ", ProviderFailure: "ผู้ให้บริการ AI ขัดข้อง",
  SearchFailure: "การค้นหาขัดข้อง", TimeoutError: "หมดเวลารอผลลัพธ์",
  superseded_by_human: "แทนที่ด้วยคำสั่งของผู้วิจัย", provider_failure: "ผู้ให้บริการ AI ขัดข้อง",
  search_failure: "การค้นหาขัดข้อง", invalid_output: "ผลลัพธ์ไม่ผ่านการตรวจสอบ",
};
export const label = (value: string) => labels[value] ?? value.replaceAll("_", " ");

const messages: Record<string, string> = {
  "Sources are repository abstracts; full papers and publication metadata have not been verified.": "แหล่งข้อมูลเป็นบทคัดย่อในคลัง ยังไม่ได้ตรวจสอบบทความฉบับเต็มและข้อมูลการตีพิมพ์",
  "Confidence is a system heuristic, not a probability of truth.": "คะแนนความเชื่อมั่นเป็นการประเมินตามเกณฑ์ของระบบ ไม่ใช่ความน่าจะเป็นที่ผลลัพธ์ถูกต้อง",
  "Research workflow created.": "สร้างงานวิจัยแล้ว", "Research workflow queued.": "เพิ่มงานวิจัยเข้าคิวแล้ว",
  "Stopped by researcher.": "ผู้วิจัยหยุดงาน",
  "Researcher accepted limited evidence; adequacy review was overridden.": "ผู้วิจัยยอมรับหลักฐานที่มีข้อจำกัด โดยข้ามผลการประเมินความเพียงพอ",
  "Repository source added.": "เพิ่มแหล่งข้อมูลจากคลังแล้ว",
  "Abstract analyzed; interpretation stored separately.": "วิเคราะห์บทคัดย่อแล้ว และบันทึกการตีความแยกจากข้อความต้นฉบับ",
  "Conflicting evidence detected.": "พบหลักฐานที่ขัดแย้งกัน",
  "Conflicting or unreliable evidence requires human review.": "พบหลักฐานที่ขัดแย้งหรือมีความน่าเชื่อถือไม่เพียงพอ ต้องให้ผู้วิจัยตรวจสอบ",
  "Draft generated from verified evidence.": "สร้างร่างรายงานจากหลักฐานที่ตรวจสอบแล้ว",
  "Research report validated.": "รายงานวิจัยผ่านการตรวจสอบแล้ว",
  "Research iteration limit reached.": "ถึงขีดจำกัดรอบการวิจัยแล้ว",
  "Search round limit reached.": "ถึงขีดจำกัดรอบการค้นหาแล้ว",
  "Research question needs clarification.": "ต้องระบุคำถามวิจัยให้ชัดเจนขึ้น",
  "Missing pending task; recovery required.": "ไม่พบงานที่รอดำเนินการ ต้องกู้คืนการทำงาน",
  "Task dependency is incomplete.": "งานที่ต้องดำเนินการก่อนหน้ายังไม่เสร็จสมบูรณ์",
  "Workflow duration limit reached.": "ถึงขีดจำกัดเวลาการวิจัยแล้ว",
  "Agent context size limit reached.": "ถึงขีดจำกัดขนาดข้อมูลสำหรับผู้ช่วย AI แล้ว",
  "LLM call or token budget reached.": "ถึงขีดจำกัดการเรียกใช้ LLM หรือโทเคนแล้ว",
  "Interrupted task retry limit reached.": "ถึงขีดจำกัดการลองใหม่ของงานที่ถูกขัดจังหวะแล้ว",
  "Agent retry limit reached.": "ถึงขีดจำกัดการลองทำงานใหม่แล้ว",
  "Research workflow not found": "ไม่พบงานวิจัย", "ResearchFlow is disabled": "ResearchFlow ยังไม่เปิดใช้งาน",
  "No verified evidence to accept": "ยังไม่มีหลักฐานที่ตรวจสอบแล้วให้ยอมรับ",
  "Research question is too short": "คำถามวิจัยสั้นเกินไป",
  "Please sign in": "กรุณาเข้าสู่ระบบ", "Unknown ResearchFlow route": "ไม่พบเส้นทาง ResearchFlow",
  "Invalid request origin": "ไม่อนุญาตคำขอจากแหล่งที่มานี้", "Request too large": "คำขอมีขนาดใหญ่เกินไป",
  "Invalid JSON": "รูปแบบข้อมูลคำขอไม่ถูกต้อง", "Invalid event cursor": "ตำแหน่งบันทึกความคืบหน้าไม่ถูกต้อง",
  "ResearchFlow resource limit reached; stop or finish an existing workflow": "ถึงขีดจำกัดทรัพยากร ResearchFlow โปรดหยุดหรือดำเนินงานวิจัยเดิมให้เสร็จก่อน",
  "Workflow already started; use continue for human review": "งานวิจัยเริ่มแล้ว โปรดใช้การดำเนินการต่อหลังตรวจสอบ",
  "Completed workflow cannot be stopped": "ไม่สามารถหยุดงานวิจัยที่เสร็จสมบูรณ์แล้ว",
  "Workflow must be waiting for human review": "งานวิจัยต้องอยู่ในสถานะรอผู้วิจัยตรวจสอบ",
  "Select a failed or blocked task from this workflow": "โปรดเลือกงานที่ล้มเหลวหรือรอแก้ไขปัญหาในงานวิจัยนี้",
};
export function translateMessage(value: string): string {
  if (messages[value]) return messages[value];
  let match = value.match(/^(\d+) claims mapped to source excerpts\.$/);
  if (match) return `เชื่อมโยงข้อค้นพบ ${match[1]} ข้อกับข้อความจากแหล่งข้อมูลแล้ว`;
  match = value.match(/^(\d+)\/(\d+) report sentences supported\.$/);
  if (match) return `รายงานมีหลักฐานรองรับ ${match[1]} จาก ${match[2]} ประโยค`;
  match = value.match(/^(\w+) agent (started|completed)\.$/);
  if (match) return `${label(match[1].toLowerCase())}${match[2] === "started" ? "เริ่มทำงานแล้ว" : "ทำงานเสร็จแล้ว"}`;
  match = value.match(/^(\w+) failed \(([^)]+)\)\.$/);
  if (match) return `${label(match[1].toLowerCase())}ทำงานไม่สำเร็จ (${label(match[2])})`;
  match = value.match(/^Researcher requested (.+)\.$/);
  if (match) return `ผู้วิจัยเลือก: ${label(match[1].replaceAll(" ", "_").toUpperCase())}`;
  return value;
}
