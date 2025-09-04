import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import DashboardRedirect from "./components/DashboardRedirect/DashboardRedirect";
import Events from "./pages/admin/Events/Events";
import AddEvent from "./pages/admin/Events/EventAdd_Edit/EventAdd_Edit";
import EventDetails from "./pages/admin/Events/EventDetails/EventDetails";
import MyTickets from "./pages/user/MyTickets";
import TicketDetails from "./pages/user/TicketDetails";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard/AnalyticsDashboard";
import EventInsights from "./pages/admin/Events/EventInsights/EventInsights";
import AdminDashboard from "@/pages/admin/AdminDashboard/AdminDashboard";
import Messages from "./pages/Messages/Messages";
import Notifications from "./pages/Notifications/Notifications";
import BookingTickets from "@/pages/admin/BookingTickets/BookingTickets";
import ManagePeople from "./pages/admin/ManagePeople/ManagePeople";
import EditPerson from "./pages/admin/ManagePeople/EditPerson/EditPerson";
import AddAdmin from "./pages/admin/ManagePeople/AddAdmin/AddAdmin";
import AnalyticsReports from "./pages/admin/AnalyticsReports/AnalyticsReports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardRedirect />} />
          <Route path="admin-main-page" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="events" element={<Events />}>
            <Route path="add-event" element={<AddEvent />} />
            <Route path="edit-event/:id" element={<AddEvent />} />
            <Route path="details/:id" element={<EventDetails />} />
            <Route path="insights/:eventId" element={<EventInsights />} />
          </Route>
          <Route path="attendees-insights" element={
            <ProtectedRoute requiredRole="admin">
              <AnalyticsDashboard />
            </ProtectedRoute>
          } />
          <Route path="tickets" element={<MyTickets />} />
          <Route path="tickets/details/:ticketId" element={<TicketDetails />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="booking-tickets" element={
            <ProtectedRoute requiredRole="admin">
              <BookingTickets />
            </ProtectedRoute>
          } />
          <Route path="manage-people" element={
            <ProtectedRoute requiredRole="admin">
              <ManagePeople />
            </ProtectedRoute>
          } />
          <Route path="manage-people/add-admin" element={
            <ProtectedRoute requiredRole="admin">
              <AddAdmin />
            </ProtectedRoute>
          } />
          <Route path="manage-people/edit/:type/:id" element={
            <ProtectedRoute requiredRole="admin">
              <EditPerson />
            </ProtectedRoute>
          } />
          <Route path="analytics-reports" element={
            <ProtectedRoute requiredRole="admin">
              <AnalyticsReports />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
