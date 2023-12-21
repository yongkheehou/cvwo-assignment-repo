import { signup } from '../../features/auth/AuthSlice';
import { SIGNUP } from '../../utils/Constants';
import Base from './Base';

export default function Signup() {
  return Base(signup, SIGNUP);
}
