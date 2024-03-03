import { signup } from '../../features/auth/authSlice';
import { SIGNUP } from '../../utils/constants';
import Base from './Base';

export default function Signup() {
  return Base(signup, SIGNUP);
}
