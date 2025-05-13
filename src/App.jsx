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
import RenterReq from "./(dashboard)/(pages)/Admin/RenterReq";
import SavedListing from "./(dashboard)/(pages)/SavedListing";
import Purchaserform from "./(website)/Forms/Purchaserform";
import Renterform from "./(website)/Forms/Renterform";
import BuyerReq from "./(dashboard)/(pages)/Admin/BuyerReq";
import ChatEcoystem from "./(dashboard)/(pages)/Chatting/ChatEcosystem";
import PendingRenters from "./(dashboard)/(pages)/Customer/PendingRenters/Page";
import RentersHistory from "./(dashboard)/(pages)/Customer/RentersHistory/Page";
import PurchasersHistory from "./(dashboard)/(pages)/Customer/PurchasersHistory/Page";
import PendingPurchasers from "./(dashboard)/(pages)/Customer/PendingPurchasers/Page";
import MyProfile from "./(dashboard)/(pages)/MyProfile";
import Notifications from "./(dashboard)/(pages)/Notifications";
import Pendingreg from "./(dashboard)/(pages)/Admin/Pendingreg";
import ReqforRent from "./(dashboard)/(pages)/CarDealer/ReqforRent";
import DealerManageCars from "./(dashboard)/(pages)/CarDealer/CarPosting/Page";
import ReqforPurchase from "./(dashboard)/(pages)/CarDealer/ReqforPurchase";
import DealerPostCar from "./(dashboard)/(pages)/CarDealer/CarPosting/DealerPostCar";
import { useEffect } from "react";
import { generateToken, messaging } from "../firebase/config";
import { onMessage } from "firebase/messaging";

// Protected Dashboard Layout Component
const ProtectedDashboardLayout = ListingProtectHOC(Dashboard);

function App() {
  useEffect(() => {
    generateToken();

    onMessage(messaging, (payload) => {
      console.log(payload);
    });
  }, []);

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
        <Route path="/carslist/:id/rent" element={<ProtectedRent />} />
        <Route path="/carslist/:id/purchase" element={<ProtectedPurchase />} />

        {/* Protected Dashboard with nested routes */}
        <Route path="/dashboard" element={<ProtectedDashboardLayout />}>
          <Route path="rentreq" element={<RenterReq />} />
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="buyreq" element={<BuyerReq />} />
          <Route path="postcar" element={<PostCarForm />} />
          <Route path="managecars" element={<PostMangeCars />} />
          <Route path="auditlogs" element={<Auditlogs />} />
          <Route path="savedlistings" element={<SavedListing />} />
          <Route path="chat" element={<ChatEcoystem />} />
          <Route path="pendingreg" element={<Pendingreg />} />
          <Route path="dealerrentreq" element={<ReqforRent />} />
          <Route path="dealerpurchasereq" element={<ReqforPurchase />} />
          <Route path="dealerposting" element={<DealerManageCars />} />
          <Route path="dealerpostform" element={<DealerPostCar />} />
          <Route path="pendingrenters" element={<PendingRenters />} />
          <Route path="rentalshistory" element={<RentersHistory />} />
          <Route path="pendingoffers" element={<PendingPurchasers />} />
          <Route path="purchaseshistory" element={<PurchasersHistory />} />
          <Route path="notify" element={<Notifications />} />
          <Route />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
