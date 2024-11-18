import { StoreListData } from "@/components/super-admin/storeList";
import { Card } from "@nextui-org/react";

export default function StoreManagementPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <main className="flex flex-col">
        <div className="bg-white p-6">
          <header className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-gray-800">
            Store Management
          </h1>
          </header>
          <Card className="w-full px-4 py-6">
            <h2 className="text-medium font-semibold text-gray-800">Daftar toko</h2>
            <StoreListData />
          </Card>
        </div>
      </main>
    </div>
  );
}
