import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgot-password";
import ConfirmAccount from "./pages/auth/confirm-account";
import ResetPassword from "./pages/auth/reset-password";
import VerifyMfa from "./pages/auth/verify-mfa";
import Home from "./pages/home";
import Settings from "./pages/settings";
import Session from "./pages/sessions";
import NotFound from "./pages/notFound";
import AppLayout from "./layout/AppLayout";
import BaseLayout from "./layout/BaseLayout";
import AuthRoute from "./routes/auth.route";
import PublicRoute from "./routes/public.route";

// Landing page components
import Hero from "./components/landingPage/Hero";
import Features from "./components/landingPage/Features";
import WhySection from "./components/landingPage/WhySection";
import DemoPreview from "./components/landingPage/DemoPreview";
import CallToAction from "./components/landingPage/CallToAction";
import Footer from "./components/landingPage/Footer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white">
              <Hero />
              <Features />
              <WhySection />
              <DemoPreview />
              <CallToAction />
              <Footer />
            </div>
          }
        />

        {/* Public Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<BaseLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="confirm-account" element={<ConfirmAccount />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="verify-mfa" element={<VerifyMfa />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthRoute />}>
          <Route element={<AppLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="settings" element={<Settings />} />
            <Route path="sessions" element={<Session />} />
          </Route>
        </Route>

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
