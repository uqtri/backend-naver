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

CREATE OR REPLACE FUNCTION update_end_stock()
RETURNS TRIGGER AS $$
BEGIN
    NEW.end_stock := NEW.begin_stock + NEW.buy_quantity - NEW.sell_quantity;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER 1
CREATE OR REPLACE FUNCTION validate_sales_quantity()
RETURNS TRIGGER AS $$
DECLARE
    current_report_id TEXT;
    available_stock INTEGER;
    sales_orders_created_at TIMESTAMP(3) WITH TIME ZONE;
BEGIN
    SELECT created_at INTO sales_orders_created_at
    FROM sales_orders
    WHERE sales_orders.sales_order_id = NEW.sales_order_id;

    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM sales_orders_created_at)
    AND year = EXTRACT(YEAR FROM sales_orders_created_at);

    IF current_report_id IS NULL THEN
        INSERT INTO inventory_reports (month, year)
        VALUES (EXTRACT(MONTH FROM sales_orders_created_at), EXTRACT(YEAR FROM sales_orders_created_at));
    END IF;
    
    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM sales_orders_created_at) AND year = EXTRACT(YEAR FROM sales_orders_created_at);

    SELECT end_stock INTO available_stock
    FROM inventory_report_details
    WHERE report_id = current_report_id
    AND product_id = NEW.product_id;

    IF available_stock IS NULL THEN
        SELECT end_stock INTO available_stock
        FROM inventory_report_details
        WHERE product_id = NEW.product_id
        AND report_id IN (
            SELECT report_id
            FROM inventory_reports
            WHERE (year < EXTRACT(YEAR FROM sales_orders_created_at))
            OR (year = EXTRACT(YEAR FROM sales_orders_created_at) AND month < EXTRACT(MONTH FROM sales_orders_created_at))
            ORDER BY year DESC, month DESC
            LIMIT 1
        );

        available_stock := COALESCE(available_stock, 0);

        INSERT INTO inventory_report_details (
            report_id,
            product_id,
            begin_stock,
            buy_quantity,
            sell_quantity,
            end_stock
        )
        VALUES (
            current_report_id,
            NEW.product_id,
            available_stock,
            0,
            0,
            available_stock
        );
    END IF;

    IF CAST(NEW.quantity AS INTEGER) > available_stock THEN
        RAISE EXCEPTION 'Số lượng bán (%) vượt quá số lượng tồn kho hiện có (%)', 
            NEW.quantity, available_stock;
    END IF;

    UPDATE inventory_report_details
    SET 
        sell_quantity = sell_quantity + CAST(NEW.quantity AS INTEGER),
        end_stock = begin_stock + buy_quantity - (sell_quantity + CAST(NEW.quantity AS INTEGER))
    WHERE report_id = current_report_id
    AND product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_update_end_stock
BEFORE INSERT OR UPDATE ON inventory_report_details
FOR EACH ROW
EXECUTE FUNCTION update_end_stock();

-- TRIGGER 3

CREATE OR REPLACE FUNCTION update_status_order()
RETURNS TRIGGER AS $$
DECLARE
  row_count_not_done INT;
BEGIN
  SELECT COUNT(*) FROM service_order_details
  WHERE service_order_details.service_order_id = NEW.service_order_id
  AND service_order_details.status = 'NOT_DELIVERED'
  INTO row_count_not_done;

  IF row_count_not_done = 0 THEN
    UPDATE service_orders
    SET status = 'DELIVERED'
    WHERE service_order_id = NEW.service_order_id;
  ELSE
    UPDATE service_orders
    SET status = 'NOT_DELIVERED'
    WHERE service_order_id = NEW.service_order_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_status_order_trigger
AFTER UPDATE OF status ON service_order_details
FOR EACH ROW
EXECUTE FUNCTION update_status_order();

