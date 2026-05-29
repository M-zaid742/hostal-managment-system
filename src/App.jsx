import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./layouts/UserLayout.jsx";
import Home from "./pages/Home.jsx";
import HostelDetails from "./pages/HostelDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OwnerSubscribe from "./pages/OwnerSubscribe.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import OwnerHostelForm from "./pages/OwnerHostelForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ChatBoard from "./components/ChatBoard.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LoadingProvider, useLoading } from "./context/LoadingContext.jsx";

function AppContent() {
  const { isLoading } = useLoading();

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <ChatBoard />
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hostels/:hostelId" element={<HostelDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/subscribe" element={<OwnerSubscribe />} />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/owner/dashboard"
            element={(
              <ProtectedRoute roles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/owner/hostels/new"
            element={(
              <ProtectedRoute roles={["owner"]}>
                <OwnerHostelForm />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/owner/hostels/:hostelId/edit"
            element={(
              <ProtectedRoute roles={["owner"]}>
                <OwnerHostelForm />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/dashboard"
            element={(
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <LoadingProvider>
          <AppContent />
        </LoadingProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
