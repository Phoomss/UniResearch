"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type SearchTypewriterProps = {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    waitTime?: number;
    nextTextDelay?: number;
    className?: string;
};

export default function SearchTypewriter({
    texts,
    typingSpeed = 70,
    deletingSpeed = 40,
    waitTime = 1400,
    nextTextDelay = 300,
    className = "",
}: SearchTypewriterProps) {
    const [displayText, setDisplayText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [characterIndex, setCharacterIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (texts.length === 0) return;

        const currentText = texts[textIndex] ?? "";

        let delay = typingSpeed;

        if (!isDeleting && characterIndex >= currentText.length) {
            delay = waitTime;
        } else if (isDeleting && displayText.length > 0) {
            delay = deletingSpeed;
        } else if (isDeleting && displayText.length === 0) {
            delay = nextTextDelay;
        }

        const timeout = setTimeout(() => {
            // กำลังพิมพ์ข้อความ
            if (!isDeleting && characterIndex < currentText.length) {
                const nextCharacterIndex = characterIndex + 1;

                setDisplayText(currentText.slice(0, nextCharacterIndex));
                setCharacterIndex(nextCharacterIndex);

                return;
            }

            // พิมพ์ครบแล้ว เริ่มลบ
            if (!isDeleting && characterIndex >= currentText.length) {
                setIsDeleting(true);

                return;
            }

            // กำลังลบข้อความ
            if (isDeleting && displayText.length > 0) {
                setDisplayText((previous) => previous.slice(0, -1));

                return;
            }

            // ลบหมดแล้ว เปลี่ยนไปข้อความถัดไป
            setIsDeleting(false);
            setCharacterIndex(0);
            setTextIndex((previous) => (previous + 1) % texts.length);
        }, delay);

        return () => clearTimeout(timeout);
    }, [
        characterIndex,
        deletingSpeed,
        displayText,
        isDeleting,
        nextTextDelay,
        textIndex,
        texts,
        typingSpeed,
        waitTime,
    ]);

    if (texts.length === 0) {
        return null;
    }

    return (
        <span
            aria-hidden="true"
            className={`pointer-events-none flex min-w-0 items-center justify-start text-left ${className}`}
        >
            <span className="truncate text-left">{displayText}</span>

            <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0, 1] }}
                transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                }}
                className="ml-0.5 inline-block"
            >
                |
            </motion.span>
        </span>
    );
}