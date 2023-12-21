import { login } from '../../features/auth/AuthSlice';
import { LOGIN } from '../../utils/Constants';
import Base from './Base';

export default function Login() {
  return Base(login, LOGIN);
}
