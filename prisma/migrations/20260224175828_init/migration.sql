-- CreateEnum
CREATE TYPE "Participation" AS ENUM ('solo', 'team');

-- CreateEnum
CREATE TYPE "TechStack" AS ENUM ('react', 'vue', 'svelte', 'vanilla', 'other');

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL,
    "team_name" TEXT,
    "join_code" TEXT NOT NULL,
    "participation" "Participation" NOT NULL,
    "tech_stack" "TechStack" NOT NULL,
    "max_members" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "roll_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "github_url" TEXT NOT NULL,
    "is_lead" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_join_code_key" ON "teams"("join_code");

-- CreateIndex
CREATE INDEX "teams_join_code_idx" ON "teams"("join_code");

-- CreateIndex
CREATE UNIQUE INDEX "members_roll_number_key" ON "members"("roll_number");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
