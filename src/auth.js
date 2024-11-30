import React from 'react';

const isAuthenticated = () => {
    // Check if the user is authenticated, e.g., by checking if a token exists
    return sessionStorage.getItem('token') !== null;
};

export { isAuthenticated };