import { Navigate, useLocation } from "react-router-dom";


// ========================================
// PROTECTED ROUTE
// ========================================
//
// This component protects pages that require
// the user to be logged in.
//
// Example:
//
// <ProtectedRoute>
//     <Cart />
// </ProtectedRoute>
//
// If a token exists:
//     → Show the requested page
//
// If no token exists:
//     → Redirect to Login
//
// ========================================

function ProtectedRoute({ children }) {

    // ========================================
    // CURRENT LOCATION
    // ========================================
    //
    // We use this to remember which page the
    // user originally wanted to visit.
    //
    // Example:
    //
    // User visits:
    // /cart
    //
    // Gets redirected to:
    // /login
    //
    // Later we can redirect them back to:
    // /cart
    //
    // ========================================

    const location = useLocation();


    // ========================================
    // GET TOKEN
    // ========================================

    const token =
        localStorage.getItem("token");


    // ========================================
    // USER NOT LOGGED IN
    // ========================================

    if (!token) {

        return (

            <Navigate

                to="/login"

                replace

                state={{
                    from: location
                }}

            />

        );

    }


    // ========================================
    // USER IS LOGGED IN
    // ========================================
    //
    // Render the protected component.
    //
    // Example:
    //
    // <Cart />
    //
    // ========================================

    return children;

}


export default ProtectedRoute;