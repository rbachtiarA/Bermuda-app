'use client';
import { createToken } from '@/lib/server';
import { loginUser } from '@/lib/user.handler';
import { useAppDispatch } from '@/redux/hook';
import { updatedCartFromDatabase } from '@/redux/slice/cartSlice';
import { loginAction } from '@/redux/slice/userSlice';
import { ILoginData } from '@/type/user';
import { Formik, Form, Field, FormikProps, FormikHelpers } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Format email salah').required('Email harus diisi'),
  password: Yup.string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password harus diisi'),
});
const LoginForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [loginError, setLoginError] = useState<string | null>(null);
  const initialValues: ILoginData = { email: '', password: '' };

  const onLogin = async (
    data: ILoginData,
    action: FormikHelpers<ILoginData>,
  ) => {
    try {
      const { result, ok } = await loginUser(data);
      dispatch(updatedCartFromDatabase(result.cart.CartItem))
      
      console.log('Data yang di terima:', result); // debuging
      if (!ok) throw result.msg;

      // dispatch(updatedCartFromDatabase(result.cart))
      action.resetForm();
      dispatch(loginAction(result.user))
      createToken(result.token);
      router.push('/');
    } catch (err) {
      setLoginError('Email atau password salah, silahkan coba lagi');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 flex-wrap py-12">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Masuk</h1>
        <p className="mb-4">
          Belum punya akun Bermuda Store?{' '}
          <Link
            href="/register"
            className="text-blue-800 hover:underline font-bold"
          >
            Daftar
          </Link>
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={onLogin}
        >
          {(props: FormikProps<ILoginData>) => {
            const { values, errors, touched, handleChange } = props;

            return (
              <Form>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Masukkan alamat email"
                  />
                  {touched.email && errors.email ? (
                    <div className="text-red-500 text-xs">{errors.email}</div>
                  ) : null}
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-gray-700"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Masukkan password"
                  />
                  {touched.password && errors.password ? (
                    <div className="text-red-500 text-xs">
                      {errors.password}
                    </div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
                >
                  Masuk
                </button>

                <button
                  onClick={handleGoogleLogin}
                  className=" mt-1 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mb-4"
                >
                  Masuk dengan Google
                </button>
                {loginError && (
                  <div className="text-center text-red-500 text-xs mt-4">
                    {loginError}
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
