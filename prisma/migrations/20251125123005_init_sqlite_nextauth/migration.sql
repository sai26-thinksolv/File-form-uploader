-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT 'Untitled Form',
    "description" TEXT,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#000000',
    "secondaryColor" TEXT NOT NULL DEFAULT '#ffffff',
    "backgroundColor" TEXT NOT NULL DEFAULT '#f3f4f6',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "buttonTextColor" TEXT NOT NULL DEFAULT '#ffffff',
    "cardStyle" TEXT NOT NULL DEFAULT 'shadow',
    "borderRadius" TEXT NOT NULL DEFAULT 'md',
    "coverImageUrl" TEXT,
    "allowedTypes" TEXT NOT NULL DEFAULT '',
    "maxSizeMB" INTEGER NOT NULL DEFAULT 5,
    "driveEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isPasswordProtected" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "isCaptchaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "enableSubmitAnother" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isAcceptingResponses" BOOLEAN NOT NULL DEFAULT true,
    "expiryDate" DATETIME,
    "accessLevel" TEXT NOT NULL DEFAULT 'ANYONE',
    "allowedEmails" TEXT NOT NULL DEFAULT '',
    "enableMetadataSpreadsheet" BOOLEAN NOT NULL DEFAULT false,
    "subfolderOrganization" TEXT NOT NULL DEFAULT 'NONE',
    "customSubfolderField" TEXT,
    "enableSmartGrouping" BOOLEAN NOT NULL DEFAULT false,
    "uploadFields" JSONB,
    "customQuestions" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "metadata" JSONB,
    "answers" JSONB,
    "files" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Submission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