-- TRIGGER 3
-- trigger new
CREATE OR REPLACE FUNCTION update_total_price_order()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE service_orders
    SET total_price = total_price + NEW.total_price,
    total_paid = total_paid + COALESCE(NEW.paid, 0),
    total_remaining = total_price - total_paid
    WHERE service_order_id = NEW.service_order_id;


  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE service_orders
    SET total_price = total_price + (NEW.total_price - OLD.total_price),
    total_paid = total_paid + (COALESCE(NEW.paid, 0) - COALESCE(OLD.paid, 0)),
    total_remaining = total_price - total_paid
    WHERE service_order_id = NEW.service_order_id;

  ELSIF TG_OP = 'DELETE' THEN
    UPDATE service_orders
    SET total_price = total_price - OLD.total_price,
        total_paid = total_paid - COALESCE(OLD.paid, 0),
        total_remaining = total_price - total_paid
    WHERE service_order_id = OLD.service_order_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_total_price_order_trigger
BEFORE UPDATE ON service_order_details
FOR EACH ROW
EXECUTE FUNCTION update_total_price_order();


CREATE TRIGGER trg_total_price_after_insert
AFTER INSERT ON service_order_details
FOR EACH ROW
EXECUTE FUNCTION update_total_price_order();

CREATE TRIGGER trg_total_price_after_delete
AFTER DELETE ON service_order_details
FOR EACH ROW
EXECUTE FUNCTION update_total_price_order();
-- CREATE OR REPLACE FUNCTION update_total_price_order()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   UPDATE service_orders
--   SET total_price = total_price + (NEW.total_price - OLD.total_price)
--   WHERE service_orders.service_order_id = NEW.service_order_id;

--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;    


-- TRIGGER 9
DROP TRIGGER IF EXISTS update_total_remain_trigger on service_orders;

CREATE OR REPLACE FUNCTION update_total_remain()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.total_price <> OLD.total_price OR NEW.total_paid <> OLD.total_paid THEN
    NEW.total_remaining := NEW.total_price - NEW.total_paid;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_total_remain_trigger
BEFORE INSERT OR UPDATE OF total_price, total_paid ON service_orders
FOR EACH ROW
EXECUTE FUNCTION update_total_remain();


-- TRIGGER Cập nhật purchase_quantity khi thêm purchase order mới
CREATE OR REPLACE FUNCTION update_purchase_quantity()
RETURNS TRIGGER AS $$
DECLARE
    current_report_id TEXT;
    purchases_created_at TIMESTAMP(3) WITH TIME ZONE;
    last_end_stock INTEGER;
    affected_product_id INTEGER;
    affected_quantity INTEGER;
BEGIN
    -- Xác định thời gian tạo và sản phẩm bị ảnh hưởng
    IF (TG_OP = 'INSERT') THEN
        purchases_created_at := (SELECT created_at FROM purchase_orders WHERE purchase_order_id = NEW.purchase_order_id);
        affected_product_id := NEW.product_id;
        affected_quantity := NEW.quantity;
        
    ELSIF (TG_OP = 'UPDATE') THEN
        purchases_created_at := (SELECT created_at FROM purchase_orders WHERE purchase_order_id = NEW.purchase_order_id);
        affected_product_id := NEW.product_id;
        affected_quantity := NEW.quantity - OLD.quantity; -- phần chênh lệch số lượng
        
    ELSIF (TG_OP = 'DELETE') THEN
        purchases_created_at := (SELECT created_at FROM purchase_orders WHERE purchase_order_id = OLD.purchase_order_id);
        affected_product_id := OLD.product_id;
        affected_quantity := -OLD.quantity; -- bị xóa = giảm số lượng
    END IF;

    -- Tìm hoặc tạo báo cáo tháng hiện tại
    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM purchases_created_at)
      AND year = EXTRACT(YEAR FROM purchases_created_at);

    IF current_report_id IS NULL THEN
        INSERT INTO inventory_reports (month, year)
        VALUES (EXTRACT(MONTH FROM purchases_created_at), EXTRACT(YEAR FROM purchases_created_at));
        
        SELECT report_id INTO current_report_id
        FROM inventory_reports
        WHERE month = EXTRACT(MONTH FROM purchases_created_at)
          AND year = EXTRACT(YEAR FROM purchases_created_at);
    END IF;

    -- Kiểm tra xem có dòng chi tiết tồn kho chưa
    SELECT end_stock INTO last_end_stock
    FROM inventory_report_details
    WHERE report_id = current_report_id
      AND product_id = affected_product_id;

    IF last_end_stock IS NULL THEN
        -- Tìm tồn kho cuối kỳ trước
        SELECT end_stock INTO last_end_stock
        FROM inventory_report_details
        WHERE product_id = affected_product_id
          AND report_id IN (
              SELECT report_id FROM inventory_reports
              WHERE (year < EXTRACT(YEAR FROM purchases_created_at))
                 OR (year = EXTRACT(YEAR FROM purchases_created_at) AND month < EXTRACT(MONTH FROM purchases_created_at))
              ORDER BY year DESC, month DESC
              LIMIT 1
          );

        last_end_stock := COALESCE(last_end_stock, 0);

        -- Tạo dòng chi tiết mới
        INSERT INTO inventory_report_details (
            report_id,
            product_id,
            begin_stock,
            buy_quantity,
            sell_quantity,
            end_stock
        )
        VALUES (
            current_report_id,
            affected_product_id,
            last_end_stock,
            0,
            0,
            last_end_stock
        );
    END IF;

    -- Cập nhật báo cáo chi tiết
    UPDATE inventory_report_details
    SET 
        buy_quantity = buy_quantity + CAST(affected_quantity AS INTEGER),
        end_stock = begin_stock + buy_quantity + CAST(affected_quantity AS INTEGER) - sell_quantity
    WHERE report_id = current_report_id
      AND product_id = affected_product_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_update_purchase_quantity ON purchase_order_details;

