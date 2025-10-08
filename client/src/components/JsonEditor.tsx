import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Code, X } from "lucide-react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  placeholder?: string;
  submitLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function JsonEditor({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = '{\n  "name": "John Doe",\n  "role": "Developer"\n}',
  submitLabel = "Submit",
  isLoading = false,
  disabled = false,
}: JsonEditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">Credential JSON</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={disabled || !value}
          data-testid="button-clear"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Enter Credential Data
        </label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-64 font-mono text-sm bg-card resize-none"
          disabled={disabled}
          data-testid="input-credential-json"
        />
        <p className="text-xs text-muted-foreground">
          Press Ctrl+Enter or Cmd+Enter to submit
        </p>
      </div>

      <Button
        onClick={onSubmit}
        disabled={disabled || !value || isLoading}
        className="w-full"
        size="lg"
        data-testid="button-submit"
      >
        {isLoading ? "Processing..." : submitLabel}
      </Button>
    </Card>
  );
}
