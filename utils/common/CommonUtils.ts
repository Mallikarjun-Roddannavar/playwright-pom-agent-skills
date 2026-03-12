import path from "node:path";

const repoRoot = process.cwd();

export const authDir = path.resolve(repoRoot, ".auth");
export const authStatePath = {
  admin: path.resolve(authDir, "admin.json"),
  editor: path.resolve(authDir, "editor.json"),
  viewer: path.resolve(authDir, "viewer.json"),
} as const;

export function uniqueId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

export function folderName(seed = "folder"): string {
  return uniqueId(seed);
}

export function fileName(seed = "file"): string {
  return `${uniqueId(seed)}.txt`;
}