CREATE TRIGGER trg_update_purchase_quantity
AFTER INSERT OR UPDATE OR DELETE ON purchase_order_details
FOR EACH ROW
EXECUTE FUNCTION update_purchase_quantity();



-- TRIGGER Cập nhật total_price khi quantity thay đổi trong sales_order_details
CREATE OR REPLACE FUNCTION update_sales_order_total_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_price := (
        SELECT sell_price * CAST(NEW.quantity AS INTEGER)
        FROM products
        WHERE product_id = NEW.product_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_sales_order_total_price
BEFORE INSERT OR UPDATE OF quantity ON sales_order_details
FOR EACH ROW
EXECUTE FUNCTION update_sales_order_total_price();

-- TRIGGER Kiểm tra số lượng bán và cập nhật sell_quantity
CREATE OR REPLACE FUNCTION validate_sales_quantity()
RETURNS TRIGGER AS $$
DECLARE
    current_report_id TEXT;
    available_stock INTEGER;
    sales_orders_created_at TIMESTAMP(3) WITH TIME ZONE;
BEGIN
    SELECT created_at INTO sales_orders_created_at
    FROM sales_orders
    WHERE sales_orders.sales_order_id = NEW.sales_order_id;

    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM sales_orders_created_at)
    AND year = EXTRACT(YEAR FROM sales_orders_created_at);

    IF current_report_id IS NULL THEN
        INSERT INTO inventory_reports (month, year)
        VALUES (EXTRACT(MONTH FROM sales_orders_created_at), EXTRACT(YEAR FROM sales_orders_created_at));
    END IF;
    
    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM sales_orders_created_at) AND year = EXTRACT(YEAR FROM sales_orders_created_at);

    SELECT end_stock INTO available_stock
    FROM inventory_report_details
    WHERE report_id = current_report_id
    AND product_id = NEW.product_id;

    IF available_stock IS NULL THEN
        SELECT end_stock INTO available_stock
        FROM inventory_report_details
        WHERE product_id = NEW.product_id
        AND report_id IN (
            SELECT report_id
            FROM inventory_reports
            WHERE (year < EXTRACT(YEAR FROM sales_orders_created_at))
            OR (year = EXTRACT(YEAR FROM sales_orders_created_at) AND month < EXTRACT(MONTH FROM sales_orders_created_at))
            ORDER BY year DESC, month DESC
            LIMIT 1
        );

        available_stock := COALESCE(available_stock, 0);

        INSERT INTO inventory_report_details (
            report_id,
            product_id,
            begin_stock,
            buy_quantity,
            sell_quantity,
            end_stock
        )
        VALUES (
            current_report_id,
            NEW.product_id,
            available_stock,
            0,
            0,
            available_stock
        );
    END IF;

    IF NEW.quantity > available_stock THEN
        RAISE EXCEPTION 'Số lượng bán (%) vượt quá số lượng tồn kho hiện có (%)', 
            NEW.quantity, available_stock;
    END IF;

    UPDATE inventory_report_details
    SET 
        sell_quantity = sell_quantity + NEW.quantity,
        end_stock = begin_stock + buy_quantity - (sell_quantity + NEW.quantity)
    WHERE report_id = current_report_id
    AND product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_sales_quantity_on_update()
