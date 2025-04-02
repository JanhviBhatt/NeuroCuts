import {integer, varchar, pgTable, boolean } from "drizzle-orm/pg-core";

export const Users = pgTable('users',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull(),
    imageUrl:varchar('imageUrl'),
    subscription:boolean('subscription').default(false)
})