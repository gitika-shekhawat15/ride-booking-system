import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./api/interceptors.js"
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/SignUp.jsx";
import RiderProfile from "./pages/rider/RiderProfile.jsx";
import RiderHome from "./pages/rider/RiderHome.jsx";  
import BecomeDriver from "./pages/rider/BecomeDriver.jsx";
import DriverProfile from "./pages/driver/DriverProfile.jsx";
import Destination from "./pages/rider/Destination.jsx";
import RideScreen from "./pages/rider/RideScreen.jsx";
import DriverScreen from "./pages/driver/DriverScreen.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Home from "./pages/landingPage/Home.jsx";


  
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/rider/me" element={
          <ProtectedRoute>
             <RiderProfile />
          </ProtectedRoute> 
          }/>
        <Route path="/home" element={
          <ProtectedRoute>
             <RiderHome />
          </ProtectedRoute> 
          }/>
        <Route path="/become-driver" element={
          <ProtectedRoute>
             <BecomeDriver/>
          </ProtectedRoute>
          }/>
          <Route path="/driver/me" element={
          <ProtectedRoute>
             <DriverProfile />
          </ProtectedRoute> 
          }/>

        <Route path="/driver/home" element={
         <ProtectedRoute>
            <DriverScreen/>
         </ProtectedRoute>
        }/>

         <Route path="/book-ride" element={
         <ProtectedRoute>
            <Destination/>
         </ProtectedRoute>
        }/>

        <Route path="/ride-options" element={
         <ProtectedRoute>
            <RideScreen/>
         </ProtectedRoute>
        }/>


      </Routes>
    </BrowserRouter>
  );
}






export default App;
