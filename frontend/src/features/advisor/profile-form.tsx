"use client";

import React, { useState } from "react";
import { UserRound, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/src/components/ui/Toast";
import type { UserResponse } from "@/src/lib/api/types";

interface ProfileFormProps {
  initialUser: UserResponse;
  departments: string[];
}

export function ProfileForm({ initialUser, departments }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(initialUser.first_name || "");
  const [lastName, setLastName] = useState(initialUser.last_name || "");
  const [email, setEmail] = useState(initialUser.email || "");
  const [department, setDepartment] = useState(initialUser.department || "");
  const [studentId, setStudentId] = useState(initialUser.student_id || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const { success, error } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    
    if (password && password !== confirmPassword) {
      setErrorMsg("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    
    setIsSubmitting(true);
    
    const updateData: any = {
      first_name: firstName || null,
      last_name: lastName || null,
      email: email,
      department: department || null,
    };

    if (initialUser.role === "student") {
      updateData.student_id = studentId || null;
    }
    
    if (password) {
      updateData.password = password;
    }
    
    try {
      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await response.json().catch(() => ({}));
      
      if (response.ok) {
        success("อัปเดตข้อมูลส่วนตัวสำเร็จ");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMsg(data.error?.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        error(data.error?.message || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setErrorMsg("ไม่สามารถเชื่อมต่อระบบเพื่ออัปเดตข้อมูลได้");
      error("การเชื่อมต่อล้มเหลว");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {errorMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", borderRadius: "8px", fontSize: "14px" }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Name fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>ชื่อจริง</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="ชื่อจริง"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none", fontSize: "14px" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>นามสกุล</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="นามสกุล"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none", fontSize: "14px" }}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>อีเมล</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="email@example.com"
          required
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none", fontSize: "14px" }}
        />
      </div>

      {/* Student ID */}
      {initialUser.role === "student" && (
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>รหัสนักศึกษา</label>
          <input 
            type="text" 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)} 
            placeholder="รหัสนักศึกษา"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none", fontSize: "14px" }}
          />
        </div>
      )}

      {/* Department Dropdown */}
      <div>
        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>ภาควิชา</label>
        <select 
          value={department} 
          onChange={(e) => setDepartment(e.target.value)} 
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none", fontSize: "14px", background: "white", cursor: "pointer" }}
        >
          <option value="">เลือกภาควิชา</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #e5e7eb", margin: "10px 0" }} />

      {/* Password changes */}
      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", margin: "0" }}>เปลี่ยนรหัสผ่าน (ปล่อยว่างหากไม่ต้องการเปลี่ยน)</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>รหัสผ่านใหม่</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="รหัสผ่านใหม่"
            minLength={6}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none", fontSize: "14px" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>ยืนยันรหัสผ่านใหม่</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="ยืนยันรหัสผ่านใหม่"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none", fontSize: "14px" }}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{ 
          background: "#48276a", 
          color: "white", 
          border: "none", 
          padding: "12px 24px", 
          borderRadius: "8px", 
          fontWeight: "600", 
          fontSize: "14px", 
          cursor: "pointer", 
          marginTop: "10px",
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s ease"
        }}
      >
        <span>{isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}</span>
      </button>
    </form>
  );
}
