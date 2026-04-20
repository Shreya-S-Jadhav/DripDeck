import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WardrobeProvider } from './context/WardrobeContext';
import { OutfitProvider } from './context/OutfitContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// React.lazy + Suspense — demonstrates lazy loading
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WardrobePage = lazy(() => import('./pages/WardrobePage'));
const OutfitBuilderPage = lazy(() => import('./pages/OutfitBuilderPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

function SuspenseWrap({ children }) {
  return <Suspense fallback={<LoadingSpinner text="Loading page..." />}>{children}</Suspense>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <WardrobeProvider>
              <OutfitProvider>
                <SuspenseWrap>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected routes inside Layout */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/wardrobe" element={<WardrobePage />} />
                      <Route path="/outfit-builder" element={<OutfitBuilderPage />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                    </Route>
                  </Routes>
                </SuspenseWrap>
              </OutfitProvider>
            </WardrobeProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
