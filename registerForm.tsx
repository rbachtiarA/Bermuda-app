// apps/web/src/app/register/page.tsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email('Format email salah')
    .required('Email harus diisi'),
});

const RegisterUser: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Registrasi</h1>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
                {touched.email && errors.email ? (
                  <div className="text-red-500 text-xs">{errors.email}</div>
                ) : null}
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterUser;
