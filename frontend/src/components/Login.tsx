import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch } from '../hooks/reduxHooks';

export default function Login() {
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userRef.current !== null) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userData = await login({ user, pwd }).unwrap();
      dispatch(setCredentials({ ...userData, user }));
      setUser('');
      setPwd('');
      navigate('/welcome');
    } catch (error: unknown) {
      const err = error as FetchBaseQueryError;
      if ('originalStatus' in err) {
        if (!err?.originalStatus) {
          // isLoading: true until timeout occurs
          setErrMsg('No Server Response');
        } else if (err.originalStatus === 400) {
          setErrMsg('Missing Username or Password');
        } else if (err.originalStatus === 401) {
          setErrMsg('Unauthorized');
        } else {
          setErrMsg('Login Failed');
        }
        if (errRef.current !== null) {
          errRef.current.focus();
        }
      }
    }
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target !== null) {
      setUser(e.target.value);
    }
  };

  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target !== null) {
      setPwd(e.target.value);
    }
  };

  const content = isLoading ? (
    <h1>Loading...</h1>
  ) : (
    <section className="login">
      <p
        ref={errRef}
        className={errMsg ? 'errmsg' : 'offscreen'}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <h1>Employee Login</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          value={user}
          onChange={handleUserInput}
          autoComplete="off"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={handlePwdInput}
          value={pwd}
          required
        />
        <button>Sign In</button>
      </form>
    </section>
  );

  return content;
}
