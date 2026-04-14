// src/driver/components/ToPickupSheet.jsx

export default function ToPickupSheet({ ride, onStartRide }) {
  return (
    <div className="bg-white rounded-t-3xl p-4 shadow-xl">

      {/* handle */}
      <div className="w-12 h-1 bg-gray-300 rounded mx-auto mb-3" />

      {/* title */}
      <h2 className="text-lg font-semibold mb-2">
        Meet the customer
      </h2>


      {/* info */}
      <div className="bg-gray-50 rounded-xl p-3 text-sm mb-3">
        <p className="font-medium text-green-600 mb-1">
          ✔ Customer Verified Location
        </p>
        <p className="text-gray-600">
          After 3 minutes, you will get extra charge for waiting
        </p>
      </div>

      {/* customer */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div>
          <p className="font-semibold">{ride.riderName}</p>
          <p className="text-sm text-gray-500 line-clamp-2">
            {ride.pickup}
          </p>
        </div>
      </div>

      {/* start ride */}
      <button
        onClick={onStartRide}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
      >
                🚕 Go to pickup

      </button>

    </div>
  );
}
