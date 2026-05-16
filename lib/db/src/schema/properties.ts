import {
  pgTable, serial, text, integer, boolean,
  timestamp, doublePrecision, jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const propertiesTable = pgTable("properties", {
  id:            serial("id").primaryKey(),
  title:         text("title").notNull(),
  location:      text("location"),
  address:       text("address"),
  area:          text("area"),
  price:         integer("price").notNull().default(0),
  priceLabel:    text("price_label"),
  listingType:   text("listing_type").notNull().default("للبيع"),
  category:      text("category").notNull().default("شقة"),
  beds:          integer("beds").default(0),
  baths:         integer("baths").default(0),
  size:          integer("size").default(0),
  badge:         text("badge").default(""),
  featured:      boolean("featured").default(false),
  views:         integer("views").default(0),
  ownerOnline:   boolean("owner_online").default(false),
  agentName:     text("agent_name"),
  agentInitials: text("agent_initials"),
  agentPhone:    text("agent_phone"),
  agentWhatsapp: text("agent_whatsapp"),
  agentColor:    text("agent_color"),
  image:         text("image"),
  images:        jsonb("images").$type<string[]>().default([]),
  description:   text("description"),
  amenities:     jsonb("amenities").$type<string[]>().default([]),
  floor:         integer("floor"),
  totalFloors:   integer("total_floors"),
  yearBuilt:     integer("year_built").default(0),
  lat:           doublePrecision("lat"),
  lng:           doublePrecision("lng"),
  verified:      boolean("verified").default(false),
  status:        text("status").default("active"),
  isDemo:        boolean("is_demo").default(false),
  createdAt:     timestamp("created_at").defaultNow(),
  updatedAt:     timestamp("updated_at").defaultNow(),
  deletedAt:     timestamp("deleted_at"),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({
  id: true, createdAt: true, updatedAt: true, deletedAt: true,
});

export const selectPropertySchema = createSelectSchema(propertiesTable);

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
