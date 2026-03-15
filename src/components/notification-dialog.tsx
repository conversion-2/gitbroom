"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClassifiedBranch } from "@/lib/types";
import { generateNotificationMessage } from "@/lib/notification";
import { Copy, Check } from "lucide-react";

interface NotificationDialogProps {
  branch: ClassifiedBranch | null;
  onClose: () => void;
}

export function NotificationDialog({ branch, onClose }: NotificationDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!branch) return null;

  const message = generateNotificationMessage(branch);

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={!!branch} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            담당자 알림 메시지 생성
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500">
              브랜치:{" "}
              <span className="font-mono font-medium text-slate-700">
                {branch.name}
              </span>
            </p>
            {branch.owner && (
              <p className="text-xs text-slate-500">
                추정 담당자:{" "}
                <span className="font-medium text-slate-700">
                  {branch.owner.name}
                </span>
                <span className="ml-1 text-slate-400">
                  ({Math.round(branch.owner.confidence * 100)}%)
                </span>
              </p>
            )}
          </div>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
            {message}
          </pre>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={onClose}>
              닫기
            </Button>
            <Button size="sm" onClick={handleCopy} className="gap-2">
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  복사 완료!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  클립보드 복사
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
