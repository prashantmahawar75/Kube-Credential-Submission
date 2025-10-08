import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { JsonEditor } from "@/components/JsonEditor";
import { ResponseDisplay } from "@/components/ResponseDisplay";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { IssuanceResponse } from "@shared/schema";

export default function IssuancePage() {
  const [credentialJson, setCredentialJson] = useState("");
  const [response, setResponse] = useState<IssuanceResponse | null>(null);
  const { toast } = useToast();

  const issueMutation = useMutation({
    mutationFn: async (credential: any) => {
      const res = await apiRequest<IssuanceResponse>("POST", "/api/issuance/issue", { credential });
      return res;
    },
    onSuccess: (data) => {
      setResponse(data);
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to issue credential",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(credentialJson);
      issueMutation.mutate(parsed);
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
      <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b border-border flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <h1 className="text-4xl font-bold text-foreground mb-2">Credential Issuance</h1>
          <p className="text-muted-foreground">Issue new credentials with worker tracking and duplicate detection</p>
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
              submitLabel="Issue Credential"
              isLoading={issueMutation.isPending}
              disabled={issueMutation.isPending}
            />
          </div>
          <div>
            <ResponseDisplay response={response} type="issuance" />
          </div>
        </div>
      </div>
    </div>
  );
}
