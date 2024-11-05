'use client';
import Link from 'next/link';
import { Formik, Form, Field, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { IRegEmail } from '@/type/user';
import { regUser } from '@/lib/user.handler';
import { useState } from 'react';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Format email salah').required('Email harus diisi'),
});

const RegisterUser: React.FC<object> = () => {
  const [emailSent, setEmailSent] = useState(false);
  const initialValues: IRegEmail = { email: '' };

  const onRegister = async (
    data: IRegEmail,
    action: FormikHelpers<IRegEmail>,
  ) => {
    try {
      const { result, ok } = await regUser(data);
      if (!ok) throw result.msg;
      action.resetForm();
      setEmailSent(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 flex-wrap py-12">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        {emailSent ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb4 text-gray-700">
              Email Terkirim!
            </h2>
            <p className="text-gray-500">
              Silahkan periksa email anda untuk melanjutkan verifikasi.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-center">Daftar</h1>
            <p className="mb-4">
              Sudah punya akun Bermuda?{' '}
              <Link
                href="/login"
                className="text-blue-800 hover:underline font-bold"
              >
                Masuk
              </Link>
            </p>
            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={onRegister}
            >
              {(props: FormikProps<IRegEmail>) => {
                const { values, errors, touched, handleChange } = props;
                console.log(props);

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
                        <div className="text-red-500 text-xs">
                          {errors.email}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="submit"
                      className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-700"
                    >
                      Lanjut
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterUser;
