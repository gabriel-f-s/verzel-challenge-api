-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ORGANIZADOR', 'CLIENTE', 'PORTARIA');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SEATED', 'GENERAL');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('RESERVED', 'PAID', 'VALIDATED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExternalSource" AS ENUM ('TMDB', 'TICKETMASTER', 'CUSTOM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "external_api_id" TEXT,
    "external_source" "ExternalSource" NOT NULL DEFAULT 'CUSTOM',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "EventType" NOT NULL DEFAULT 'SEATED',
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "seat_number" TEXT,
    "qr_code_signature" TEXT NOT NULL,
    "share_token" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'RESERVED',
    "reserved_until" TIMESTAMP(3),
    "validated_at" TIMESTAMP(3),
    "validated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "events_organizer_id_idx" ON "events"("organizer_id");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_qr_code_signature_key" ON "tickets"("qr_code_signature");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_share_token_key" ON "tickets"("share_token");

-- CreateIndex
CREATE INDEX "tickets_event_id_status_idx" ON "tickets"("event_id", "status");

-- CreateIndex
CREATE INDEX "tickets_client_id_idx" ON "tickets"("client_id");

-- CreateIndex
CREATE INDEX "tickets_share_token_idx" ON "tickets"("share_token");

-- CreateIndex
CREATE INDEX "tickets_qr_code_signature_idx" ON "tickets"("qr_code_signature");
