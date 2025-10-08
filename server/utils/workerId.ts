import { nanoid } from "nanoid";

let workerId: string | null = null;

export function getWorkerId(): string {
  if (!workerId) {
    const instanceId = nanoid(4);
    workerId = `worker-${instanceId}`;
  }
  return workerId;
}
