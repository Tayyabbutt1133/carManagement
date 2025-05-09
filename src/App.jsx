import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./(website)/(pages)/Home";
import Carlisting from "./(website)/(pages)/carlist/Carlisting";
import CarDetail from "./(website)/(pages)/carlist/CarDetail";
import Signin from "./(website)/(auth)/Signin";
import Signup from "./(website)/(auth)/Signup";
import Navbar from "./(website)/components/Navbar/Navbar";
import Footer from "./(website)/components/Footer";
import Dashboard from "./(dashboard)/(pages)/Dashboard";
import ListingProtectHOC from "./(website)/components/ListingProtectHOC";
import PostCarForm from "./(dashboard)/(pages)/Admin/PostManageCars/PostCarForm";
import PostMangeCars from "./(dashboard)/(pages)/Admin/PostManageCars/Page";
import Auditlogs from "./(dashboard)/(pages)/Admin/Audit_Logs/Page";
import History from "./(dashboard)/(pages)/Renter/History/Page";
import Pendingreturns from "./(dashboard)/(pages)/Renter/Pendingreturns/Page";
import Rentals from "./(dashboard)/(pages)/Renter/Rentals/Page";
import Offersmade from "./(dashboard)/(pages)/Buyer/Offersmade";
import Purchases from "./(dashboard)/(pages)/Buyer/Purchases";
import RenterReq from "./(dashboard)/(pages)/Admin/RenterReq";
import SavedListing from "./(dashboard)/(pages)/Buyer/SavedListing";
import Purchaserform from "./(website)/Forms/Purchaserform";
import Renterform from "./(website)/Forms/Renterform";
import BuyerReq from "./(dashboard)/(pages)/Admin/BuyerReq";

// Protected Dashboard Layout Component
const ProtectedDashboardLayout = ListingProtectHOC(Dashboard);

function App() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/dashboard");

  // Only protect the individual car listing components
  const ProtectedCarlisting = ListingProtectHOC(Carlisting);
  const ProtectedCarDetail = ListingProtectHOC(CarDetail);
  const ProtectedPurchase = ListingProtectHOC(Purchaserform);
  const ProtectedRent = ListingProtectHOC(Renterform);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes for authenticated users */}
        <Route path="/carslist" element={<ProtectedCarlisting />} />
        <Route path="/carslist/:id" element={<ProtectedCarDetail />} />
        <Route path="/carslist/:id/rent" element={<Renterform />} />
        <Route path="/carslist/:id/purchase" element={<Purchaserform />} />

        {/* Protected Dashboard with nested routes */}
        <Route path="/dashboard" element={<ProtectedDashboardLayout />}>
          <Route path="rentreq" element={<RenterReq />} />
          <Route path="buyreq" element={<BuyerReq/>} />
          <Route path="postcar" element={<PostCarForm />} />
          <Route path="managecars" element={<PostMangeCars />} />
          <Route path="auditlogs" element={<Auditlogs />} />
          <Route path="myrentals" element={<Rentals />} />
          <Route path="rentalshistory" element={<History />} />
          <Route path="pendingreturns" element={<Pendingreturns />} />
          <Route path="mypurchases" element={<Purchases />} />
          <Route path="offers" element={<Offersmade />} />
          <Route path="savedlistings" element={<SavedListing />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
