import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const codeRunnerConfigs = [
  {
    language: 'cpp',
    shell: 'g++ code.cpp -o code.out && ./code.out',
    shellWithStdin: 'g++ code.cpp -o code.out && ./code.out < input.txt',
    fileSuffix: 'cpp',
  },
  {
    language: 'nodejs',
    shell: 'node code.js',
    shellWithStdin: 'node code.js < input.txt',
    fileSuffix: 'js',
  },
  {
    language: 'go',
    shell: 'go run code.go',
    shellWithStdin: 'go run code.go < input.txt',
    fileSuffix: 'go',
  },
  {
    language: 'python:2',
    shell: 'python code.py',
    shellWithStdin: 'python code.py input.txt',
    fileSuffix: 'py',
  },
  {
    language: 'python:3',
    shell: 'python3 code.py',
    shellWithStdin: 'python3 code.py input.txt',
    fileSuffix: 'py',
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
  {
    language: 'java',
    shell: 'javac Code.java && java Code',
    shellWithStdin: 'javac Code.java && java Code < input.txt',
    fileSuffix: 'java',
  },
  {
    language: 'php',
    shell: 'php code.php',
    shellWithStdin: 'php code.php < input.txt',
    fileSuffix: 'php',
  },
  {
    language: 'rust',
    shell: 'rustc code.rs && ./code',
    shellWithStdin: 'rustc code.rs && ./code < input.txt',
    fileSuffix: 'rs',
  },
  {
    language: 'c',
    shell: 'g++ code.c -o code.out && ./code.out',
    shellWithStdin: 'g++ code.c -o code.out && ./code.out < input.txt',
    fileSuffix: 'c',
  },
  {
    language: 'typescript',
    shell: './node_modules/typescript/bin/tsc code.ts && node code.js',
    shellWithStdin:
      './node_modules/typescript/bin/tsc code.ts && node code.js < input.txt',
    fileSuffix: 'ts',
  },
];

async function main() {
  console.log('开始数据库填充...');

  for (const config of codeRunnerConfigs) {
    await prisma.codeRunnerConfig.upsert({
      where: { language: config.language },
      update: config,
      create: config,
    });
  }

  console.log('数据库填充完成！');
}

main()
  .catch((e) => {
    console.error('填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
