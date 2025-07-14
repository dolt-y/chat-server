import { User } from '../entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'> & { id: number };
    }
  }
}
