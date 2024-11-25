'use client';
import CreateBuyOneGetOneDiscount from '@/components/discount/discountBogo';
import CreateManualDiscount from '@/components/discount/discountManual';
import CreateDiscountForm from '@/components/discount/discountMinPurchase';
import Modal from '@/components/discount/modal';
import React, { useEffect, useState } from 'react';

const DiscountPage: React.FC = () => {
  const [isManualDiscountOpen, setIsManualDiscountOpen] = useState(false);
  const [isMinPurchaseDiscountOpen, setIsMinPurchaseDiscountOpen] =
    useState(false);
  const [isBogoDiscountOpen, setIsBogoDiscountOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen p-6 md:p-10 transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center hover:text-teal-600 transition-all">
        Manage Discounts
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Bagian untuk membuat diskon manual */}
        <div
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer transition-transform hover:scale-105 duration-300"
          onClick={() => setIsManualDiscountOpen(true)}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Create Manual Discount
          </h2>
        </div>

        {/* Bagian untuk membuat diskon berdasarkan pembelian minimum */}
        <div
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer transition-transform hover:scale-105 duration-300"
          onClick={() => setIsMinPurchaseDiscountOpen(true)}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Create Discount by Minimum Purchase
          </h2>
        </div>

        {/* Bagian untuk membuat diskon beli satu dapat satu */}
        <div
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer transition-transform hover:scale-105 duration-300"
          onClick={() => setIsBogoDiscountOpen(true)}
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Create Buy One Get One Discount
          </h2>
        </div>
      </div>
      <div>{/* <DiscountList /> */}</div>

      {/* Modals */}
      <Modal
        isOpen={isManualDiscountOpen}
        onClose={() => setIsManualDiscountOpen(false)}
        title="Create Manual Discount"
      >
        <CreateManualDiscount />
      </Modal>

      <Modal
        isOpen={isMinPurchaseDiscountOpen}
        onClose={() => setIsMinPurchaseDiscountOpen(false)}
        title="Create Discount by Minimum Purchase"
      >
        <CreateDiscountForm />
      </Modal>

      <Modal
        isOpen={isBogoDiscountOpen}
        onClose={() => setIsBogoDiscountOpen(false)}
        title="Create BOGO Discount"
      >
        <CreateBuyOneGetOneDiscount />
      </Modal>
    </div>
  );
};

export default DiscountPage;
