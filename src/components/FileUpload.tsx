"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  onFileSelect: (content: string) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const isValid = file.name.endsWith(".txt") || file.name.endsWith(".json");

      if (!isValid) {
        setError("txt 또는 json 파일만 가능합니다");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("파일 크기는 10MB 이하여야 합니다");
        return;
      }

      try {
        const content = await file.text();
        onFileSelect(content);
      } catch {
        setError("파일을 읽을 수 없습니다");
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="space-y-3">
      <label
        htmlFor="file-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          block w-full p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors
          ${isDragging
            ? "border-[var(--color-text-primary)] bg-[var(--color-surface)]"
            : "border-[var(--color-border)] hover:border-[var(--color-text-tertiary)] hover:bg-[var(--color-surface)]"
          }
          ${isLoading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input
          id="file-upload"
          type="file"
          accept=".txt,.json"
          onChange={handleInputChange}
          className="sr-only"
          disabled={isLoading}
        />

        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[var(--color-text-secondary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-medium text-[var(--color-text-primary)]">
              {isLoading ? "업로드 중..." : "파일 선택 또는 드래그"}
            </p>
            <p className="text-[13px] text-[var(--color-text-tertiary)] mt-1">
              .txt 또는 .json
            </p>
          </div>
        </div>
      </label>

      {error && (
        <p className="text-[14px] text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
