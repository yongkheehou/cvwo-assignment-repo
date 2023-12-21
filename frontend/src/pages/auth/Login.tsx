// import { LockOutlined } from '@mui/icons-material';
// import {
//   Container,
//   CssBaseline,
//   Box,
//   Avatar,
//   Typography,
//   TextField,
//   Button,
//   Grid,
// } from '@mui/material';
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAppDispatch } from '../../hooks/reduxHooks';
import { login } from '../../features/auth/authSlice';
import { LOGIN } from '../../utils';
// import React from 'react';

import Base from './base';

// const Login = () => {
//   const dispatch = useAppDispatch();

//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     // This is only a basic validation of inputs. Improve this as needed.
//     if (username && password) {
//       try {
//         await dispatch(
//           login({
//             username,
//             password,
//           }),
//         ).unwrap();
//       } catch (e) {
//         console.error(e);
//       }
//     } else {
//       // Show an error message.
//     }
//   };

//   return (
//     <>
//       <Container maxWidth="xs">
//         <CssBaseline />
//         <Box
//           sx={{
//             mt: 20,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
//             <LockOutlined />
//           </Avatar>
//           <Typography variant="h5">Login</Typography>
//           <Box sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="username"
//               label="username"
//               name="username"
//               autoFocus
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />

//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="password"
//               name="password"
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//               }}
//             />

//             <Button
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               onClick={handleLogin}
//             >
//               Login
//             </Button>
//             <Grid container justifyContent={'flex-end'}>
//               <Link to="/signup">Dont have an account? Sign Up!</Link>
//             </Grid>
//           </Box>
//         </Box>
//       </Container>
//     </>
//   );
// };

// export default Login;

export default function Login() {
  return Base(login, LOGIN);
}
