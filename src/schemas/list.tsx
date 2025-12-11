import { z } from 'zod'

export const ListSchema = z.object({
  name: z.string().min(1),
  description: z.any().optional(),
  visibleToFamilies: z.array(z.string()),
  visibleToUsers: z.array(z.string()),
  // visibleToEvents: z.array(z.object({ relationTo: z.enum(['event']), value: z.string() })),
  categories: z.array(z.string()),
  // visibilityType: z.enum(['private', 'public', 'specific']).default('private'),
  // visibibleViaLink: z.boolean().default(false),
  public: z.boolean(),
  shareLink: z.string().nullable(),
  visibilityType: z.enum(['private', 'public', 'specific']),
  visibibleViaLink: z.boolean(),
})

export type ListSchemaType = z.infer<typeof ListSchema>
