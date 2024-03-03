import { login } from '../../features/auth/authSlice';
import { LOGIN } from '../../utils/constants';
import Base from './Base';

export default function Login() {
  return Base(login, LOGIN);
}
