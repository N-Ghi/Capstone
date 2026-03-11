import ProtectedRoute from "./ProtectedRoute";
import { Roles } from "../@types/auth.types";

import AdminDashboardPage from "../components/dashboards/Admin";
import GuideDashboardPage from "../components/dashboards/Guide";
import TouristDashboardPage from "../components/dashboards/Tourist";
import ExperienceFormPage from "../pages/ExperienceFormPage";
import ExperienceListPage from "../pages/ExperienceListPage";
import ExperienceDetailPage from "../pages/ExperienceDetail";
import ProfilePage from "../pages/ProfilePage";
import BookingListPage from "../pages/BookingListPage";
import BookingDetailsPage from "../pages/BookingDetailsPage";
import CommonProfilePage from "../pages/CommonProfilePage";
import PayoutsPage from "../pages/Payouts";
import PayoutsDetailsPage from "../pages/PayoutDetailsPage";

export const protectedRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Admin]}>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/guide",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide]}>
        <GuideDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/guide/payouts",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide]}>
        <PayoutsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/guide/payouts/:id",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide]}>
        <PayoutsDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tourist",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Tourist]}>
        <TouristDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/guide/experiences/create",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide]}>
        <ExperienceFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/experience/:id/",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide, Roles.Admin, Roles.Tourist]}>
        <ExperienceDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/experience/:id/edit",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide]}>
        <ExperienceFormPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/guide/experiences",
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide]}>
        <ExperienceListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/:role/profile/:id',
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide, Roles.Tourist, Roles.Admin]}>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/:id',
    element: (
      <ProtectedRoute allowedRoles={[Roles.Guide, Roles.Tourist, Roles.Admin]}>
        <CommonProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bookings',
    element: (
      <ProtectedRoute allowedRoles={[Roles.Tourist, Roles.Guide]}>
        <BookingListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/bookings/:id',
    element: (
      <ProtectedRoute allowedRoles={[Roles.Tourist, Roles.Admin]}>
        <BookingDetailsPage />
      </ProtectedRoute>
    ),
  },

];