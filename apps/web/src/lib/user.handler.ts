import { IRegEmail } from '@/type/user';

export const getUserProfile = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}users/${userId}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

export const regUser = async (data: IRegEmail) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}users/register`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};

export const resetPassword = async (data: IRegEmail) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}account/reset-password`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};

export const verifyUser = async (
  data: { password: string; name: string },
  token: string,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}users/data-register/${token}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};

export const verifyResetPassword = async (
  data: { password: string },
  token: string,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}account/new-password/${token}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};

export const loginUser = async (data: { email: string; password: string }) => {
  console.log('Data yang dikirim ke API:', data);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}users/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
  const result = await res.json();

  console.log('Response dari API:', result, res.ok);
  return { result, ok: res.ok };
};

export const getAllUsers = async (token: string | undefined) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}users/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const capitalizeWord = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
