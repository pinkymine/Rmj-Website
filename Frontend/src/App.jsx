import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home.jsx";
import Header from "./component/home-component/Header.jsx";
import Footer from "./component/home-component/Footer.jsx";
// import ProductListing from "./pages/silver";
import Velkada from "./pages/velkada.jsx";
// import Goldkada from "./pages/goldkada";
import JewelleryCollection from "./pages/Customised.jsx";
import ContactPage from "./pages/Contact.jsx";
import ProductDetails from "./pages/product-detail.jsx";
import WomensJewelry from "./pages/women.jsx";
import MensJewelry from "./pages/men.jsx";
// import PureSilverGodIdol from "./pages/pure-silver-god-idol";
import KidsProductListing from "./pages/kids.jsx";
import CoupleRingsProductPage from "./pages/couple-ring.jsx";
import PendantsProductPage from "./pages/pendents.jsx";
import WomensRingListing from "./pages/custom/women/women-ring.jsx";
import WomensBraceletListing from "./pages/custom/women/women-bracelet.jsx";
import WomensPendantListing from "./pages/custom/women/women-pendent.jsx";
import MensRingListing from "./pages/custom/men/men-ring.jsx";
import MensBraceletListing from "./pages/custom/men/men-bracelets.jsx";
import MensPendantListing from "./pages/custom/men/men-pendent.jsx";
import KidsPendantListing from "./pages/custom/kids/kids-pendents.jsx";
import KidsRingListing from "./pages/custom/kids/kids-ring.jsx";
import KidsBraceletListing from "./pages/custom/kids/kids-bracelets.jsx";
import OrderTrackingForm from "./pages/track.jsx";
import AuthForms from "./pages/login.jsx";
import CartPage from "./pages/cart.jsx";
import { CartProvider } from "./pages/CartContext.jsx";
import SearchResults from "./pages/search-results.jsx";
import AllProduct from "./pages/all.jsx";
import WelcomePage from "./pages/welcome-page.jsx";
import CustomizationPage from "./pages/Customised.jsx";
// import FloatingWhatsAppIcon from "./pages/Whatsapp";
import ScrollToTop from "./pages/ScrollToTop.jsx";

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop/>
        
        <Header />
        <Routes>
          <Route path="/" element={<AllProduct/>} />
       
          {/* <Route path="/silver-coins" element={<ProductListing/>} /> */}
          {/* <Route path="/all-product" element={<AllProduct/>} /> */}
          <Route path="/vel-kada" element={<Velkada/>} />
          {/* <Route path="/gold-finish-kada" element={<Goldkada/>} /> */}
          <Route path="/custom" element={<JewelleryCollection/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/track-order" element={<OrderTrackingForm/>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          
          <Route path="/category/women" element={<WomensJewelry />} />
          <Route path="/category/men" element={<MensJewelry />} />
          {/* <Route path="/category/pure-silver-god-idol" element={<PureSilverGodIdol />} /> */}
          <Route path="/category/kids" element={<KidsProductListing />} />
          <Route path="/category/rings" element={<CoupleRingsProductPage />} />
          <Route path="/category/pendants" element={<PendantsProductPage />} />

          <Route path="/womens" element={<WomensJewelry />} />
          <Route path="/mens" element={<MensJewelry />} />

          <Route path="/account" element={<AuthForms />} />
          <Route path="/cart" element={<CartPage />} />

          {/* women */}
          <Route path="/custom/women/rings" element={<WomensRingListing />} />
          <Route path="/custom/women/bracelets" element={<WomensBraceletListing />} />
          <Route path="/custom/women/Pendants" element={<WomensPendantListing />} />

          {/* men */} 
          <Route path="/custom/men/rings" element={<MensRingListing />} />
          <Route path="/custom/men/bracelets"element={<MensBraceletListing />} />
          <Route path="/custom/men/pendants"element={<MensPendantListing />} />

          {/* kids */}
          <Route path="/custom/kids/rings" element={<KidsRingListing />} />
          <Route path="/custom/kids/bracelets"element={<KidsBraceletListing />} />
          <Route path="/custom/kids/pendants"element={<KidsPendantListing />} />

          <Route path="/welcome"element={<WelcomePage />} />
          
          <Route path="/customize"element={<CustomizationPage />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;