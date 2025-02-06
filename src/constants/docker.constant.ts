export enum CodeType {
  cpp = 'cpp',
  nodejs = 'nodejs',
  go = 'go',
  python = 'python',
  java = 'java',
  php = 'php',
  rust = 'rust',
  c = 'c',
  dotnet = 'dotnet',
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
  dotnet: 'dotnet',
  ts: 'nodejs',
};

export enum FileSuffix {
  cpp = 'cpp',
  nodejs = 'js',
  go = 'go',
  python = 'py',
  java = 'java',
  php = 'php',
  rust = 'rs',
  c = 'c',
  dotnet = 'cs',
  ts = 'ts',
}

interface CodeDockerOption {
  shell: string;
  fileSuffix: FileSuffix;
  shellWithStdin: string;
  prefix?: string;
}
export const imageMap: Record<string, CodeDockerOption> = {
  cpp: {
    shell: 'g++ code.cpp -o code.out && ./code.out',
    shellWithStdin: 'g++ code.cpp -o code.out && ./code.out < input.txt',
    fileSuffix: FileSuffix.cpp,
  },
  nodejs: {
    shell: 'node code.js',
    shellWithStdin: 'node code.js < input.txt',
    fileSuffix: FileSuffix.nodejs,
  },
  go: {
    shell: 'go run code.go',
    shellWithStdin: 'go run code.go < input.txt',
    fileSuffix: FileSuffix.go,
  },

  'python:2.7.18': {
    shell: 'python code.py',
    shellWithStdin: 'python code.py input.txt',
    fileSuffix: FileSuffix.python,
  },
  'python:3.9.18': {
    shell: 'python3 code.py',
    shellWithStdin: 'python3 code.py input.txt',
    fileSuffix: FileSuffix.python,
    prefix: `def expand_arg_files():
      import sys
      args = []
      if len(sys.argv) < 2:
          return
      with open(file=sys.argv[1], mode="r", encoding="utf-8") as f:
          line = f.readline()
          while line:
              args.append(line.strip())
              line = f.readline()
      sys.argv[1:] = args
  
  
  expand_arg_files()
  `,
  },
  java: {
    shell: 'javac Code.java && java Code',
    shellWithStdin: 'javac Code.java && java Code < input.txt',
    fileSuffix: FileSuffix.java,
  },
  php: {
    shell: 'php code.php',
    shellWithStdin: 'php code.php < input.txt',
    fileSuffix: FileSuffix.php,
  },
  rust: {
    shell: 'rustc code.rs && ./code',
    shellWithStdin: 'rustc code.rs && ./code < input.txt',
    fileSuffix: FileSuffix.rust,
  },
  c: {
    shell: 'g++ code.c -o code.out && ./code.out',
    shellWithStdin: 'g++ code.c -o code.out && ./code.out < input.txt',
    fileSuffix: FileSuffix.c,
  },
  dotnet: {
    shell: 'mcs -out:code.exe code.cs && mono code.exe',
    shellWithStdin: 'mcs -out:code.exe code.cs && mono code.exe < input.txt',
    fileSuffix: FileSuffix.dotnet,
  },
  typescript: {
    shell: './node_modules/typescript/bin/tsc code.ts && node code.js',
    shellWithStdin:
      './node_modules/typescript/bin/tsc code.ts && node code.js < input.txt',
    fileSuffix: FileSuffix.ts,
  },
};

export const defaultVersion = {
  [CodeEnv.cpp]: '14.2',
  [CodeEnv.c]: '14.2',
  [CodeEnv.java]: '8',
  [CodeEnv.rust]: '1.83.0',
  [CodeEnv.nodejs]: '18',
  [CodeEnv.python]: '3.9.18',
  [CodeEnv.php]: '8.4',
  [CodeEnv.dotnet]: '6.12',
  [CodeEnv.go]: '1.18',
};
