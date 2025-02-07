export enum CodeType {
  cpp = 'cpp',
  nodejs = 'nodejs',
  go = 'go',
  python = 'python',
  java = 'java',
  php = 'php',
  rust = 'rust',
  c = 'c',
  ts = 'typescript',
}

export const CodeEnv: Record<string, string> = {
  cpp: 'cpp',
  nodejs: 'nodejs',
  go: 'go',
  python: 'python',
  java: 'java',
  php: 'php',
  rust: 'rust',
  c: 'cpp',
  ts: 'nodejs',
};
export const defaultVersion = {
  [CodeEnv.cpp]: '14',
  [CodeEnv.c]: '14',
  [CodeEnv.java]: '8',
  [CodeEnv.rust]: '1',
  [CodeEnv.nodejs]: '18',
  [CodeEnv.python]: '3',
  [CodeEnv.php]: '8',
  [CodeEnv.go]: '1',
};
