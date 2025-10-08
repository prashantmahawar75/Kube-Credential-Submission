import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, Copy, Check, Clock, Server } from "lucide-react";
import { useState } from "react";
import type { IssuanceResponse, VerificationResponse } from "@shared/schema";

interface ResponseDisplayProps {
  response: IssuanceResponse | VerificationResponse | null;
  type: "issuance" | "verification";
}

export function ResponseDisplay({ response, type }: ResponseDisplayProps) {
  const [copied, setCopied] = useState(false);

  if (!response) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center min-h-64 bg-card">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
            <Server className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">No Response Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {type === "issuance"
                ? "Enter credential data and click submit to issue a new credential"
                : "Enter credential data and click verify to check its validity"}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const isSuccess = response.success;
  const isWarning = "alreadyIssued" in response && response.alreadyIssued;
  
  const borderColor = isWarning
    ? "border-l-warning"
    : isSuccess
    ? "border-l-success"
    : "border-l-destructive";

  const bgColor = isWarning
    ? "bg-warning/5"
    : isSuccess
    ? "bg-success/5"
    : "bg-destructive/5";

  const Icon = isWarning ? AlertTriangle : isSuccess ? CheckCircle2 : XCircle;
  const iconColor = isWarning
    ? "text-warning"
    : isSuccess
    ? "text-success"
    : "text-destructive";

  const handleCopy = async () => {
    const textToCopy = JSON.stringify(response, null, 2);
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`p-6 border-l-4 ${borderColor} ${bgColor}`} data-testid="response-display">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Icon className={`w-6 h-6 ${iconColor} mt-0.5`} data-testid="status-icon" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground" data-testid="status-message">
                {response.message}
              </h3>
              {response.workerId && (
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm bg-primary/10 text-primary px-3 py-1 rounded-full" data-testid="worker-id">
                    {response.workerId}
                  </span>
                </div>
              )}
              {response.timestamp && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span data-testid="timestamp">{new Date(response.timestamp).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="shrink-0"
            data-testid="button-copy"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        {"credential" in response && response.credential && (
          <div className="space-y-2">
            <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Credential Data
            </label>
            <pre className="bg-black/50 border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto text-foreground" data-testid="credential-data">
              {JSON.stringify(response.credential, null, 2)}
            </pre>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Full Response
          </label>
          <pre className="bg-black/50 border border-border/50 rounded-lg p-4 font-mono text-sm overflow-x-auto text-foreground" data-testid="full-response">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
}
