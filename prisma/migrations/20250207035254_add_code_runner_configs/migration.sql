/*
  Warnings:

  - A unique constraint covering the columns `[language]` on the table `code_runner_configs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `code_runner_configs_language_idx` ON `code_runner_configs`;

-- AlterTable
ALTER TABLE `code_runner_configs` MODIFY `prefix` TEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `code_runner_configs_language_key` ON `code_runner_configs`(`language`);
