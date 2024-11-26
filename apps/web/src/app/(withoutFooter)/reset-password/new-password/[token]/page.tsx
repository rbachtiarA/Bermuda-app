'use client';
import { verifyResetPassword } from '@/lib/user.handler';
import { Formik, Form, Field, FormikProps } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

const VerifyScchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password harus diisi'),
});

const VerifyUserRegister: React.FC<object> = () => {
  const router = useRouter();
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const params = useParams<{ token: string }>();
  console.log('Token from URL:', params)

  const initialValues = { password: ''};

  const onVerify = async (
    data: typeof initialValues,
  ) => {
    if (!params.token) {
      setVerificationError('Token tidak valid atau sudah kedaluarsa');
      return;
    }

    try {
      const result = await verifyResetPassword( data, params.token );
      console.log(result);
      
      if (result.ok) {
        router.push('/login');
      } else {
        setVerificationError("'Terjadi kesalahan saat verifikasi.'");
      }
    } catch (err) {
      setVerificationError('Verifikasi gagal, silahkan coba kembali');
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <div className="p-1 w-full text-center bg-green-200 text-green-600 rounded-lg">
          Verifikasi Berhasil.
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Buat Password Baru
        </h1>
        <Formik
          initialValues={initialValues}
          validationSchema={VerifyScchema}
          onSubmit={onVerify}
        >
          {(props: FormikProps<typeof initialValues>) => {
            const { values, errors, touched, handleChange } = props;

            return (
              <Form>
                <div>
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
                  Reset Password
                </button>

                {verificationError && (
                  <div className="text-center text-red-500 text-xs mt-4">
                    {verificationError}
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

export default VerifyUserRegister;
