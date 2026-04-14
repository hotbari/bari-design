import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['admin', 'operator', 'agency']),
  email: z.string().email(),
})

export const userInviteSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  name: z.string().min(1, '이름을 입력하세요'),
  role: z.enum(['admin', 'operator', 'agency']),
})

export type User = z.infer<typeof userSchema>
export type UserInvite = z.infer<typeof userInviteSchema>
