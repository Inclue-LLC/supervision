-- CreateTable
CREATE TABLE "Supervisor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "affiliation" TEXT,
    "specialty" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clientName" TEXT,
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "supervisorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "fileUrl" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Content_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL,
    "supervisorId" TEXT,
    "projectId" TEXT,
    "contentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Supervisor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Supervisor_email_key" ON "Supervisor"("email");
