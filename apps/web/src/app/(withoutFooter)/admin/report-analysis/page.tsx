import StockHistoryPage from '@/components/stock/stockHistory';

export default function page() {
  return (
    <div className="container mx-auto px-4 py-6">
      <main className="flex flex-col">
        <div className="bg-white p-8">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-gray-800">
              Report & Analysis
            </h1>
          </header>
          <StockHistoryPage />
        </div>
      </main>
    </div>
  );
}
// j
