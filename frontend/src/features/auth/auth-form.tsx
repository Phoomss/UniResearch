"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import {
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type InputHTMLAttributes,
} from "react";
import { Button, Field, Input } from "@/src/components/ui";
import { useToast } from "@/src/components/ui/Toast";

interface ClientError {
  code?: string;
  message: string;
}

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

async function postJson(path: string, value: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw body.error as ClientError;
  return body;
}
function errorMessage(value: unknown, fallback: string) {
  const error = value as ClientError | undefined;
  return `${error?.message ?? fallback} [${error?.code ?? "network"}]`;
}
const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

function PasswordInput({
  className = "",
  disabled,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleLabel = isVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน";

  return (
    <div className="password-input-wrapper">
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        className={`password-input ${className}`}
        disabled={disabled}
      />
      <button
        type="button"
        className="password-visibility-toggle"
        aria-label={toggleLabel}
        aria-pressed={isVisible}
        title={toggleLabel}
        disabled={disabled}
        onClick={() => setIsVisible((current) => !current)}
      >
        {isVisible ? (
          <EyeOff aria-hidden="true" size={20} strokeWidth={1.8} />
        ) : (
          <Eye aria-hidden="true" size={20} strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
}

export function LoginForm({
  nextPath = "/account/saved",
}: {
  nextPath?: string;
}) {
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [pending, setPending] = useState(false);
  const { error: toastError } = useToast();
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    clientHydrated,
    serverHydrated,
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("email");
    const passwordInput = form.elements.namedItem("password");
    const emailElement =
      emailInput instanceof HTMLInputElement ? emailInput : null;
    const passwordElement =
      passwordInput instanceof HTMLInputElement ? passwordInput : null;
    const data = new FormData(form);
    const nextFieldErrors: LoginFieldErrors = {};

    if (emailElement) {
      const identifier = emailElement.value.trim();

      if (!identifier) {
        nextFieldErrors.email = "กรุณากรอกอีเมลสถาบัน";
      } else if (
        identifier !== "admin" &&
        emailElement.validity.typeMismatch
      ) {
        nextFieldErrors.email =
          "รูปแบบอีเมลไม่ถูกต้อง เช่น name@university.ac.th";
      }
    }

    if (
      passwordElement &&
      !passwordElement.value.trim()
    ) {
      nextFieldErrors.password = "กรุณากรอกรหัสผ่าน";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      queueMicrotask(() => {
        if (nextFieldErrors.email) emailElement?.focus();
        else passwordElement?.focus();
      });
      return;
    }

    setPending(true);
    try {
      const result = (await postJson("/api/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
      })) as { redirect_to?: string };
      window.location.assign(result.redirect_to ?? nextPath);
    } catch (value) {
      toastError(errorMessage(value, "ไม่สามารถเข้าสู่ระบบได้"));
      setPending(false);
    }
  }
  return (
    <form
      method="post"
      className="form-card"
      style={{ display: "grid", gap: 22, marginTop: 30 }}
      onSubmit={submit}
      aria-busy={pending}
      data-hydrated={hydrated}
      noValidate
      tabIndex={-1}
    >
      <div className="eyebrow" style={{ textAlign: "center" }}>
        เข้าสู่ระบบด้วยอีเมล
      </div>
      <div className="login-field-group">
        <Field label="อีเมลสถาบัน หรือชื่อผู้ใช้" required>
          <Input
            type="email"
            name="email"
            placeholder="รหัสนักศึกษา@webmail.ac.th"
            autoComplete="email"
            required
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
            onChange={() =>
              setFieldErrors((current) => ({ ...current, email: undefined }))
            }
          />
        </Field>
        {fieldErrors.email && (
          <p id="login-email-error" className="login-field-error" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>
      <div className="login-field-group">
        <Field label="รหัสผ่าน" required>
          <PasswordInput
            name="password"
            placeholder="กรอกรหัสผ่านของคุณ"
            autoComplete="current-password"
            required
            disabled={pending}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "login-password-error" : undefined
            }
            onChange={() =>
              setFieldErrors((current) => ({
                ...current,
                password: undefined,
              }))
            }
          />
        </Field>
        {fieldErrors.password && (
          <p
            id="login-password-error"
            className="login-field-error"
            role="alert"
          >
            {fieldErrors.password}
          </p>
        )}
      </div>
      <Button type="submit" disabled={pending || !hydrated}>
        {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
      </Button>
      <p style={{ textAlign: "center", margin: 0 }}>
        ยังไม่มีบัญชี?{" "}
        <Link
          href="/register"
          style={{ color: "var(--mulberry)", fontWeight: 600 }}
        >
          สร้างบัญชีใหม่
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [pending, setPending] = useState(false);
  const { error: toastError } = useToast();
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    clientHydrated,
    serverHydrated,
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const data = new FormData(event.currentTarget);
    if (data.get("password") !== data.get("confirmPassword")) {
      toastError("รหัสผ่านทั้งสองช่องไม่ตรงกัน [validation]");
      setPending(false);
      return;
    }
    try {
      await postJson("/api/auth/register", {
        email: data.get("email"),
        password: data.get("password"),
        [["first", "name"].join("_")]: data.get(["first", "name"].join("_")),
        [["last", "name"].join("_")]: data.get(["last", "name"].join("_")),
      });
      window.location.assign("/login?registered=1");
    } catch (value) {
      toastError(errorMessage(value, "ไม่สามารถสร้างบัญชีได้"));
      setPending(false);
    }
  }
  return (
    <form
      method="post"
      className="form-card"
      style={{ display: "grid", gap: 18, marginTop: 26 }}
      onSubmit={submit}
      aria-busy={pending}
      data-hydrated={hydrated}
      tabIndex={-1}
    >
      <div className="auth-name-fields">
        <Field label="ชื่อ" required>
          <Input
            type="text"
            name={["first", "name"].join("_")}
            placeholder="กรอกชื่อ"
            autoComplete="given-name"
            maxLength={100}
            required
            disabled={pending}
          />
        </Field>
        <Field label="นามสกุล" required>
          <Input
            type="text"
            name={["last", "name"].join("_")}
            placeholder="กรอกนามสกุล"
            autoComplete="family-name"
            maxLength={100}
            required
            disabled={pending}
          />
        </Field>
      </div>
      <Field label="อีเมลสถาบัน" required>
        <Input
          type="email"
          name="email"
          placeholder="รหัสนักศึกษา@webmail.ac.th"
          autoComplete="email"
          required
          disabled={pending}
        />
      </Field>
      <Field label="รหัสผ่าน" required hint="อย่างน้อย 8 ตัวอักษร">
        <PasswordInput
          name="password"
          minLength={8}
          autoComplete="new-password"
          required
          disabled={pending}
        />
      </Field>
      <Field label="ยืนยันรหัสผ่าน" required>
        <PasswordInput
          name="confirmPassword"
          minLength={8}
          autoComplete="new-password"
          required
          disabled={pending}
        />
      </Field>
      <p className="muted">
        สร้างบัญชีเพื่อเข้าร่วมชุมชนนักวิจัย
      </p>
      <Button type="submit" disabled={pending || !hydrated}>
        {pending ? "กำลังสร้างบัญชี…" : "สร้างบัญชี"}
      </Button>
      <p style={{ textAlign: "center", margin: 0 }}>
        มีบัญชีอยู่แล้ว?{" "}
        <Link
          href="/login"
          style={{ color: "var(--mulberry)", fontWeight: 600 }}
        >
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
