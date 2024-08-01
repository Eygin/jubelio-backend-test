/*
 Navicat Premium Data Transfer

 Source Server         : Anjab Local
 Source Server Type    : PostgreSQL
 Source Server Version : 140009 (140009)
 Source Host           : localhost:5432
 Source Catalog        : jubelio_testing
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140009 (140009)
 File Encoding         : 65001

 Date: 01/08/2024 14:46:43
*/


-- ----------------------------
-- Sequence structure for adjustment_transactions_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."adjustment_transactions_id_seq";
CREATE SEQUENCE "public"."adjustment_transactions_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for knex_migrations_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."knex_migrations_id_seq";
CREATE SEQUENCE "public"."knex_migrations_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for knex_migrations_lock_index_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."knex_migrations_lock_index_seq";
CREATE SEQUENCE "public"."knex_migrations_lock_index_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for products_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."products_id_seq";
CREATE SEQUENCE "public"."products_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for adjustment_transactions
-- ----------------------------
DROP TABLE IF EXISTS "public"."adjustment_transactions";
CREATE TABLE "public"."adjustment_transactions" (
  "id" int4 NOT NULL DEFAULT nextval('adjustment_transactions_id_seq'::regclass),
  "product_id" int4 NOT NULL,
  "qty" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Table structure for knex_migrations
-- ----------------------------
DROP TABLE IF EXISTS "public"."knex_migrations";
CREATE TABLE "public"."knex_migrations" (
  "id" int4 NOT NULL DEFAULT nextval('knex_migrations_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "batch" int4,
  "migration_time" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for knex_migrations_lock
-- ----------------------------
DROP TABLE IF EXISTS "public"."knex_migrations_lock";
CREATE TABLE "public"."knex_migrations_lock" (
  "index" int4 NOT NULL DEFAULT nextval('knex_migrations_lock_index_seq'::regclass),
  "is_locked" int4
)
;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS "public"."products";
CREATE TABLE "public"."products" (
  "id" int4 NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  "title" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "sku" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "image" varchar COLLATE "pg_catalog"."default",
  "price" numeric(10,2) NOT NULL,
  "stock" numeric NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."adjustment_transactions_id_seq"
OWNED BY "public"."adjustment_transactions"."id";
SELECT setval('"public"."adjustment_transactions_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."knex_migrations_id_seq"
OWNED BY "public"."knex_migrations"."id";
SELECT setval('"public"."knex_migrations_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."knex_migrations_lock_index_seq"
OWNED BY "public"."knex_migrations_lock"."index";
SELECT setval('"public"."knex_migrations_lock_index_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."products_id_seq"
OWNED BY "public"."products"."id";
SELECT setval('"public"."products_id_seq"', 34, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 11, true);

-- ----------------------------
-- Primary Key structure for table adjustment_transactions
-- ----------------------------
ALTER TABLE "public"."adjustment_transactions" ADD CONSTRAINT "adjustment_transactions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table knex_migrations
-- ----------------------------
ALTER TABLE "public"."knex_migrations" ADD CONSTRAINT "knex_migrations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table knex_migrations_lock
-- ----------------------------
ALTER TABLE "public"."knex_migrations_lock" ADD CONSTRAINT "knex_migrations_lock_pkey" PRIMARY KEY ("index");

-- ----------------------------
-- Uniques structure for table products
-- ----------------------------
ALTER TABLE "public"."products" ADD CONSTRAINT "products_sku_key" UNIQUE ("sku");

-- ----------------------------
-- Primary Key structure for table products
-- ----------------------------
ALTER TABLE "public"."products" ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table adjustment_transactions
-- ----------------------------
ALTER TABLE "public"."adjustment_transactions" ADD CONSTRAINT "fk_product" FOREIGN KEY ("product_id") REFERENCES "public"."products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
