// 'use client';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { IProduct } from '@/type/product';
// import { getProductById } from '@/lib/product.handler';
// import { useAppDispatch, useAppSelector } from '@/redux/hook';
// import { Button } from '@nextui-org/react';
// import { toast } from 'react-toastify';
// import { postCartItems } from '@/lib/cart';
// import { addedToCart } from '@/redux/slice/cartSlice';
// import currencyRupiah from '@/lib/rupiahCurrency';

// export default function ProductDetail({ productId }: { productId: number }) {
//   const dispatch = useAppDispatch();
//   const [product, setProduct] = useState<IProduct | null>(null);
//   const [discounts, setDiscounts] = useState<any[] | any>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const cart = useAppSelector((state) => state.cart);
//   const user = useAppSelector((state) => state.user);
//   const [quantity, setQuantity] = useState<number>(1);

//   const handleAdd = () => {
//     if (
//       discounts?.some(
//         (discount: any) => discount.discountType == 'BUY_ONE_GET_ONE',
//       )
//     ) {
//       toast.error(`Maksimal Pembelian 1 Pcs`);
//     } else if (
//       discounts?.some(
//         (discount: any) => discount.discountType !== 'BUY_ONE_GET_ONE',
//       )
//     ) {
//       setQuantity((prev) => prev + 1);
//     }
//   };

//   const handleSubtract = () => {
//     if (quantity > 1) {
//       if (
//         discounts?.some(
//           (discount: any) => discount.discountType !== 'BUY_ONE_GET_ONE',
//         )
//       ) {
//         setQuantity((prev) => prev - 1);
//       }
//     } else if (
//       discounts?.some(
//         (discount: any) => discount.discountType == 'BUY_ONE_GET_ONE',
//       )
//     ) {
//       toast.error(`Maksimal Pembelian 1 Pcs`);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseInt(e.target.value, 10);
//     if (
//       !isNaN(value) &&
//       value > 0 &&
//       discounts?.some(
//         (discount: any) => discount.discountType !== 'BUY_ONE_GET_ONE',
//       )
//     ) {
//       setQuantity(value);
//     } else if (
//       discounts?.some(
//         (discount: any) => discount.discountType == 'BUY_ONE_GET_ONE',
//       )
//     ) {
//       toast.error(`Maksimal Pembelian 1 Pcs`);
//     }
//   };
//   const loadProduct = async () => {
//     try {
//       const fetchedProduct = await getProductById(productId);
//       setProduct(fetchedProduct);
//       setDiscounts(fetchedProduct?.discounts);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Server error');
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log(discounts, 'DISCOUNt');

//   useEffect(() => {
//     loadProduct();
//   }, []);

//   const onClickedAddToCart = async () => {
//     const existProduct = cart.find((item) => item.productId === product?.id);
//     if (existProduct) {
//     }
//     const res = await postCartItems(user.id, productId, quantity);
//     if (res.status === 200) {
//       res.cartItem.quantity = quantity;
//       dispatch(addedToCart(res.cartItem));
//       toast.success(`Berhasil memasukkan ke keranjang`);
//     } else {
//       toast.error(`Something is error`);
//     }
//   };

//   const discountType = () => {
//     const flatDiscount = product?.discounts?.find(
//       (discount) => discount.discountType === 'FLAT',
//     );

//     const percentageDiscount = product?.discounts?.find(
//       (discount) => discount.discountType === 'PERCENTAGE',
//     );

//     if (flatDiscount) {
//       return flatDiscount.value;
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="flex-1">
//           <div className="p-4 border rounded-lg shadow-sm">
//             <Image
//               src={product?.imageUrl || '/images/product.png'}
//               alt={product?.name || 'Product Image'}
//               width={400}
//               height={400}
//               className="mx-auto"
//             />
//           </div>
//         </div>

//         <div className="flex-1">
//           <div className="py-2">
//             <h1 className="text-4xl font-bold text-gray-800">
//               {product?.name || 'Product Name'}
//             </h1>
//             <h2 className="text-sm text-gray-600 p-2">{product?.slug}</h2>
//           </div>
//           <div className="py-2">
//             {product?.discounts?.some(
//               (discount) => discount.discountType === 'FLAT',
//             ) ? (
//               <div className="py-2">
//                 <h2 className="text-primary text-2xl font-bold">
//                   {currencyRupiah(product?.price - discountType())}
//                 </h2>
//                 <h2 className="text-gray-400 text-small font-bold">
//                   <del>{currencyRupiah(product?.price)}</del>
//                 </h2>
//               </div>
//             ) : (
//               <h2 className="text-primary text-2xl font-bold">
//                 {currencyRupiah(product?.price || 0)}
//               </h2>
//             )}

//             {discounts?.some(
//               (discount: any) => discount.discountType === 'BUY_ONE_GET_ONE',
//             ) && (
//               <div className="text-red-500 font-bold text-sm">
//                 🎉 Buy One Get One Free!
//               </div>
//             )}
//           </div>

//           <div className="py-4">
//             <h2 className="font-bold text-lg">Deskripsi</h2>
//             <p className="text-gray-700">
//               {product?.description || 'No description available.'}
//             </p>
//           </div>
//           <div className="mt-6">
//             <label className="block font-bold text-gray-700 mb-2">
//               Jumlah Pembelian
//             </label>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={handleSubtract}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
//                 disabled={quantity <= 1}
//               >
//                 -
//               </button>
//               <input
//                 type="number"
//                 value={quantity}
//                 onChange={handleInputChange}
//                 className="w-16 text-center border rounded"
//                 min={1}
//               />
//               <button
//                 onClick={handleAdd}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
//               >
//                 +
//               </button>
//             </div>
//             <div className="flex items-center gap-2 mt-8">
//               <Button
//                 color="primary"
//                 variant="bordered"
//                 onPress={() => onClickedAddToCart()}
//                 isDisabled={quantity === 0}
//               >
//                 Add to Cart
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
