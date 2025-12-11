import { z } from 'zod'

export const EventSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  date: z.string().optional(),
  time: z.string().optional(),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  info: z.any().optional(),
  attendees: z.array(z.string()),
  externalInvites: z.array(z.string()),
  family: z.string().optional(),
})

export type EventSchemaType = z.infer<typeof EventSchema>

export const EventDetailsSchema = EventSchema.pick({
  name: true,
  date: true,
  time: true,
  endDate: true,
  endTime: true,
  location: true,
  info: true,
  family: true,
})

export type EventDetailsSchemaType = z.infer<typeof EventDetailsSchema>

export const EventAttendeesSchema = EventSchema.pick({
  attendees: true,
  externalInvites: true,
  family: true,
}).extend({
  newInvites: z.array(
    z.object({
      email: z.string(),
      userId: z.string(),
    }),
  ),
  newExternalInvites: z.array(z.string()),
})

export type EventAttendeesSchemaType = z.infer<typeof EventAttendeesSchema>
