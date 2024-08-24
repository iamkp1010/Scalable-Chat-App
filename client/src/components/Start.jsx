import React, { useEffect } from 'react';
import { validUser } from '../apis/authService';
import { useNavigate } from 'react-router-dom';
function Start() {
  const pageRoute = useNavigate();
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (!data?.error) {
        pageRoute('/chats');
      } else {
        pageRoute('/login');
      }
    };
    isValid();
  }, [pageRoute]);

  return (
    <div className="bg-[#fff] flex items-center justify-center w-full h-screen flex-col gap-y-4 md:gap-y-6">
      <lottie-player
        src="https://lottie.host/af48e5b2-d0c5-4ec6-8cad-ba81daed4b76/AnD67HnsSm.json"
        background="transparent"
        speed="1"
        style={{ width: '200px', height: '200px' }}
        loop
        autoplay
      ></lottie-player>
      <h3 className="font-semibold text-sm text-gray-600 text-center">
        Please wait. It might take some time.
      </h3>
    </div>
  );
}

export default Start;
