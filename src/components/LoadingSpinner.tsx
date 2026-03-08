import { Loader2 } from "lucide-react";

export function LoadingSpinner({ text = "Analyzing image..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
}
