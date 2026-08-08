"use client";

import { useEffect, useState } from "react";
import { Button, Input, StatePanel } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";
import { Plus, Trash2, Save } from "lucide-react";

export default function AdminOptionsPage() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  
  const [newDept, setNewDept] = useState("");
  const [newType, setNewType] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetch("/api/options")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments || []);
        setWorkTypes(data.work_types || []);
        setLoading(false);
      })
      .catch(() => {
        error("ไม่สามารถโหลดข้อมูลตัวเลือกได้");
        setLoading(false);
      });
  }, [error]);

  const handleAddDept = () => {
    const val = newDept.trim();
    if (!val) return;
    if (departments.includes(val)) {
      error("มีภาควิชา/หลักสูตรนี้อยู่แล้ว");
      return;
    }
    setDepartments([...departments, val]);
    setNewDept("");
  };

  const handleRemoveDept = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const handleAddType = () => {
    const val = newType.trim();
    if (!val) return;
    if (workTypes.includes(val)) {
      error("มีประเภทผลงานนี้อยู่แล้ว");
      return;
    }
    setWorkTypes([...workTypes, val]);
    setNewType("");
  };

  const handleRemoveType = (index: number) => {
    setWorkTypes(workTypes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departments, work_types: workTypes }),
      });
      if (response.ok) {
        success("บันทึกการตั้งค่าเรียบร้อยแล้ว");
      } else {
        const body = await response.json().catch(() => ({}));
        error(body.error?.message ?? "ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch {
      error("ไม่สามารถเชื่อมต่อระบบบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="dash-main">
        <StatePanel kind="loading" title="กำลังโหลด" detail="กำลังเปิดการตั้งค่าภาควิชาและประเภทผลงาน..." />
      </main>
    );
  }

  return (
    <main className="dash-main admin-options-page">
      <p className="eyebrow">[ การจัดการระบบ ]</p>
      <h1 className="title">ภาควิชาและประเภทผลงาน</h1>
      <p className="muted" style={{ marginBottom: "32px" }}>
        ผู้ดูแลระบบสามารถจัดการ ลบ หรือเพิ่ม ภาควิชา/หลักสูตร และประเภทผลงานวิจัย เพื่อใช้เป็นตัวเลือกให้ผู้ใช้เลือกในแบบฟอร์มส่งผลงานวิจัยได้
      </p>

      <div className="dashboard-grid category-workspace" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        
        {/* ภาควิชา / หลักสูตร Panel */}
        <section className="panel" style={{ background: "var(--paper-low)", padding: "24px", borderRadius: "12px", border: "1px solid #cdc3d030" }}>
          <h2 className="section-title" style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
            ภาควิชา / หลักสูตร ({departments.length})
          </h2>
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <Input
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              placeholder="เพิ่มภาควิชา/หลักสูตร เช่น วิศวกรรมคอมพิวเตอร์"
              onKeyDown={(e) => e.key === "Enter" && handleAddDept()}
            />
            <Button onClick={handleAddDept} type="button" style={{ padding: "8px 16px" }}>
              <Plus size={18} />
            </Button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
            {departments.length === 0 ? (
              <p className="muted" style={{ padding: "16px", textAlign: "center" }}>ไม่มีรายการ</p>
            ) : (
              departments.map((dept, index) => (
                <div key={dept} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--paper-white)", borderRadius: "8px", border: "1px solid #cdc3d020" }}>
                  <span>{dept}</span>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveDept(index)}
                    style={{ color: "var(--red, #ef4444)", padding: "4px" }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ประเภทผลงาน Panel */}
        <section className="panel" style={{ background: "var(--paper-low)", padding: "24px", borderRadius: "12px", border: "1px solid #cdc3d030" }}>
          <h2 className="section-title" style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
            ประเภทผลงาน ({workTypes.length})
          </h2>
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <Input
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="เพิ่มประเภทผลงาน เช่น วิทยานิพนธ์"
              onKeyDown={(e) => e.key === "Enter" && handleAddType()}
            />
            <Button onClick={handleAddType} type="button" style={{ padding: "8px 16px" }}>
              <Plus size={18} />
            </Button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
            {workTypes.length === 0 ? (
              <p className="muted" style={{ padding: "16px", textAlign: "center" }}>ไม่มีรายการ</p>
            ) : (
              workTypes.map((type, index) => (
                <div key={type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--paper-white)", borderRadius: "8px", border: "1px solid #cdc3d020" }}>
                  <span>{type}</span>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveType(index)}
                    style={{ color: "var(--red, #ef4444)", padding: "4px" }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

      <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Save size={18} />
          <span>{saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่าทั้งหมด"}</span>
        </Button>
      </div>
    </main>
  );
}