RETURNS TRIGGER AS $$
DECLARE
    current_report_id TEXT;
    available_stock INTEGER;
    sales_orders_created_at TIMESTAMP(3) WITH TIME ZONE;
BEGIN
    SELECT created_at INTO sales_orders_created_at
    FROM sales_orders
    WHERE sales_orders.sales_order_id = NEW.sales_order_id;

    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM sales_orders_created_at)
    AND year = EXTRACT(YEAR FROM sales_orders_created_at);

    IF current_report_id IS NULL THEN
        INSERT INTO inventory_reports (month, year)
        VALUES (EXTRACT(MONTH FROM sales_orders_created_at), EXTRACT(YEAR FROM sales_orders_created_at));
    END IF;
    
    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM sales_orders_created_at) AND year = EXTRACT(YEAR FROM sales_orders_created_at);

    SELECT end_stock INTO available_stock
    FROM inventory_report_details
    WHERE report_id = current_report_id
    AND product_id = NEW.product_id;

    IF available_stock IS NULL THEN
        SELECT end_stock INTO available_stock
        FROM inventory_report_details
        WHERE product_id = NEW.product_id
        AND report_id IN (
            SELECT report_id
            FROM inventory_reports
            WHERE (year < EXTRACT(YEAR FROM sales_orders_created_at))
            OR (year = EXTRACT(YEAR FROM sales_orders_created_at) AND month < EXTRACT(MONTH FROM sales_orders_created_at))
            ORDER BY year DESC, month DESC
            LIMIT 1
        );

        available_stock := COALESCE(available_stock, 0);

        INSERT INTO inventory_report_details (
            report_id,
            product_id,
            begin_stock,
            buy_quantity,
            sell_quantity,
            end_stock
        )
        VALUES (
            current_report_id,
            NEW.product_id,
            available_stock,
            0,
            0,
            available_stock
        );
    END IF;

    IF NEW.quantity - OLD.quantity > available_stock THEN
        RAISE EXCEPTION 'Số lượng bán vượt quá số lượng tồn kho hiện có';
    END IF;

    UPDATE inventory_report_details
    SET 
        sell_quantity = sell_quantity + NEW.quantity - OLD.quantity,
        end_stock = begin_stock + buy_quantity - (sell_quantity + NEW.quantity - OLD.quantity)
    WHERE report_id = current_report_id
    AND product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION validate_sales_quantity_on_delete()
RETURNS TRIGGER AS $$
DECLARE
    current_report_id TEXT;
    available_stock INTEGER;
    sales_orders_created_at TIMESTAMP(3) WITH TIME ZONE;
BEGIN
    SELECT created_at INTO sales_orders_created_at
    FROM sales_orders
    WHERE sales_orders.sales_order_id = NEW.sales_order_id;

    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM sales_orders_created_at)
    AND year = EXTRACT(YEAR FROM sales_orders_created_at);

    IF current_report_id IS NULL THEN
        INSERT INTO inventory_reports (month, year)
        VALUES (EXTRACT(MONTH FROM sales_orders_created_at), EXTRACT(YEAR FROM sales_orders_created_at));
    END IF;
    
    SELECT report_id INTO current_report_id
    FROM inventory_reports
    WHERE month = EXTRACT(MONTH FROM sales_orders_created_at) AND year = EXTRACT(YEAR FROM sales_orders_created_at);

    SELECT end_stock INTO available_stock
    FROM inventory_report_details
    WHERE report_id = current_report_id
    AND product_id = NEW.product_id;

    IF available_stock IS NULL THEN
        SELECT end_stock INTO available_stock
        FROM inventory_report_details
        WHERE product_id = NEW.product_id
        AND report_id IN (
            SELECT report_id
            FROM inventory_reports
            WHERE (year < EXTRACT(YEAR FROM sales_orders_created_at))
            OR (year = EXTRACT(YEAR FROM sales_orders_created_at) AND month < EXTRACT(MONTH FROM sales_orders_created_at))
            ORDER BY year DESC, month DESC
            LIMIT 1
        );

        available_stock := COALESCE(available_stock, 0);

        INSERT INTO inventory_report_details (
            report_id,
            product_id,
            begin_stock,
            buy_quantity,
            sell_quantity,
            end_stock
        )
        VALUES (
            current_report_id,
            NEW.product_id,
            available_stock,
            0,
            0,
            available_stock
        );
    END IF;

    UPDATE inventory_report_details
    SET 
        sell_quantity = sell_quantity - OLD.quantity,
        end_stock = begin_stock + buy_quantity - (sell_quantity - OLD.quantity)
    WHERE report_id = current_report_id
    AND product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER validate_sales_quantity
