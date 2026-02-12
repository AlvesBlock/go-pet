import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { Announcement } from "./components/Announcement";
import { useAppStore } from "./store/appStore";
import { LoadingState } from "./components/LoadingState";

const Landing = lazy(() => import("./pages/Landing"));
const TutorView = lazy(() => import("./pages/TutorView"));
const DriverView = lazy(() => import("./pages/DriverView"));
const AdminView = lazy(() => import("./pages/AdminView"));
const SupportView = lazy(() => import("./pages/SupportView"));
const DriverOnboarding = lazy(() => import("./pages/DriverOnboarding"));

function App() {
  const hydrated = useAppStore((state) => state.hydrated);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  const loadInitialData = useAppStore((state) => state.loadInitialData);

  useEffect(() => {
    if (!hydrated && !loading) {
      void loadInitialData();
    }
  }, [hydrated, loading, loadInitialData]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Announcement />
      <Navigation />
      <main className="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 lg:px-10">
        {!hydrated ? (
          <LoadingState
            message="Carregando dados do painel..."
            error={error}
            onRetry={!loading ? () => loadInitialData() : undefined}
          />
        ) : (
          <Suspense fallback={<LoadingState compact message="Carregando módulo..." />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/tutor" element={<TutorView />} />
              <Route path="/driver" element={<DriverView />} />
              <Route path="/driver/apply" element={<DriverOnboarding />} />
              <Route path="/admin" element={<AdminView />} />
              <Route path="/support" element={<SupportView />} />
            </Routes>
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
