-- CreateTable
CREATE TABLE "public"."detalle_dieta" (
    "id_detalle_dieta" SERIAL NOT NULL,
    "id_dieta" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad_recomendada" DECIMAL(8,2),
    "frecuencia" VARCHAR(20),
    "momento_dia" VARCHAR(20),

    CONSTRAINT "detalle_dieta_pkey" PRIMARY KEY ("id_detalle_dieta")
);

-- CreateTable
CREATE TABLE "public"."detalle_pedido" (
    "id_detalle_pedido" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_pedido_pkey" PRIMARY KEY ("id_detalle_pedido")
);

-- CreateTable
CREATE TABLE "public"."dieta" (
    "id_dieta" SERIAL NOT NULL,
    "id_mascota" INTEGER NOT NULL,
    "fecha_creacion" DATE DEFAULT CURRENT_DATE,
    "estado" VARCHAR(20),
    "calorias_totales" DECIMAL(8,2),
    "proteina_total" DECIMAL(8,2),
    "grasa_total" DECIMAL(8,2),
    "fibra_total" DECIMAL(8,2),
    "tiempo_ejercicio_recomendado" INTEGER,
    "tipo_ejercicio_recomendado" TEXT,
    "comentario" TEXT,

    CONSTRAINT "dieta_pkey" PRIMARY KEY ("id_dieta")
);

-- CreateTable
CREATE TABLE "public"."direccion" (
    "id_direccion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "calle" VARCHAR(255) NOT NULL,
    "numero_exterior" VARCHAR(10),
    "numero_interior" VARCHAR(10),
    "colonia" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(10) NOT NULL,
    "estado" VARCHAR(100) NOT NULL,

    CONSTRAINT "direccion_pkey" PRIMARY KEY ("id_direccion")
);

-- CreateTable
CREATE TABLE "public"."especie" (
    "id_especie" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "especie_pkey" PRIMARY KEY ("id_especie")
);

-- CreateTable
CREATE TABLE "public"."habitos_alimenticios" (
    "id_habito" SERIAL NOT NULL,
    "id_mascota" INTEGER NOT NULL,
    "alimento_principal" TEXT,
    "cantidad_diaria" DECIMAL(8,2),
    "recibe_sobras" BOOLEAN DEFAULT false,
    "tipo_sobras" TEXT,
    "cantidad_sobras" DECIMAL(8,2),
    "recibe_premios" BOOLEAN DEFAULT false,
    "tipo_premios" TEXT,
    "cantidad_premios" DECIMAL(8,2),

    CONSTRAINT "habitos_alimenticios_pkey" PRIMARY KEY ("id_habito")
);

-- CreateTable
CREATE TABLE "public"."historial_operacion" (
    "id_operacion" SERIAL NOT NULL,
    "id_mascota" INTEGER NOT NULL,
    "tipo_operacion" TEXT,
    "fecha_operacion" DATE,

    CONSTRAINT "historial_operacion_pkey" PRIMARY KEY ("id_operacion")
);

-- CreateTable
CREATE TABLE "public"."historial_salud" (
    "id_historial" SERIAL NOT NULL,
    "id_mascota" INTEGER NOT NULL,
    "enfermedades" TEXT,
    "medicamentos" TEXT,
    "alergias_alimento" TEXT,
    "sintomas_alergia" TEXT,

    CONSTRAINT "historial_salud_pkey" PRIMARY KEY ("id_historial")
);

-- CreateTable
CREATE TABLE "public"."mascota" (
    "id_mascota" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_raza" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "sexo" VARCHAR(10),
    "fecha_nacimiento" DATE,
    "peso_inicial" DECIMAL(5,2),
    "altura" DECIMAL(5,2),
    "tamaño" VARCHAR(20),
    "esterilizado" BOOLEAN DEFAULT false,
    "actividad" VARCHAR(50),
    "fecha_registro" DATE DEFAULT CURRENT_DATE,

    CONSTRAINT "mascota_pkey" PRIMARY KEY ("id_mascota")
);

