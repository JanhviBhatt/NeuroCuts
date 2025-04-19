import {integer, varchar, pgTable,json, boolean, serial } from "drizzle-orm/pg-core";

export const Users = pgTable('users',{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull(),
    imageUrl:varchar('imageUrl'),
    subscription:boolean('subscription').default(false)
})

export const VideoData = pgTable('videoData',{
    id:serial('id').primaryKey(),
    script:json('script').notNull(),
    audioUrl:varchar('audioUrl').notNull(),
    captions:json('captions').notNull(),
    imageList:varchar('imageList').array(),
    createdBy:varchar('createdBy').notNull()
})