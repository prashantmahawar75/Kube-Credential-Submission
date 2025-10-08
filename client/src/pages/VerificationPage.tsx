import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { JsonEditor } from "@/components/JsonEditor";
import { ResponseDisplay } from "@/components/ResponseDisplay";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { VerificationResponse } from "@shared/schema";

export default function VerificationPage() {
  const [credentialJson, setCredentialJson] = useState("");
  const [response, setResponse] = useState<VerificationResponse | null>(null);
  const { toast } = useToast();

  const verifyMutation = useMutation({
    mutationFn: async (credential: any) => {
      const res = await apiRequest<VerificationResponse>("POST", "/api/verification/verify", { credential });
      return res;
    },
    onSuccess: (data) => {
      setResponse(data);
      if (data.success) {
        toast({
          title: data.isValid ? "Valid Credential" : "Invalid Credential",
          description: data.message,
          variant: data.isValid ? "default" : "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to verify credential",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(credentialJson);
      verifyMutation.mutate(parsed);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please enter valid JSON data",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setCredentialJson("");
    setResponse(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="h-32 bg-gradient-to-br from-accent/30 via-accent/15 to-background border-b border-border flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <h1 className="text-4xl font-bold text-foreground mb-2">Credential Verification</h1>
          <p className="text-muted-foreground">Verify issued credentials with worker and timestamp validation</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <JsonEditor
              value={credentialJson}
              onChange={setCredentialJson}
              onSubmit={handleSubmit}
              onClear={handleClear}
              submitLabel="Verify Credential"
              isLoading={verifyMutation.isPending}
              disabled={verifyMutation.isPending}
            />
          </div>
          <div>
            <ResponseDisplay response={response} type="verification" />
          </div>
        </div>
      </div>
    </div>
  );
}