-- CreateTable
CREATE TABLE "public"."pedido" (
    "id_pedido" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_pedido" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(20),
    "id_direccion_entrega" INTEGER NOT NULL,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "public"."producto" (
    "id_producto" SERIAL NOT NULL,
    "codigo_sku" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "marca" VARCHAR(100),
    "id_especie" INTEGER NOT NULL,
    "edad_recomendada" VARCHAR(100),
    "tamaño" VARCHAR(50),
    "tipo_alimento" VARCHAR(100),
    "sabor_principal" VARCHAR(100),
    "condiciones_especiales" TEXT,
    "caracteristicas_especiales" TEXT,
    "proteina" DECIMAL(5,2),
    "grasa" DECIMAL(5,2),
    "fibra" DECIMAL(5,2),
    "humedad" DECIMAL(5,2),
    "calorias_por_kg" DECIMAL(8,2),
    "peso_empaque_kg" DECIMAL(8,2),
    "tipo_empaque" VARCHAR(100),
    "precio" DECIMAL(10,2) NOT NULL,
    "cantidad_disponible" INTEGER DEFAULT 0,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "public"."raza" (
    "id_raza" SERIAL NOT NULL,
    "id_especie" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "raza_pkey" PRIMARY KEY ("id_raza")
);

-- CreateTable
CREATE TABLE "public"."registro_alimentacion" (
    "id_alimentacion" SERIAL NOT NULL,
    "id_registro" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad_consumida" DECIMAL(8,2),
    "hora_alimentacion" VARCHAR(20),

    CONSTRAINT "registro_alimentacion_pkey" PRIMARY KEY ("id_alimentacion")
);

-- CreateTable
CREATE TABLE "public"."registro_dieta" (
    "id_registro" SERIAL NOT NULL,
    "id_mascota" INTEGER NOT NULL,
    "fecha" DATE DEFAULT CURRENT_DATE,
    "peso" DECIMAL(5,2),
    "tiempo_ejercicio" INTEGER,
    "tipo_ejercicio" TEXT,
    "observaciones" TEXT,
    "estado_animo" VARCHAR(50),

    CONSTRAINT "registro_dieta_pkey" PRIMARY KEY ("id_registro")
);

-- CreateTable
CREATE TABLE "public"."usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "primer_apellido" VARCHAR(100) NOT NULL,
    "segundo_apellido" VARCHAR(100),
    "correo" VARCHAR(255) NOT NULL,
    "contraseña_hash" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "fecha_registro" DATE DEFAULT CURRENT_DATE,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "producto_codigo_sku_key" ON "public"."producto"("codigo_sku");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "public"."usuario"("correo");

-- AddForeignKey
ALTER TABLE "public"."detalle_dieta" ADD CONSTRAINT "detalle_dieta_id_dieta_fkey" FOREIGN KEY ("id_dieta") REFERENCES "public"."dieta"("id_dieta") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."detalle_dieta" ADD CONSTRAINT "detalle_dieta_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "public"."producto"("id_producto") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."detalle_pedido" ADD CONSTRAINT "detalle_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "public"."pedido"("id_pedido") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."detalle_pedido" ADD CONSTRAINT "detalle_pedido_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "public"."producto"("id_producto") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."dieta" ADD CONSTRAINT "dieta_id_mascota_fkey" FOREIGN KEY ("id_mascota") REFERENCES "public"."mascota"("id_mascota") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."direccion" ADD CONSTRAINT "direccion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."habitos_alimenticios" ADD CONSTRAINT "habitos_alimenticios_id_mascota_fkey" FOREIGN KEY ("id_mascota") REFERENCES "public"."mascota"("id_mascota") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."historial_operacion" ADD CONSTRAINT "historial_operacion_id_mascota_fkey" FOREIGN KEY ("id_mascota") REFERENCES "public"."mascota"("id_mascota") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."historial_salud" ADD CONSTRAINT "historial_salud_id_mascota_fkey" FOREIGN KEY ("id_mascota") REFERENCES "public"."mascota"("id_mascota") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mascota" ADD CONSTRAINT "mascota_id_raza_fkey" FOREIGN KEY ("id_raza") REFERENCES "public"."raza"("id_raza") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."mascota" ADD CONSTRAINT "mascota_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pedido" ADD CONSTRAINT "pedido_id_direccion_entrega_fkey" FOREIGN KEY ("id_direccion_entrega") REFERENCES "public"."direccion"("id_direccion") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pedido" ADD CONSTRAINT "pedido_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."producto" ADD CONSTRAINT "producto_id_especie_fkey" FOREIGN KEY ("id_especie") REFERENCES "public"."especie"("id_especie") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."raza" ADD CONSTRAINT "raza_id_especie_fkey" FOREIGN KEY ("id_especie") REFERENCES "public"."especie"("id_especie") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."registro_alimentacion" ADD CONSTRAINT "registro_alimentacion_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "public"."producto"("id_producto") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."registro_alimentacion" ADD CONSTRAINT "registro_alimentacion_id_registro_fkey" FOREIGN KEY ("id_registro") REFERENCES "public"."registro_dieta"("id_registro") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."registro_dieta" ADD CONSTRAINT "registro_dieta_id_mascota_fkey" FOREIGN KEY ("id_mascota") REFERENCES "public"."mascota"("id_mascota") ON DELETE CASCADE ON UPDATE NO ACTION;
