"use client";

import { useEffect, useState } from "react";
import { Button, Input, StatePanel } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";
import { 
  Plus, 
  Trash2, 
  Save, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Check, 
  X, 
  RotateCcw,
  Layers,
  GraduationCap
} from "lucide-react";

export default function AdminOptionsPage() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  
  // Track initial state to detect unsaved changes
  const [initialDepartments, setInitialDepartments] = useState<string[]>([]);
  const [initialWorkTypes, setInitialWorkTypes] = useState<string[]>([]);
  
  const [newDept, setNewDept] = useState("");
  const [newType, setNewType] = useState("");
  
  // Search state
  const [deptSearch, setDeptSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  
  // Inline editing state
  const [editingDeptIndex, setEditingDeptIndex] = useState<number | null>(null);
  const [editingDeptValue, setEditingDeptValue] = useState("");
  
  const [editingTypeIndex, setEditingTypeIndex] = useState<number | null>(null);
  const [editingTypeValue, setEditingTypeValue] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    fetch("/api/options")
      .then((res) => res.json())
      .then((data) => {
        const depts = data.departments || [];
        const types = data.work_types || [];
        setDepartments(depts);
        setInitialDepartments(depts);
        setWorkTypes(types);
        setInitialWorkTypes(types);
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
    // Clear editing if removed
    if (editingDeptIndex === index) {
      setEditingDeptIndex(null);
    } else if (editingDeptIndex !== null && editingDeptIndex > index) {
      setEditingDeptIndex(editingDeptIndex - 1);
    }
  };

  const handleStartEditDept = (index: number, val: string) => {
    setEditingDeptIndex(index);
    setEditingDeptValue(val);
  };

  const handleSaveEditDept = (index: number) => {
    const val = editingDeptValue.trim();
    if (!val) return;
    
    // Check duplication with other items
    if (departments.some((dept, i) => dept === val && i !== index)) {
      error("มีภาควิชา/หลักสูตรนี้อยู่แล้ว");
      return;
    }
    
    const updated = [...departments];
    updated[index] = val;
    setDepartments(updated);
    setEditingDeptIndex(null);
  };

  const handleMoveDept = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= departments.length) return;
    
    const updated = [...departments];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    // Update editing index if affected
    if (editingDeptIndex === index) {
      setEditingDeptIndex(targetIndex);
    } else if (editingDeptIndex === targetIndex) {
      setEditingDeptIndex(index);
    }
    
    setDepartments(updated);
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
    // Clear editing if removed
    if (editingTypeIndex === index) {
      setEditingTypeIndex(null);
    } else if (editingTypeIndex !== null && editingTypeIndex > index) {
      setEditingTypeIndex(editingTypeIndex - 1);
    }
  };

  const handleStartEditType = (index: number, val: string) => {
    setEditingTypeIndex(index);
    setEditingTypeValue(val);
  };

  const handleSaveEditType = (index: number) => {
    const val = editingTypeValue.trim();
    if (!val) return;
    
    // Check duplication with other items
    if (workTypes.some((type, i) => type === val && i !== index)) {
      error("มีประเภทผลงานนี้อยู่แล้ว");
      return;
    }
    
    const updated = [...workTypes];
    updated[index] = val;
    setWorkTypes(updated);
    setEditingTypeIndex(null);
  };

  const handleMoveType = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= workTypes.length) return;
    
    const updated = [...workTypes];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    // Update editing index if affected
    if (editingTypeIndex === index) {
      setEditingTypeIndex(targetIndex);
    } else if (editingTypeIndex === targetIndex) {
      setEditingTypeIndex(index);
    }
    
    setWorkTypes(updated);
  };

  const handleDiscard = () => {
    setDepartments(initialDepartments);
    setWorkTypes(initialWorkTypes);
    setEditingDeptIndex(null);
    setEditingTypeIndex(null);
    success("ยกเลิกการเปลี่ยนแปลงทั้งหมดแล้ว");
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
        setInitialDepartments(departments);
        setInitialWorkTypes(workTypes);
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

  const hasUnsavedChanges = 
    JSON.stringify(departments) !== JSON.stringify(initialDepartments) ||
    JSON.stringify(workTypes) !== JSON.stringify(initialWorkTypes);

  // Filtered lists
  const filteredDepartments = departments.map((name, index) => ({ name, index }))
    .filter(item => item.name.toLowerCase().includes(deptSearch.toLowerCase()));

  const filteredWorkTypes = workTypes.map((name, index) => ({ name, index }))
    .filter(item => item.name.toLowerCase().includes(typeSearch.toLowerCase()));

  if (loading) {
    return (
      <main className="dash-main">
        <StatePanel kind="loading" title="กำลังโหลด" detail="กำลังเปิดการตั้งค่าภาควิชาและประเภทผลงาน..." />
      </main>
    );
  }

  return (
    <main className="dash-main admin-options-page" style={{ paddingBottom: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <p className="eyebrow">[ การจัดการระบบ ]</p>
          <h1 className="title" style={{ margin: "4px 0 8px" }}>ภาควิชาและประเภทผลงาน</h1>
          <p className="muted">
            ผู้ดูแลระบบสามารถจัดการ ลบ เพิ่ม หรือแก้ไข ลำดับ ภาควิชา/หลักสูตร และประเภทผลงานวิจัย เพื่อใช้เป็นตัวเลือกในระบบได้
          </p>
        </div>

        {hasUnsavedChanges && (
          <div className="admin-options-unsaved" style={{
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            background: "var(--apricot)", 
            padding: "12px 20px", 
            borderRadius: "8px",
            border: "1px solid #ff7a3040"
          }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#8a3a00" }}>⚠️ มีการแก้ไขที่ยังไม่ได้บันทึก</span>
            <Button variant="ghost" onClick={handleDiscard} style={{ padding: "6px 12px", fontSize: "14px", background: "rgba(255,255,255,0.6)", color: "#8a3a00" }}>
              <RotateCcw size={14} style={{ marginRight: "4px", display: "inline" }} /> ยกเลิก
            </Button>
            <Button onClick={handleSave} disabled={saving} style={{ padding: "6px 16px", fontSize: "14px", background: "var(--mulberry)", color: "#fff" }}>
              <Save size={14} style={{ marginRight: "4px", display: "inline" }} /> บันทึก
            </Button>
          </div>
        )}
      </div>

      <div className="dashboard-grid category-workspace admin-options-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        
        {/* ภาควิชา / หลักสูตร Panel */}
        <section className="panel" style={{ background: "var(--paper-low)", padding: "28px", borderRadius: "16px", border: "1px solid #cdc3d040", boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "var(--mulberry)", color: "white", padding: "8px", borderRadius: "8px" }}>
                <GraduationCap size={20} />
              </div>
              <div>
                <h2 className="section-title" style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
                  ภาควิชา / หลักสูตร
                </h2>
                <span className="muted" style={{ fontSize: "13px" }}>
                  ทั้งหมด {departments.length} รายการ
                </span>
              </div>
            </div>
          </div>

          {/* Search Filter */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", opacity: 0.6 }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="ค้นหาภาควิชา..."
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "var(--paper-white)",
                fontSize: "15px"
              }}
            />
            {deptSearch && (
              <button 
                onClick={() => setDeptSearch("")} 
                aria-label="ล้างการค้นหาภาควิชา"
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Add input */}
          <div className="admin-options-add-row" style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <Input
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              placeholder="เพิ่มภาควิชาใหม่ เช่น วิศวกรรมคอมพิวเตอร์"
              onKeyDown={(e) => e.key === "Enter" && handleAddDept()}
            />
            <Button onClick={handleAddDept} type="button" aria-label="เพิ่มภาควิชา" style={{ padding: "8px 16px" }}>
              <Plus size={18} />
            </Button>
          </div>

          {/* Options List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "450px", overflowY: "auto", paddingRight: "4px" }}>
            {filteredDepartments.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", background: "var(--paper-white)", borderRadius: "10px", border: "1px dashed var(--line)" }}>
                <p className="muted" style={{ margin: 0 }}>
                  {deptSearch ? "ไม่พบผลลัพธ์การค้นหา" : "ไม่มีรายการภาควิชา / หลักสูตร"}
                </p>
              </div>
            ) : (
              filteredDepartments.map(({ name, index }) => {
                const isEditing = editingDeptIndex === index;
                const isNew = !initialDepartments.includes(name);
                
                return (
                  <div className="admin-options-row"
                    key={`${name}-${index}`} 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "10px 14px", 
                      background: "var(--paper-white)", 
                      borderRadius: "10px", 
                      border: isNew ? "1px solid #ff7a3050" : "1px solid #cdc3d030",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "8px", width: "100%", alignItems: "center" }}>
                        <input
                          type="text"
                          value={editingDeptValue}
                          onChange={(e) => setEditingDeptValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEditDept(index);
                            if (e.key === "Escape") setEditingDeptIndex(null);
                          }}
                          autoFocus
                          style={{
                            flex: 1,
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--periwinkle)",
                            fontSize: "16px",
                            background: "var(--paper)"
                          }}
                        />
                        <button
                          onClick={() => handleSaveEditDept(index)}
                          aria-label={`บันทึกการแก้ไข ${name}`}
                          style={{ padding: "6px", color: "var(--success)", background: "rgba(33, 122, 82, 0.1)", borderRadius: "6px", border: "none", cursor: "pointer" }}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingDeptIndex(null)}
                          aria-label={`ยกเลิกการแก้ไข ${name}`}
                          style={{ padding: "6px", color: "var(--muted)", background: "rgba(0, 0, 0, 0.05)", borderRadius: "6px", border: "none", cursor: "pointer" }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="admin-options-row-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "16px" }}>{name}</span>
                          {isNew && (
                            <span style={{ fontSize: "10px", background: "var(--apricot)", color: "#8a3a00", padding: "2px 6px", borderRadius: "12px", fontWeight: "bold" }}>
                              ใหม่
                            </span>
                          )}
                        </div>
                        <div className="admin-options-row-actions" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          {/* Reordering */}
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveDept(index, "up")}
                            aria-label={`เลื่อน ${name} ขึ้น`}
                            style={{ 
                              padding: "4px", 
                              color: index === 0 ? "#ccc" : "var(--muted)", 
                              background: "none", 
                              border: "none", 
                              cursor: index === 0 ? "not-allowed" : "pointer" 
                            }}
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            disabled={index === departments.length - 1}
                            onClick={() => handleMoveDept(index, "down")}
                            aria-label={`เลื่อน ${name} ลง`}
                            style={{ 
                              padding: "4px", 
                              color: index === departments.length - 1 ? "#ccc" : "var(--muted)", 
                              background: "none", 
                              border: "none", 
                              cursor: index === departments.length - 1 ? "not-allowed" : "pointer" 
                            }}
                            title="เลื่อนลง"
                          >
                            <ArrowDown size={15} />
                          </button>
                          
                          {/* Edit */}
                          <button
                            onClick={() => handleStartEditDept(index, name)}
                            aria-label={`แก้ไข ${name}`}
                            style={{ 
                              padding: "4px 6px", 
                              color: "var(--periwinkle)", 
                              background: "none", 
                              border: "none", 
                              cursor: "pointer" 
                            }}
                            title="แก้ไขชื่อ"
                          >
                            <Edit2 size={14} />
                          </button>
                          
                          {/* Delete */}
                          <button
                            onClick={() => handleRemoveDept(index)}
                            aria-label={`ลบ ${name}`}
                            style={{ 
                              padding: "4px 6px", 
                              color: "var(--error)", 
                              background: "none", 
                              border: "none", 
                              cursor: "pointer" 
                            }}
                            title="ลบ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ประเภทผลงาน Panel */}
        <section className="panel" style={{ background: "var(--paper-low)", padding: "28px", borderRadius: "16px", border: "1px solid #cdc3d040", boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ background: "var(--periwinkle)", color: "white", padding: "8px", borderRadius: "8px" }}>
                <Layers size={20} />
              </div>
              <div>
                <h2 className="section-title" style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
                  ประเภทผลงาน
                </h2>
                <span className="muted" style={{ fontSize: "13px" }}>
                  ทั้งหมด {workTypes.length} รายการ
                </span>
              </div>
            </div>
          </div>

          {/* Search Filter */}
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", opacity: 0.6 }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="ค้นหาประเภทผลงาน..."
              value={typeSearch}
              onChange={(e) => setTypeSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "var(--paper-white)",
                fontSize: "15px"
              }}
            />
            {typeSearch && (
              <button 
                onClick={() => setTypeSearch("")} 
                aria-label="ล้างการค้นหาประเภทผลงาน"
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Add input */}
          <div className="admin-options-add-row" style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <Input
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="เพิ่มประเภทผลงาน เช่น วิทยานิพนธ์"
              onKeyDown={(e) => e.key === "Enter" && handleAddType()}
            />
            <Button onClick={handleAddType} type="button" aria-label="เพิ่มประเภทผลงาน" style={{ padding: "8px 16px" }}>
              <Plus size={18} />
            </Button>
          </div>

          {/* Options List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "450px", overflowY: "auto", paddingRight: "4px" }}>
            {filteredWorkTypes.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", background: "var(--paper-white)", borderRadius: "10px", border: "1px dashed var(--line)" }}>
                <p className="muted" style={{ margin: 0 }}>
                  {typeSearch ? "ไม่พบผลลัพธ์การค้นหา" : "ไม่มีรายการประเภทผลงาน"}
                </p>
              </div>
            ) : (
              filteredWorkTypes.map(({ name, index }) => {
                const isEditing = editingTypeIndex === index;
                const isNew = !initialWorkTypes.includes(name);
                
                return (
                  <div className="admin-options-row"
                    key={`${name}-${index}`} 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "10px 14px", 
                      background: "var(--paper-white)", 
                      borderRadius: "10px", 
                      border: isNew ? "1px solid #ff7a3050" : "1px solid #cdc3d030",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isEditing ? (
                      <div style={{ display: "flex", gap: "8px", width: "100%", alignItems: "center" }}>
                        <input
                          type="text"
                          value={editingTypeValue}
                          onChange={(e) => setEditingTypeValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEditType(index);
                            if (e.key === "Escape") setEditingTypeIndex(null);
                          }}
                          autoFocus
                          style={{
                            flex: 1,
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--periwinkle)",
                            fontSize: "16px",
                            background: "var(--paper)"
                          }}
                        />
                        <button
                          onClick={() => handleSaveEditType(index)}
                          aria-label={`บันทึกการแก้ไข ${name}`}
                          style={{ padding: "6px", color: "var(--success)", background: "rgba(33, 122, 82, 0.1)", borderRadius: "6px", border: "none", cursor: "pointer" }}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingTypeIndex(null)}
                          aria-label={`ยกเลิกการแก้ไข ${name}`}
                          style={{ padding: "6px", color: "var(--muted)", background: "rgba(0, 0, 0, 0.05)", borderRadius: "6px", border: "none", cursor: "pointer" }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="admin-options-row-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "16px" }}>{name}</span>
                          {isNew && (
                            <span style={{ fontSize: "10px", background: "var(--apricot)", color: "#8a3a00", padding: "2px 6px", borderRadius: "12px", fontWeight: "bold" }}>
                              ใหม่
                            </span>
                          )}
                        </div>
                        <div className="admin-options-row-actions" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          {/* Reordering */}
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveType(index, "up")}
                            aria-label={`เลื่อน ${name} ขึ้น`}
                            style={{ 
                              padding: "4px", 
                              color: index === 0 ? "#ccc" : "var(--muted)", 
                              background: "none", 
                              border: "none", 
                              cursor: index === 0 ? "not-allowed" : "pointer" 
                            }}
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            disabled={index === workTypes.length - 1}
                            onClick={() => handleMoveType(index, "down")}
                            aria-label={`เลื่อน ${name} ลง`}
                            style={{ 
                              padding: "4px", 
                              color: index === workTypes.length - 1 ? "#ccc" : "var(--muted)", 
                              background: "none", 
                              border: "none", 
                              cursor: index === workTypes.length - 1 ? "not-allowed" : "pointer" 
                            }}
                            title="เลื่อนลง"
                          >
                            <ArrowDown size={15} />
                          </button>
                          
                          {/* Edit */}
                          <button
                            onClick={() => handleStartEditType(index, name)}
                            aria-label={`แก้ไข ${name}`}
                            style={{ 
                              padding: "4px 6px", 
                              color: "var(--periwinkle)", 
                              background: "none", 
                              border: "none", 
                              cursor: "pointer" 
                            }}
                            title="แก้ไขชื่อ"
                          >
                            <Edit2 size={14} />
                          </button>
                          
                          {/* Delete */}
                          <button
                            onClick={() => handleRemoveType(index)}
                            aria-label={`ลบ ${name}`}
                            style={{ 
                              padding: "4px 6px", 
                              color: "var(--error)", 
                              background: "none", 
                              border: "none", 
                              cursor: "pointer" 
                            }}
                            title="ลบ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>

      <div className="admin-options-actions" style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        {hasUnsavedChanges && (
          <Button variant="secondary" onClick={handleDiscard} disabled={saving}>
            <RotateCcw size={18} style={{ marginRight: "6px" }} />
            <span>ยกเลิกการเปลี่ยนแปลง</span>
          </Button>
        )}
        <Button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Save size={18} />
          <span>{saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่าทั้งหมด"}</span>
        </Button>
      </div>
    </main>
  );
}
