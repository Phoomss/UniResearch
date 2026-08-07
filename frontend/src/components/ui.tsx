import Image from "next/image";
import Link from "next/link";
import {
  Children,
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type Ref,
} from "react";

export function Brand() {
    return (
      <Link className="brand" href="/">
      <Image
        className="brand-logo"
        src="/uniresearch-icon-logo.png"
        alt=""
        width={60}
        height={60}
        priority
      />
      <span>UniResearch</span>
      </Link>
  );
}

export function LanguageSwitch() {
  return (
    <span className="lang-switch" aria-label="ภาษา">
      <span className="active">TH</span>
      <span>EN</span>
    </span>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      {...props}
    />
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

export function ButtonLink({
  href,
  variant = "primary",
  children,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </Link>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
};

type FieldControlProps = {
  id?: string;
  name?: string;
  "aria-describedby"?: string;
};

export function Field({
  label,
  required,
  hint,
  children,
}: FieldProps) {
  const child = Children.only(children);
  const control = isValidElement(child)
    ? (child as ReactElement<FieldControlProps>)
    : null;

  const controlId = control?.props.id ?? control?.props.name;
  const hintId = hint && controlId ? `${controlId}-hint` : undefined;
  const describedBy = [control?.props["aria-describedby"], hintId]
    .filter(Boolean)
    .join(" ") || undefined;

  const describedControl =
    control && controlId
      ? cloneElement(control, {
          id: controlId,
          ...(describedBy
            ? { "aria-describedby": describedBy }
            : {}),
        })
      : children;

  if (!controlId) {
    return (
      <div className="field">
        <label>
          {label}
          {required && (
            <span className="required-mark" aria-hidden="true">
              {" "}*
            </span>
          )}
          {children}
        </label>

        {hint && <small className="field-hint">{hint}</small>}
      </div>
    );
  }

  return (
    <div className="field">
      <label htmlFor={controlId}>
        {label}
        {required && (
          <span className="required-mark" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>

      {describedControl}

      {hint && (
        <small id={hintId} className="field-hint">
          {hint}
        </small>
      )}
    </div>
  );
}

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`input ${className}`} {...props} />;
}

export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`select ${className}`} {...props} />;
}

export function Textarea({
  className = "",
  ref,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  return <textarea ref={ref} className={`textarea ${className}`} {...props} />;
}

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  children: ReactNode;
};

export function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <label className="check">
      <input type="checkbox" {...props} />
      <span>{children}</span>
    </label>
  );
}

type ArchiveTabTone = "lavender" | "blue" | "apricot";

type ArchiveTabProps = {
  children: ReactNode;
  tone?: ArchiveTabTone;
};

export function ArchiveTab({
  children,
  tone = "lavender",
}: ArchiveTabProps) {
  const toneClassName = tone === "lavender" ? "" : tone;

  return (
    <span className={`archive-tab ${toneClassName}`}>
      {children}
    </span>
  );
}

type StatusTone = "approved" | "review" | "revision" | "error";

type StatusProps = {
  children: ReactNode;
  tone?: StatusTone;
};

export function Status({
  children,
  tone = "review",
}: StatusProps) {
  return <span className={`status ${tone}`}>{children}</span>;
}

type StatePanelKind = "loading" | "empty" | "success" | "error";

type StatePanelProps = {
  kind: StatePanelKind;
  title: string;
  detail: string;
  icon?: ReactNode;
};

export function StatePanel({
  kind,
  title,
  detail,
  icon,
}: StatePanelProps) {
  const role = kind === "error" ? "alert" : "status";
  const titlePrefix =
    kind === "success" ? "✓ " : kind === "error" ? "! " : "[ ] ";

  return (
    <div className={`state state-${kind}`} role={role}>
      {kind === "loading" ? (
        <>
          <span className="sr-only">
            {title}. {detail}
          </span>

          <div className="skeleton" />
          <div
            className="skeleton"
            style={{ width: "60%", margin: "12px auto" }}
          />
        </>
      ) : (
        <>
          <strong className="state-title">
            {icon ? (
              <span className="state-title-icon" aria-hidden="true">
                {icon}
              </span>
            ) : (
              titlePrefix
            )}
            {title}
          </strong>
          <p className="muted">{detail}</p>
        </>
      )}
    </div>
  );
}
