import { getToken } from './server';

export const getUserAddressess = async (userId: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}users/userAddress/${userId}`,
    { next: { revalidate: 1 } },
  );
  const { status, data } = await res.json();

  return data;
};

export const postOrder = async (
  totalAmount: number,
  shippingCost: number,
  addressId: number,
  storeId: number,
  discountAmount: number,
  methodPayment: 'Transfer' | 'Gateway',
  discountId?: number,
) => {
  const token = await getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}create`, {
    method: 'POST',
    body: JSON.stringify({
      totalAmount,
      shippingCost,
      addressId,
      methodPayment,
      storeId,
      discountId,
      discountAmount,
    }),
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const { status, msg } = await res.json();

  return { status, msg };
};

export const getMidtransToken = async (orderId: number) => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}order/id/${orderId}`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const { status, msg } = await res.json();
  if (status === 'ok') {
    return msg.Payment.token;
  }
  return msg;
};

export const getMidtransStatus = async (orderId: number) => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}midtrans/status/${orderId}`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    },
  );
  const {
    status,
    midtrans,
  }: {
    status: 'ok' | 'NOT_FOUND';
    midtrans: 'pending' | 'expire' | 'settlement' | null;
    error: string;
  } = await res.json();

  // status = NOT_FOUND || ok, midtrans = 'pending' | 'expire' | 'settlement' | null
  return { status, midtrans };
};
export const getOrderPendingPayment = async () => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}order/pending/`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 1 },
    },
  );

  const { status, msg, order } = await res.json();
  if (msg === 'FOUND') {
    return order;
  } else {
    return false;
  }
};

export const getUserOrders = async () => {
  const token = await getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}order`, {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 1 },
  });
  const { status, msg, order } = await res.json();
  return { status, msg, order };
};
export const getOrderById = async (orderId: number) => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}order/id/${orderId}`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 1 },
    },
  );
  const { status, msg } = await res.json();
  return { status, msg };
};

export const cancelOrder = async (orderId: number) => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}order/cancel`,
    {
      method: 'PATCH',
      body: JSON.stringify({ orderId }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { status, msg, error } = await res.json();
  return { status, msg, error };
};

export const uploadPaymentProof = async (values: any, orderId: number) => {
  const formData = new FormData();
  formData.append('orderId', `${orderId}`);
  formData.append('paymentProof', values.paymentProof);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}order/paymentProof`,
    {
      method: 'PATCH',
      body: formData,
    },
  );

  const { status, msg } = await res.json();

  return { status, msg };
};

export const completeOrder = async (orderId: number) => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}order/complete`,
    {
      method: 'PATCH',
      body: JSON.stringify({ orderId }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { status, msg } = await res.json();

  return { status, msg };
};

export const getOrderSales = async () => {
  const token = await getToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}order/report`,
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 1 },
    },
  );
  const { status, msg, order } = await res.json();
  return { status, msg, order };
};
