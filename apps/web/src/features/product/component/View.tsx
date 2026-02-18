'use client';
import currencyRupiah from '@/lib/rupiahCurrency';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import useProductData from '../hooks/useProductData';
import TitleBreadcrumbs from '@/features/shared/components/breadcrumbs';

export default function ProductView({ slug }: { slug: string }) {
  const {
    error,
    quantity,
    handleCart,
    handleController,
    isLoading,
    isShowDesc,
    product,
    handleDescription,
    stock,
    discountType,
  } = useProductData(slug);
  if (isLoading) return <div>Loading...</div>;
  if (error || !product) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="md:col-start-2 my-4">
        <TitleBreadcrumbs title="PRODUCT" label={product.name} />
      </div>

      <div className="flex flex-col lg:flex-row gap-10 my-10 py-4">
        <ProductImage imageSrc={product.imageUrl} imageAlt={product.name} />

        <div className="flex-1">
          <div className="mx-10">
            <ProductTitle slug={product.slug} title={product.name} />

            <ProductPrice
              price={product.price}
              discounts={product.discounts || []}
              discountType={discountType}
            />

            <ProductDescription
              description={null}
              isShowDesc={isShowDesc}
              handleDescription={handleDescription}
            />

            <ProductController
              handleCart={handleCart}
              handleController={handleController}
              quantity={quantity}
              stock={stock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductImage({
  imageSrc,
  imageAlt,
}: {
  imageSrc: string | null;
  imageAlt: string | null;
}) {
  return (
    <div className="flex-1">
      <div className="p-4 border rounded-lg shadow-lg">
        <Image
          src={imageSrc || '/images/product.png'}
          alt={imageAlt || 'Product Image'}
          width={400}
          height={400}
          className="mx-auto rounded-lg"
        />
      </div>
    </div>
  );
}

function ProductTitle({
  title,
  slug,
}: {
  title: string | null;
  slug: string | null;
}) {
  return (
    <div className="py-2">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
        {title || 'Product Name'}
      </h1>
      {/* <h2 className="text-lg text-gray-500 py-2">{slug}</h2> */}
    </div>
  );
}

function ProductPrice({
  price,
  discounts,
  discountType,
}: {
  price: number;
  discounts: any[];
  discountType: () => number;
}) {
  return (
    <div className="py-2">
      {discounts?.some((discount) => discount.discountType === 'FLAT') ? (
        <div className="py-2">
          <h2 className="text-primary text-2xl font-bold">
            {currencyRupiah(price - discountType())}
          </h2>
          <h2 className="text-gray-400 text-sm font-bold">
            <del>{currencyRupiah(price)}</del>
          </h2>
        </div>
      ) : (
        <h2 className="text-primary text-2xl font-bold">
          {currencyRupiah(price || 0)}
        </h2>
      )}

      {discounts?.some(
        (discount) => discount.discountType === 'BUY_ONE_GET_ONE',
      ) && (
        <div className="text-red-500 font-bold text-sm">
          🎉 Buy One Get One Free!
        </div>
      )}
    </div>
  );
}

function ProductDescription({
  description,
  isShowDesc,
  handleDescription,
}: {
  description: string | null;
  isShowDesc: boolean;
  handleDescription: () => void;
}) {
  const isDescriptionLong = description && description.length > 100;

  return (
    <div className="py-4">
      <h2 className="font-bold text-lg">Deskripsi</h2>
      <p className="text-gray-700">
        {description
          ? isShowDesc
            ? description
            : `${description.slice(0, 100)}... `
          : 'Deskripsi tidak tersedia.'}
        {isDescriptionLong && (
          <span
            onClick={handleDescription}
            className="text-primary font-bold cursor-pointer"
          >
            {isShowDesc ? 'Tutup' : 'Selengkapnya'}
          </span>
        )}
      </p>
    </div>
  );
}

function ProductController({
  quantity,
  stock,
  handleController,
  handleCart,
}: {
  quantity: number;
  stock: number;
  handleController: (set: number) => void;
  handleCart: () => void;
}) {
  return (
    <div className="py-4">
      <label className="block font-bold text-gray-800 mb-2 text-lg">
        Jumlah Pembelian
      </label>
      <p className="text-sm text-gray-600 mb-4">
        Stok Tersedia: <span className="font-bold text-green-600">{stock}</span>
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleController(-1)}
          className="w-10 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300 transition-all duration-200"
          disabled={quantity <= 1}
        >
          <span className="text-lg font-bold">-</span>
        </button>
        <input
          type="number"
          value={quantity}
          className="w-16 h-10 text-center border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
          min={1}
          max={stock}
        />
        <button
          onClick={() => handleController(1)}
          className="w-10 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300 transition-all duration-200"
          disabled={quantity >= stock}
        >
          <span className="text-lg font-bold">+</span>
        </button>
      </div>
      <div className="my-6">
        <Button
          color="primary"
          variant="bordered"
          onPress={handleCart}
          isDisabled={quantity === 0 || stock === 0}
          className="px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
