"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { ClassificationConfig } from "@/lib/types";
import { DEFAULT_CONFIG } from "@/lib/config";

interface ConfigPanelProps {
  config: ClassificationConfig;
  onChange: (config: ClassificationConfig) => void;
}

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(config);

  function handleApply() {
    onChange(local);
  }

  function handleReset() {
    setLocal(DEFAULT_CONFIG);
    onChange(DEFAULT_CONFIG);
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Settings2 className="w-4 h-4" />
        분류 규칙 설정
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <Card className="mt-2 border-slate-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  오래된 브랜치 기준 (일)
                  <span className="ml-1 text-slate-400">staleDaysThreshold</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  value={local.staleDaysThreshold}
                  onChange={(e) =>
                    setLocal({ ...local, staleDaysThreshold: parseInt(e.target.value) || 90 })
                  }
                />
                <p className="text-xs text-slate-400 mt-1">
                  이 일수 이상 경과된 브랜치 = 검토 대상
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  병합 후 삭제 권장 기준 (일)
                  <span className="ml-1 text-slate-400">reviewDaysThreshold</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  value={local.reviewDaysThreshold}
                  onChange={(e) =>
                    setLocal({ ...local, reviewDaysThreshold: parseInt(e.target.value) || 30 })
                  }
                />
                <p className="text-xs text-slate-400 mt-1">
                  병합 후 이 일수 이상 경과 = 삭제 권장
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  임시 브랜치 패턴 (쉼표 구분)
                </label>
                <Input
                  value={local.tempBranchPatterns.join(", ")}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      tempBranchPatterns: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={handleApply}>
                적용
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                초기화
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
