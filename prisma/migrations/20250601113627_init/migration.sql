-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_DELIVERED', 'DELIVERED');

-- CreateTable
CREATE TABLE "suppliers" (
    "supplier_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "type_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profit_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "units" (
    "unit_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("unit_id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buy_price" DECIMAL(65,30) NOT NULL,
    "sell_price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "supplier_id" TEXT,
    "type" TEXT,
    "unit" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "services" (
    "service_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "base_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "inventory_reports" (
    "report_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "inventory_reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "inventory_report_details" (
    "report_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "begin_stock" INTEGER NOT NULL,
    "buy_quantity" INTEGER NOT NULL DEFAULT 0,
    "sell_quantity" INTEGER NOT NULL DEFAULT 0,
    "end_stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "inventory_report_details_pkey" PRIMARY KEY ("report_id","product_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "google_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "fullname" TEXT,
    "profile_pic" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "reset_password_token" TEXT,
    "reset_password_token_expires_at" TIMESTAMP(3),
    "verification_token" TEXT,
    "verification_token_expires_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "purchase_order_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier_id" TEXT NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("purchase_order_id")
);

-- CreateTable
CREATE TABLE "purchase_order_details" (
    "purchase_order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "purchase_order_details_pkey" PRIMARY KEY ("purchase_order_id","product_id")
);

-- CreateTable
CREATE TABLE "sales_orders" (
    "sales_order_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "sales_orders_pkey" PRIMARY KEY ("sales_order_id")
);

-- CreateTable
CREATE TABLE "sales_order_details" (
    "sales_order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "sales_order_details_pkey" PRIMARY KEY ("sales_order_id","product_id")
);

-- CreateTable
CREATE TABLE "service_orders" (
    "service_order_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_paid" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_remaining" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'NOT_DELIVERED',

    CONSTRAINT "service_orders_pkey" PRIMARY KEY ("service_order_id")
);

-- CreateTable
CREATE TABLE "service_order_details" (
    "service_order_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "extra_cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "calculated_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "paid" DECIMAL(65,30) NOT NULL,
    "remaining" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'NOT_DELIVERED',

    CONSTRAINT "service_order_details_pkey" PRIMARY KEY ("service_order_id","service_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_types_name_key" ON "product_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_password_token_key" ON "users"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_token_key" ON "users"("verification_token");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_type_fkey" FOREIGN KEY ("type") REFERENCES "product_types"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_unit_fkey" FOREIGN KEY ("unit") REFERENCES "units"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_report_details" ADD CONSTRAINT "inventory_report_details_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "inventory_reports"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_report_details" ADD CONSTRAINT "inventory_report_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_details" ADD CONSTRAINT "purchase_order_details_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("purchase_order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_details" ADD CONSTRAINT "purchase_order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_details" ADD CONSTRAINT "sales_order_details_sales_order_id_fkey" FOREIGN KEY ("sales_order_id") REFERENCES "sales_orders"("sales_order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_order_details" ADD CONSTRAINT "sales_order_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_details" ADD CONSTRAINT "service_order_details_service_order_id_fkey" FOREIGN KEY ("service_order_id") REFERENCES "service_orders"("service_order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_order_details" ADD CONSTRAINT "service_order_details_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;


