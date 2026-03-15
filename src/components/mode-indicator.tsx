"use client";

import { Badge } from "@/components/ui/badge";

export function ModeIndicator({ mode }: { mode: "mock" | "live" }) {
  return (
    <Badge
      variant={mode === "live" ? "default" : "secondary"}
      className={
        mode === "live"
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-yellow-100 text-yellow-800 border border-yellow-300"
      }
    >
      {mode === "live" ? "● LIVE" : "◎ MOCK"}
    </Badge>
  );
}
