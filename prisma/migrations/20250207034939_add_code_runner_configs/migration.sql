-- CreateTable
CREATE TABLE `code_runner_configs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `language` VARCHAR(191) NOT NULL,
    `shell` VARCHAR(191) NOT NULL,
    `shellWithStdin` VARCHAR(191) NOT NULL,
    `fileSuffix` VARCHAR(191) NOT NULL,
    `prefix` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `code_runner_configs_language_idx`(`language`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
