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
          <ProtectedRoute requiredRole="rider">
             <RiderProfile />
          </ProtectedRoute> 
          }/>
        <Route path="/home" element={
          <ProtectedRoute requiredRole="rider">
             <RiderHome />
          </ProtectedRoute> 
          }/>
        <Route path="/become-driver" element={
          <ProtectedRoute requiredRole="rider">
             <BecomeDriver/>
          </ProtectedRoute>
          }/>
          <Route path="/driver/me" element={
          <ProtectedRoute requiredRole="driver">
             <DriverProfile />
          </ProtectedRoute> 
          }/>

        <Route path="/driver/home" element={
         <ProtectedRoute requiredRole="driver">
            <DriverScreen/>
         </ProtectedRoute>
        }/>

         <Route path="/book-ride" element={
         <ProtectedRoute requiredRole="rider">
            <Destination/>
         </ProtectedRoute>
        }/>

        <Route path="/ride-options" element={
         <ProtectedRoute requiredRole="rider">
            <RideScreen/>
         </ProtectedRoute>
        }/>


      </Routes>
    </BrowserRouter>
  );
}






export default App;
