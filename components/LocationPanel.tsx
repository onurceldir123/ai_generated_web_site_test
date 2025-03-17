"use client";

export default function LocationPanel() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Yerleşke Listesi</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            Yeni Yerleşke Ekle
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((location) => (
            <div key={location} className="border rounded-lg p-4">
              <h4 className="font-semibold">Yerleşke {location}</h4>
              <p className="text-sm text-gray-500 mt-2">Adres bilgisi</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-blue-600">5 Sensör</span>
                <button className="text-sm text-gray-600">Düzenle</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 