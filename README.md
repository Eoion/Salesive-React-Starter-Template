# Salesive Template

This template provides a preconfigured setup for building Salesive e-commerce applications with React, Vite, and Salesive configuration tools.

## Features

- React with HMR (Hot Module Replacement)
- Salesive configuration system for dynamic styling and branding
- React Router integration with route-based theming
- E-commerce product listing, detail, and checkout pages
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

## Getting Started

### Installation

To create a new Salesive project:

```bash
# Install the CLI globally (if not already installed)
npm install -g salesive-dev-tools

# Create a new project
salesive init
```

Follow the prompts to name your project and select your preferred package manager (npm, yarn, bun, or pnpm).

The CLI will set up everything you need automatically, including configuration and dependencies.

### Development

To start the development server with hot reloading:

```bash
# Using npm
npm run dev

# Using the Salesive CLI (recommended)
salesive dev
```

The `salesive dev` command provides additional features like automatic config file watching and server reloading when `salesive.config.json` changes.

## E-commerce Features

This template comes pre-configured with e-commerce functionality:

- **Home Page**: Product listing with category filters, sorting, and search
- **Product Detail Page**: Detailed product information with image gallery, variations, and add-to-cart functionality
- **Checkout Page**: Cart management, shipping information, and payment processing

### Customization

All e-commerce features are fully customizable through the `salesive.config.json` file:

```json
{
  "variables": {
    "products": {
      "items": [
        {
          "id": "prod-1",
          "name": "Product Name",
          "price": 99.99,
          "images": ["/path/to/image.jpg"]
        }
      ]
    }
  }
}
```

## Error Handling

This template includes comprehensive error handling with:

- Graceful error recovery
- Development-mode error details
- Production-mode user-friendly messages
- Automatic error reporting (configurable)

All errors are styled to match your brand colors from `salesive.config.json`.

## Build & Deployment

To build the application for production:

```bash
npm run build
```

The built application will be in the `dist` directory and can be deployed to any static hosting service.
