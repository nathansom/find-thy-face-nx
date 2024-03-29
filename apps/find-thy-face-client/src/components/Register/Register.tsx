import { ChangeEventHandler, MouseEvent, useState } from 'react';
import { toast } from 'react-toastify';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Register = (props: any) => {
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [name, setName] = useState('');

  const onNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setName(event.target.value);
  };

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitRegistration: React.MouseEventHandler<
    HTMLInputElement
  > = async (e: MouseEvent<HTMLInputElement>) => {
    e.preventDefault();

    toast.promise(
      (async () => {
        try {
          const response = await fetch(
              process.env.REACT_APP_BACKEND_URL + '/register',
              {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email,
                  password,
                  name,
                }),
              }
            ),
            user = await response.json();

          if (response.status > 299) toast.error(user);

          if ('id' in user && user.id) {
            props.loadUser(user);
            props.onRouteChange('home');
          }
        } catch (error: unknown) {
          if (e instanceof Error) throw new Error(e.message);
        }
      })(),
      {
        pending: 'Registering new account ...',
        success: "You're registered successfully!",
        error: 'Registration failed.',
      }
    );
  };

  return (
    <div className="flex justify-center items-center">
      <main className="p-4 rounded w-full md:w-3/6 lg:w-1/4 shadow-lg backdrop-blur-sm">
        <div className="measure">
          <fieldset id="register" className="bg-transparent py-0 my-0">
            <legend className="py-0 my-0 text-white text-2xl">Register</legend>
            <div className="mt-3">
              <label className="text-white" htmlFor="email-address">
                Name
              </label>
              <input
                onChange={onNameChange}
                className="form-input"
                type="name"
                name="name"
                id="name"
              />
            </div>
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
          <div className="">
            <input
              onClick={onSubmitRegistration}
              className="btn-primary"
              type="submit"
              value="Register"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
