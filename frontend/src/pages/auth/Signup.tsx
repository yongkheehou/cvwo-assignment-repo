import { signup } from '../../features/auth/authSlice';
import { SIGNUP } from '../../utils';
import Base from './base';

export default function Signup() {
  return Base(signup, SIGNUP);
}
