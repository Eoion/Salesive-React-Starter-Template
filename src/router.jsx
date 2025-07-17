import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SalesiveErrorBoundary } from "salesive-dev-tools";
import App from "./App";

// Import page components
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import NotFoundPage from "./pages/NotFound";

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
                <NotFoundPage />
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
                        path: "about",
                        element: <AboutPage />,
                    },
                    {
                        path: "contact",
                        element: <ContactPage />,
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
