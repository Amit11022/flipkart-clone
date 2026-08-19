import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home          from "./pages/Home";
import Products      from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart          from "./pages/Cart";
import Profile       from "./pages/Profile";
import OrderHistory  from "./pages/OrderHistory";
import Checkout      from "./pages/Checkout";
import OrderSuccess  from "./pages/OrderSuccess";
import Toast         from "./components/Toast";


function App() {
    return (
        <BrowserRouter>
            {/* Global toast notifications */}
            <Toast />

            <Routes>

                {/* HOME */}
                <Route path="/"         element={<Home />} />

                {/* ALL PRODUCTS */}
                <Route path="/products" element={<Products />} />

                {/* SINGLE PRODUCT */}
                <Route path="/products/:id" element={<ProductDetails />} />

                {/* AUTH */}
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* PROTECTED CART */}
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

                {/* PROTECTED PROFILE */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* PROTECTED ORDER HISTORY */}
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <OrderHistory />
                        </ProtectedRoute>
                    }
                />

                {/* PROTECTED CHECKOUT */}
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                {/* ORDER SUCCESS */}
                <Route
                    path="/order-success"
                    element={
                        <ProtectedRoute>
                            <OrderSuccess />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}


export default App;