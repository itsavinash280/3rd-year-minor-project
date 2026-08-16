import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { VoiceAssistantProvider } from './context/VoiceAssistantContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { VoiceAssistantModal } from './components/voice/VoiceAssistantModal';

import { FarmerDashboard } from './pages/dashboard/FarmerDashboard';
import { BuyerDashboard } from './pages/dashboard/BuyerDashboard';
import { ExpertDashboard } from './pages/dashboard/ExpertDashboard';
import { TransportDashboard } from './pages/dashboard/TransportDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';

import { CropRecommendationPage } from './pages/ai/CropRecommendationPage';
import { DiseaseDetectionPage } from './pages/ai/DiseaseDetectionPage';
import { PricePredictionPage } from './pages/ai/PricePredictionPage';

import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { CartPage } from './pages/marketplace/CartPage';
import { CheckoutPage } from './pages/marketplace/CheckoutPage';

import { OrdersPage } from './pages/orders/OrdersPage';
import { GovernmentSchemesPage } from './pages/schemes/GovernmentSchemesPage';
import { WeatherPage } from './pages/weather/WeatherPage';
import { ExpertConsultationPage } from './pages/experts/ExpertConsultationPage';
import { FarmerProfilePage } from './pages/profile/FarmerProfilePage';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { ExpertLoginPage } from './pages/auth/ExpertLoginPage';
import { TransportLoginPage } from './pages/auth/TransportLoginPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <VoiceAssistantModal />

      <main className="flex-1 lg:pl-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <div className="lg:pl-64">
        <Footer />
      </div>
    </div>
  );
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/expert/login" element={<ExpertLoginPage />} />
      <Route path="/transport/login" element={<TransportLoginPage />} />

      {/* Main Pages */}
      <Route
        path="/"
        element={
          <AppLayout>
            {user?.role === 'BUYER' ? (
              <BuyerDashboard />
            ) : user?.role === 'EXPERT' ? (
              <ExpertDashboard />
            ) : user?.role === 'TRANSPORT' ? (
              <TransportDashboard />
            ) : user?.role === 'ADMIN' ? (
              <AdminDashboard />
            ) : (
              <FarmerDashboard />
            )}
          </AppLayout>
        }
      />

      <Route
        path="/buyer"
        element={
          <AppLayout>
            <BuyerDashboard />
          </AppLayout>
        }
      />

      <Route
        path="/expert"
        element={
          <AppLayout>
            <ExpertDashboard />
          </AppLayout>
        }
      />

      <Route
        path="/transport"
        element={
          <AppLayout>
            <TransportDashboard />
          </AppLayout>
        }
      />

      <Route
        path="/admin"
        element={
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        }
      />

      <Route
        path="/crop-recommendation"
        element={
          <AppLayout>
            <CropRecommendationPage />
          </AppLayout>
        }
      />

      <Route
        path="/disease-detection"
        element={
          <AppLayout>
            <DiseaseDetectionPage />
          </AppLayout>
        }
      />

      <Route
        path="/price-prediction"
        element={
          <AppLayout>
            <PricePredictionPage />
          </AppLayout>
        }
      />

      <Route
        path="/marketplace"
        element={
          <AppLayout>
            <MarketplacePage />
          </AppLayout>
        }
      />

      <Route
        path="/cart"
        element={
          <AppLayout>
            <CartPage />
          </AppLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <AppLayout>
            <CheckoutPage />
          </AppLayout>
        }
      />

      <Route
        path="/orders"
        element={
          <AppLayout>
            <OrdersPage />
          </AppLayout>
        }
      />

      <Route
        path="/schemes"
        element={
          <AppLayout>
            <GovernmentSchemesPage />
          </AppLayout>
        }
      />

      <Route
        path="/weather"
        element={
          <AppLayout>
            <WeatherPage />
          </AppLayout>
        }
      />

      <Route
        path="/expert-consultation"
        element={
          <AppLayout>
            <ExpertConsultationPage />
          </AppLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <AppLayout>
            <FarmerProfilePage />
          </AppLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <VoiceAssistantProvider>
          <Router>
            <AppContent />
          </Router>
        </VoiceAssistantProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
