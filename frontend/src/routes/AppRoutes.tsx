/**
 * AppRoutes
 *
 * Central routes registry. Combines public (welcome + auth) and protected
 * routes into a single <Routes> tree used by the router.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { authRoutes } from './AuthRoutes';
import { protectedRoutes } from './ProtectedRoutes';
import Welcome from '../pages/Welcome/Welcome';
// import NotFound from '../pages/NotFound';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Welcome routes */}
            <Route path="/" element={<Welcome />} />

            {/* Auth routes */}
            {authRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}

            {/* Protected routes */}
            {protectedRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}

            {/* Not Found route */}
            {/* <Route path="/not-found" element={<NotFound />} /> */}

            {/* Fallback: any other unmatched path goes to NotFound */}
            {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    );
};

export default AppRoutes;