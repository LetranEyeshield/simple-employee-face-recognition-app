-- CreateTable
CREATE TABLE "EmployeeTimeIn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "descriptor" JSONB NOT NULL,
    "timeIn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmployeeTimeOut" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "descriptor" JSONB NOT NULL,
    "timeOut" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
