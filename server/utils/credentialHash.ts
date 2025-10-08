import { createHash } from "crypto";

export function hashCredential(credential: any): string {
  const normalized = JSON.stringify(sortObjectKeys(credential));
  return createHash("sha256").update(normalized).digest("hex");
}

function sortObjectKeys(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  const sorted: any = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = sortObjectKeys(obj[key]);
    });
  return sorted;
}
