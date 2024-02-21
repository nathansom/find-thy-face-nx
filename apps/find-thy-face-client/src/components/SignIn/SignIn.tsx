import {
  ChangeEventHandler,
  MouseEvent,
  MouseEventHandler,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { AllowedRoute, IUser } from '../../app/App';

export const SignIn = ({
  onRouteChange,
  loadUser,
}: {
  onRouteChange: (route: AllowedRoute) => void;
  loadUser: (data: IUser) => void;
}) => {
  const [signInEmail, setSignInEmail] = useState(''),
    [signInPassword, setSignInPassword] = useState('');

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSignInEmail(event.target.value);
  };

  const onPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSignInPassword(event.target.value);
  };

  const onSubmitSignIn: MouseEventHandler<HTMLInputElement> = async (
    e: MouseEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    toast.promise(
      (async () => {
        try {
          const response = await fetch(
              process.env.REACT_APP_BACKEND_URL + '/signin',
              {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: signInEmail,
                  password: signInPassword,
                }),
              }
            ),
            user = await response.json();

          if (response.status > 299) toast.error(user);

          if (user && 'id' in user && user.id) {
            loadUser(user);
            onRouteChange('home');
          }
        } catch (e: unknown) {
          if (e instanceof Error) throw new Error(e.message);
        }
      })(),
      {
        pending: 'Signing you in ...',
        success: 'Logged in successfully!',
        error: 'Failed to login.',
      }
    );
  };

  return (
    <div className="flex justify-center items-center">
      <main className="p-4 rounded w-full md:w-3/6 lg:w-1/4 shadow-lg backdrop-blur-sm">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <form onSubmit={onSubmitSignIn}>
          <fieldset id="sign_up" className="bg-transparent py-0 my-0">
            <legend className="py-0 my-0 text-white text-2xl">Sign In</legend>
            <div className="mt-3">
              <label className="text-white" htmlFor="email-address">
                Email
              </label>
              <input
                onChange={onEmailChange}
                className="form-input"
                type="email"
                name="email-address"
                id="email-address"
              />
            </div>
            <div className="my-3">
              <label className="text-white" htmlFor="password">
                Password
              </label>
              <input
                onChange={onPasswordChange}
                className="form-input"
                type="password"
                name="password"
                id="password"
              />
            </div>
          </fieldset>
          <div>
            <input
              onClick={onSubmitSignIn}
              className="btn-primary"
              type="submit"
              value="Sign in"
            />
          </div>
        </form>
        <button
          onClick={() => onRouteChange('register')}
          className="mt-3 btn-primary"
        >
          Register
        </button>
      </main>
    </div>
  );
};

export default SignIn;
