import { login } from '../../features/auth/authSlice';
import { LOGIN } from '../../utils';
import Base from './base';

export default function Login() {
  return Base(login, LOGIN);
}
