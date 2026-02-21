/**
 * Authroutes
 *
 * Small registry of authentication-related public routes used by
 * `AppRoutes`.
 */
import Login from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyEmail from '../pages/VerifyEmail';
import ResendEmail from '../pages/ResendEmail';
import VerifyEmailNotice from '../pages/VerifyEmailNotice';

export const authRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/verify-email/:uid/:token', element: <VerifyEmail /> },
    { path: '/verify-email-notice', element: <VerifyEmailNotice /> },
    { path: '/resend-email', element: <ResendEmail /> }
];