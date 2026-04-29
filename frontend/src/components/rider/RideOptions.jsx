import { useLocation } from "react-router-dom";
import bikeImg from "../../assets/images/bikeImg.png";
import autoImg from "../../assets/images/autoImg.png";
import carImg from "../../assets/images/whiteCarImg.png";
import { calculateFare } from "../../utils/fare.js";
import Button from "../ui/Button.jsx";

function RideOptions({ selectedRide, setSelectedRide, onConfirm, isBooking }) {
  const { state } = useLocation();
  const { pickupCoordinates, dropCoordinates } = state || {};

  const rides = [
    { 
      type: "Bike", img: bikeImg, 
      price: calculateFare(pickupCoordinates, dropCoordinates, "bike"),
      eta: "4 min", seats: "1 seat" 
    },
    { 
      type: "Auto", img: autoImg, 
      price: calculateFare(pickupCoordinates, dropCoordinates, "auto"),
      eta: "6 min", seats: "Up to 3 seats" 
    },
    { 
      type: "Car", img: carImg, 
      price: calculateFare(pickupCoordinates, dropCoordinates, "car"),
      eta: "8 min", seats: "Up to 4 seats" 
    },
  ];

  return (
    <div className=" flex flex-col h-full overflow-hidden text-white ">

      {/* Ride Options */}
      <div className="overflow-y-auto px-4 md:px-6 mt-4 md:mt-6 md:pt-1  space-y-2 md:space-y-3">
        {rides.map((ride) => (
          <div
            key={ride.type}
            onClick={() => setSelectedRide(ride.type)}
            className={`
              min-h-[60px]  md:h-[80px] p-2 md:p-4 rounded-2xl border cursor-pointer transition-all duration-200
              ${selectedRide === ride.type
                ? "bg-[#D6FF2F] text-black border-[#D6FF2F]"
                : "bg-white/10 backdrop-blur-xl border-white/20 text-white hover:border-[#D6FF2F]/40"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <img src={ride.img} alt={ride.type}
                 className="w-14 md:w-15 object-contain" />
                <div>
                  <p className="font-semibold text-sm md:text-base">{ride.type}</p>
                  <p className="text-xs opacity-70">{ride.eta} • {ride.seats}</p>
                </div>
              </div>
              <p className="font-bold text-base md:text-lg">₹{ride.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      <div className="px-4 py-4 md:px-6 border-t border-white/10"> 
        <Button onClick={onConfirm}  loading={isBooking}       
          disabled={!selectedRide}
          className="
            w-full mt-1 md:my-3 py-3 md:py-4 rounded-2xl
            bg-[#D6FF2F] text-black font-bold text-sm md:text-base
            hover:-translate-y-0.5 hover:shadow-[0_6px_20px_#D6FF2F50]
            active:translate-y-0 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
          "
        >
          {selectedRide ? `Confirm ${selectedRide} →` : "Select a ride"}
        </Button>
      </div>

    </div>
  );
}

export default RideOptions;