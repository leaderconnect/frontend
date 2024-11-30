import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth'; // Import the isAuthenticated function

const PrivateRoute = ({ element: Element, ...rest }) => {
    return (
        <Route
            {...rest}
            element={isAuthenticated() ? <Element /> : <Navigate to="/login" replace />}
        />
    );
};

export default PrivateRoute;
