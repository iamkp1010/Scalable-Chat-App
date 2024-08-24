import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsEmojiLaughing, BsEmojiExpressionless } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { registerUser, validUser } from '../apis/authService';
import { GoogleButton } from '../components/GoogleButton';

const defaultData = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};

function Register() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.email.includes('@') && formData.password.length > 6) {
      const { data } = await registerUser(formData);
      if (data?.error) {
        setIsLoading(false);
        toast.error('Invalid Credentials!');
      } else {
        toast.success('Successfully Registered!');
        setIsLoading(false);
        pageRoute('/chats');
      }
    } else {
      setIsLoading(false);
      toast.warning('Provide valid Credentials!');
      setFormData({ ...formData, password: '' });
    }
  };

  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (data?.user) {
        window.location.href = '/chats';
      }
    };
    isValid();
  }, []);

  return (
    <div className="bg-[#f9f9f9] w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="w-[95%] sm:w-[500px] p-10 bg-white rounded shadow-md text-center">
        <h1 className="text-[40px] font-bold text-[#333]">Register</h1>
        <p className="text-[16px] text-[#555] mt-2">
          Create an account to get started!
        </p>
        <form className="flex flex-col gap-y-3 mt-6" onSubmit={handleOnSubmit}>
          <div className="flex flex-col gap-y-3">
            <input
              className="w-[100%] bg-[#f1f1f1] h-[50px] pl-3 rounded border border-[#ccc]"
              onChange={handleOnChange}
              name="firstname"
              type="text"
              placeholder="First Name"
              value={formData.firstname}
              required
            />
            <input
              className="w-[100%] bg-[#f1f1f1] h-[50px] pl-3 rounded border border-[#ccc]"
              onChange={handleOnChange}
              name="lastname"
              type="text"
              placeholder="Last Name"
              value={formData.lastname}
              required
            />
            <input
              className="w-[100%] bg-[#f1f1f1] h-[50px] pl-3 rounded border border-[#ccc]"
              onChange={handleOnChange}
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              required
            />
            <div className="relative">
              <input
                className="w-[100%] bg-[#f1f1f1] h-[50px] pl-3 rounded border border-[#ccc]"
                onChange={handleOnChange}
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                required
              />
              <button
                type="button"
                className="absolute top-3 right-5"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <BsEmojiExpressionless className="text-[#333] w-[25px] h-[25px]" />
                ) : (
                  <BsEmojiLaughing className="text-[#333] w-[25px] h-[25px]" />
                )}
              </button>
            </div>
          </div>
          <button
            style={{ backgroundColor: 'black' }}
            className="w-[100%] h-[50px] font-bold text-white tracking-wide text-[17px] rounded mt-4 relative flex items-center justify-center"
            type="submit"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                  background="transparent"
                  speed="1"
                  style={{
                    width: '200px',
                    height: '160px',
                    filter: 'invert(1) brightness(100)',
                  }}
                  loop
                  autoplay
                ></lottie-player>
              </div>
            )}
            <p style={{ display: isLoading ? 'none' : 'block' }}>REGISTER</p>
          </button>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <GoogleButton />
          <p className="text-[16px] text-[#555] mt-2">
            Already have an account?{' '}
            <Link className="text-[rgba(0,195,154,1)] no-underline" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
