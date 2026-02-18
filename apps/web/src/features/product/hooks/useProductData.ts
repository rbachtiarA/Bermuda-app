'use client';
import { postCartItems } from '@/lib/cart';
import { getProductById, getProductBySlug } from '@/lib/product.handler';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { addedToCart } from '@/redux/slice/cartSlice';
import { IProduct } from '@/type/product';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function useProductData(slug: string) {
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isShowDesc, setIsShowDesc] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector((state) => state.user);
  const store = useAppSelector((state) => state.store);

  const [quantity, setQuantity] = useState<number>(1);

  const getAvailableStock = (): number => {
    if (Array.isArray(product?.stock)) {
      return product.stock.reduce((total, stockItem) => {
        const quantity =
          stockItem.quantity && stockItem.storeId == store.id
            ? stockItem.quantity
            : 0;
        return total + quantity;
      }, 0);
    }
    return product?.stock || 0;
  };

  const stock = getAvailableStock();
  const hasDiscountType = (type: string) =>
    product?.discounts?.some((discount) => discount.discountType === type) ||
    false;

  const discountType = () => {
    const flatDiscount = product?.discounts?.find(
      (discount) => discount.discountType === 'FLAT',
    );

    const percentageDiscount = product?.discounts?.find(
      (discount) => discount.discountType === 'PERCENTAGE',
    );

    if (flatDiscount) {
      return flatDiscount.value;
    }

    if (percentageDiscount) {
      return (product?.price || 0) * (percentageDiscount.value / 100);
    }

    return 0;
  };

  const handleAdd = () => {
    if (hasDiscountType('BUY_ONE_GET_ONE')) {
      toast.error(`Maksimal Pembelian 1 Pcs`);
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleSubtract = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleDescription = () => {
    setIsShowDesc(!isShowDesc);
  };
  const handleController = (set: number) => {
    const newQuantity = quantity + set;
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
    return;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (isNaN(value) || value <= 0) {
      toast.error('Jumlah harus lebih dari 0');
      return;
    }

    if (hasDiscountType('BUY_ONE_GET_ONE') && value > 1) {
      toast.error(`Maksimal Pembelian 1 Pcs`);
      return;
    }

    setQuantity(value);
  };

  const loadProduct = async () => {
    try {
      const fetchedProduct = await getProductBySlug(slug);
      setProduct(fetchedProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCart = async () => {
    try {
      if (!product) {
        toast.error('Product invalid');
      } else {
        const res = await postCartItems(user.id, product.id, quantity);
        if (res.status === 200) {
          dispatch(addedToCart({ ...res.cartItem, quantity }));
          toast.success(`Berhasil memasukkan ke keranjang`);
        } else {
          toast.error(`Terjadi kesalahan`);
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Server Error');
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  return {
    product,
    stock,
    quantity,
    error,
    isLoading,
    isShowDesc,
    discountType,
    handleCart,
    handleController,
    handleDescription,
  };
}
