import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { googleAuth } from '../apis/authService';

export const GoogleButton = () => {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (code) => {
    try {
      const data = await googleAuth(code);
      if (!data?.error) {
        navigate('/chats');
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    flow: 'auth-code',
  });

  return (
    <button
      onClick={() => googleLogin()}
      className="w-full flex items-center justify-center py-3 px-4 border border-black rounded-lg bg-white text-black font-semibold tracking-wide mt-4"
    >
      <FcGoogle className="text-2xl mr-2" />
      <span>Continue with Google</span>
    </button>
  );
};