BEFORE INSERT ON sales_order_details
FOR EACH ROW
EXECUTE FUNCTION validate_sales_quantity();

CREATE TRIGGER validate_sales_quantity_on_update
BEFORE UPDATE ON sales_order_details
FOR EACH ROW
EXECUTE FUNCTION validate_sales_quantity_on_update();

CREATE TRIGGER validate_sales_quantity_on_delete
BEFORE DELETE ON sales_order_details
FOR EACH ROW
EXECUTE FUNCTION validate_sales_quantity_on_delete();

-- Trigger function cập nhật total_price khi quantity thay đổi
CREATE OR REPLACE FUNCTION update_purchase_order_total_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_price := COALESCE((
        SELECT buy_price * COALESCE(NEW.quantity, 0)
        FROM products
        WHERE product_id = NEW.product_id
        LIMIT 1
    ), 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger gắn với bảng purchase_order_details
CREATE TRIGGER trg_update_purchase_order_total_price
BEFORE INSERT OR UPDATE OF quantity ON purchase_order_details
FOR EACH ROW
EXECUTE FUNCTION update_purchase_order_total_price();

-- - TRIGGER Cập nhập sell_price = buy_price + buy_price * profit_rate
CREATE OR REPLACE FUNCTION update_sell_price()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET sell_price = buy_price + (buy_price * NEW.profit_rate)
    WHERE products.type = NEW.name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_sell_price 
BEFORE UPDATE OF profit_rate on product_types
FOR EACH ROW
EXECUTE FUNCTION update_sell_price();

--- TRIGGER Cập nhập lại extra_cost và quantity
CREATE OR REPLACE FUNCTION update_extra_cost_and_quantity()
RETURNS TRIGGER AS $$
DECLARE
    base_price numeric;
    new_calculated_price numeric;
    new_total_price numeric;
BEGIN
    SELECT s.base_price INTO base_price
    FROM services s
    WHERE s.service_id = NEW.service_id;

    IF base_price IS NULL THEN
        RAISE EXCEPTION 'Không tìm thấy dịch vụ tương ứng.';
    END IF;

    -- Tính giá mới
    new_calculated_price := NEW.extra_cost + base_price;
    new_total_price := new_calculated_price * NEW.quantity;

    -- Kiểm tra điều kiện thanh toán tối thiểu 50%
    IF NEW.paid < new_total_price * 0.5 THEN
        RAISE EXCEPTION 'Lỗi cập nhập: Chưa thanh toán đủ 50%% để cập nhật extra_cost và quantity';
    END IF;

    -- Gán giá trị vào NEW
    NEW.calculated_price := new_calculated_price;
    NEW.total_price := new_total_price;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_extra_cost
BEFORE UPDATE OR INSERT on service_order_details
FOR EACH ROW
EXECUTE FUNCTION update_extra_cost_and_quantity();

-------
-- TRIGGER TÍNH TOTAL PRICE| CALCULATED PRICE| khi insert service_order_details
CREATE OR REPLACE FUNCTION calculate_total_price_and_calculated_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.calculated_price := (
        SELECT base_price
        FROM services
        WHERE services.service_id = NEW.service_id
    ) + NEW.extra_cost;
    NEW.total_price := NEW.calculated_price * NEW.quantity;
    NEW.remaining := NEW.total_price - COALESCE(NEW.paid, 0);

    RETURN NEW;
END;  
$$ LANGUAGE plpgsql;

-- Trigger để gọi function trên trước khi INSERT
CREATE TRIGGER trg_calculate_total_price
BEFORE INSERT OR UPDATE ON service_order_details
FOR EACH ROW
EXECUTE FUNCTION calculate_total_price_and_calculated_price();
