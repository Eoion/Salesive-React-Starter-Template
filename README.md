# Salesive Template

This template provides a preconfigured setup for building Salesive applications with React, Vite, and Salesive configuration tools.

## Features

- React with HMR (Hot Module Replacement)
- Salesive configuration system for dynamic styling and branding
- React Router integration with route-based theming
- Automatic config injection from `salesive.config.json`

## Integrated Tools

- [salesive-dev-tools](https://github.com/salesive/salesive-dev-tools) for configuration management
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) for Fast Refresh with Babel

## Configuration

The Salesive configuration system allows you to define global styling variables and application settings in a single `salesive.config.json` file that is automatically injected into your application.

### Sample Configuration

```json
{
  "name": "salesive-project",
  "version": "0.1.0",
  "description": "A Salesive project",
  "variables": {
    "css": {
      "color-brand-primary": "#0d65d9",
      "color-brand-primary-x": "#e6f6ff",
      "font-brand-space": "Space Grotesk"
    },
    "app": {
      "name": "My Salesive App",
      "description": "A modern web application built with Salesive",
      "logo": "https://example.com/logo.png",
      "favicon": "https://example.com/favicon.ico"
    }
  }
}
```

### Accessing Configuration

```jsx
import { useSalesiveConfig } from 'salesive-dev-tools';

function Header() {
  const appName = useSalesiveConfig('variables.app.name');
  const brandColor = useSalesiveConfig('variables.css.color-brand-primary');
  
  return (
    <header style={{ backgroundColor: brandColor }}>
      <h1>{appName}</h1>
    </header>
  );
}
```

### Dynamic Configuration Updates

You can update the configuration at runtime:

```jsx
import { setSalesiveConfig } from 'salesive-dev-tools';

// Change a theme color
setSalesiveConfig('variables.css.color-brand-primary', '#ff0000');
```

## React Router Integration

This template includes a pre-configured React Router setup with nested routes and automatic theme switching based on routes.

```jsx
// Route structure
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> }
    ]
  }
]);
```

### Route-based Theming

You can automatically change themes based on the current route:

```jsx
import { useLocation } from 'react-router-dom';
import { setSalesiveConfig } from 'salesive-dev-tools';

function ThemeManager() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname.includes('about')) {
      setSalesiveConfig('variables.css.color-brand-primary', '#2d3748');
    } else {
      setSalesiveConfig('variables.css.color-brand-primary', '#0d65d9');
    }
  }, [location]);
  
  return <Outlet />;
}
```

## Development

To start the development server with hot reloading:

```bash
npm run dev
# or with the CLI tool
salesive dev
```

## Error Handling

This template uses a custom error boundary component from the salesive-dev-tools package that replaces the default Vite error handler:

```jsx
import { SalesiveErrorBoundary } from 'salesive-dev-tools';

function App() {
  return (
    <SalesiveErrorBoundary>
      <YourComponent />
    </SalesiveErrorBoundary>
  );
}
```

### Features

- Branded error display that matches your application's theme
- Detailed error information for developers
- User-friendly recovery options
- Integration with Salesive configuration system
- Optional error reporting to a custom endpoint

The error boundary automatically adapts to your theme colors defined in `salesive.config.json` and provides options for users to recover from errors without refreshing the page.
