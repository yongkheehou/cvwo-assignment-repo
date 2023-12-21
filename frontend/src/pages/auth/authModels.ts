import { object, string } from 'zod';

const authSchema = object({
  username: string()
    .min(6)
    .max(30),
  password: string()
    .min(6)
    .max(30)
})

export default authSchema
