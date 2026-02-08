import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SalesiveErrorBoundary } from "salesive-dev-tools";
import App from "./App";

// Import page components
import HomePage from "./pages/Home";

// Define routes configuration
const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <SalesiveErrorBoundary>
                <App />
            </SalesiveErrorBoundary>
        ),
        errorElement: (
            <SalesiveErrorBoundary>
                <HomePage />
            </SalesiveErrorBoundary>
        ),
        children: [
            {
                children: [
                    {
                        index: true, // This makes HomePage the default page for the App layout
                        element: <HomePage />,
                    },
                    {
                        path: "*", // Catch-all route
                        element: <HomePage />,
                    },
                ],
            },
        ],
    },
]);

// Router component that can be imported in main.jsx
export function Router() {
    return <RouterProvider router={router} />;
}

export default router;
