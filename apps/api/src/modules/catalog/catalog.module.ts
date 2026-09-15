import { Module } from "@nestjs/common";
import { CatalogController } from "./catalog.controller.js";

/** Servissiz modul: ma'lumot o'zgarmas va `@amb/core-rules` dan keladi. */
@Module({ controllers: [CatalogController] })
export class CatalogModule {}
