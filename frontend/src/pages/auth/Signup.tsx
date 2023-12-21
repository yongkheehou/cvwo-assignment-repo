// import {
//   Avatar,
//   Box,
//   Button,
//   Container,
//   CssBaseline,
//   Grid,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { LockOutlined } from '@mui/icons-material';
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAppDispatch } from '../../hooks/reduxHooks';
import { signup } from '../../features/auth/authSlice';
import { SIGNUP } from '../../utils';
import Base from './base';
// import React from 'react';

// const Signup = () => {
//   const dispatch = useAppDispatch();

//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignup = async () => {
//     // This is only a basic validation of inputs. Improve this as needed.
//     if (username && password) {
//       try {
//         await dispatch(
//           signup({
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
//           <Typography variant="h5">Sign Up!</Typography>
//           <Box sx={{ mt: 1 }}>
//             <TextField
//               required
//               fullWidth
//               id="username"
//               label="username Address"
//               name="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <TextField
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <Button
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               onClick={handleSignup}
//             >
//               Sign Up!
//             </Button>
//             <Grid container justifyContent="flex-end">
//               <Link to="/login">Already have an account? Login</Link>
//             </Grid>
//           </Box>
//         </Box>
//       </Container>
//     </>
//   );
// };

// export default Signup;

export default function Signup() {
  return Base(signup, SIGNUP);
}
