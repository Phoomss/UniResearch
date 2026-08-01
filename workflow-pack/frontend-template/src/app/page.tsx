export default function HomePage() {
  return (
    <main className="container-page py-16 md:py-24">
      <p className="mb-3 text-sm font-semibold text-[var(--color-secondary)]">
        UNIVERSITY RESEARCH REPOSITORY
      </p>
      <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
        ทุกงานวิจัย คือจุดเริ่มต้นของคำถามถัดไป
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--color-on-surface-variant)]">
        หน้านี้เป็นฐานเริ่มต้น ให้ Codex แปลงหน้าจอจาก Stitch เป็น component
        ที่ใช้ซ้ำได้โดยคง Mulberry Library design system
      </p>
    </main>
  );
}
