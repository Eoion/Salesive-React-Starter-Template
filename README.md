# Salesive React Starter Template

A powerful starter template for building Salesive e-commerce applications with React, Vite, and the Salesive development toolkit.

## Features

🎨 **Template Management**: Pre-configured Salesive template structure  
🔐 **API Integration**: Ready for Salesive Themes API deployment  
⚡ **React + Vite**: Fast development with Hot Module Replacement (HMR)  
🎯 **Dynamic Configuration**: Runtime configuration updates with `salesive-dev-tools`  
🔄 **React Router**: Pre-configured routing with route-based theming  
🛒 **E-commerce Ready**: Product listing, detail, and checkout pages  
✅ **Validation**: Built-in configuration validation  
🚀 **One-Command Deploy**: Package and deploy with `salesive cook`

## Integrated Tools

-   [salesive-dev-tools](https://www.npmjs.com/package/salesive-dev-tools) - CLI and configuration management
-   [salesive-api-axios](https://www.npmjs.com/package/salesive-api-axios) - Typed Axios client for Salesive Store API
-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) - Fast Refresh with Babel
-   React Router - Client-side routing

## Documentation & Resources

-   📚 [Official Salesive Docs](https://docs.salesive.com) - Complete platform documentation
-   🚀 [Quickstart Guide](https://docs.salesive.com/quickstart) - Get up and running quickly
-   🔌 [Store API Reference](https://docs.salesive.com/api-reference/introduction) - REST API for products, carts, orders, and more
-   🛠️ [Dev Tools Documentation](https://www.npmjs.com/package/salesive-dev-tools) - CLI commands and Vite plugin
-   📝 [Form Builder](https://form.salesive.com) - Visual configuration form creator

## Prerequisites

Before getting started, you'll need:

-   **Node.js 18+** and a package manager (npm, yarn, pnpm, or bun)
-   **Salesive Account** with shop credentials (shop ID and API key) for API integration
-   Basic knowledge of React and modern JavaScript

> **New to Salesive?** Visit the [Salesive Quickstart Guide](https://docs.salesive.com/quickstart) to set up your account and get your API credentials.

## Quick Start

### Installation

```bash
# Install the CLI globally
npm install -g salesive-dev-tools
# or
yarn global add salesive-dev-tools
# or
bun add -g salesive-dev-tools

# Create a new project from this template
salesive init --name my-project --template react-vite
```

### Development

```bash
# Start the development server
npm run dev
# or use the Salesive CLI (recommended)
salesive dev
```

The `salesive dev` command provides automatic config file watching and server reloading when `salesive.config.json` changes.

> **Note**: For detailed setup instructions, see the [Salesive Quickstart Guide](https://docs.salesive.com/quickstart).

## Salesive Store API Integration

This template is ready to integrate with the Salesive Store API for e-commerce functionality. The Store API provides:

-   🛍️ **Product Catalog**: Browse and search products with filtering and pagination
-   🛒 **Cart Management**: Add, update, and remove items from shopping carts
-   📦 **Order Processing**: Create and track orders with full order history
-   🚚 **Shipping**: Calculate shipping rates and manage delivery addresses
-   👤 **Authentication**: Guest sessions and authenticated user flows with JWT tokens
-   ❤️ **Wishlists**: Save products for later
-   📍 **Address Intelligence**: Smart address autocomplete and validation

### Using the API Client

Install the Salesive API Axios client:

```bash
npm install salesive-api-axios
```

Configure your environment variables (`.env`):

```bash
# Vite projects use VITE_ prefix
VITE_SALESIVE_SHOP_ID=your_shop_id
VITE_SALESIVE_API_KEY=your_api_key
```

Use the API modules in your components:

```jsx
import { useEffect, useState } from "react";
import { products, cart, auth } from "salesive-api-axios";

function ProductList() {
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const { data } = await products.list({ limit: 10 });
            setProductList(data.products);
        };
        loadProducts();
    }, []);

    return (
        <div>
            {productList.map((product) => (
                <div key={product.id}>{product.name}</div>
            ))}
        </div>
    );
}
```

**API Base URL**: `https://store.salesive.com/api/v1`

> **Learn More**: Check the [Store API documentation](https://docs.salesive.com/api-reference/introduction) for full API reference and authentication details.

## Configuration

The Salesive configuration system allows you to define global styling variables and application settings in `salesive.config.json` that are automatically injected into your application.

> **Documentation**: See [Configuration Management](https://docs.salesive.com/quickstart#step-2--configure-vite-and-api-client) for detailed setup.

### Sample Configuration

```json
{
    "name": "my-salesive-template",
    "version": "1.0.0",
    "description": "My awesome Salesive template",
    "author": "Your Name",
    "license": "MIT",
    "website": "https://example.com",
    "icon": "https://example.com/icon.png",
    "email": "you@example.com",
    "variables": {
        "color-brand-primary": "#0d65d9",
        "color-brand-primary-x": "#e6f6ff",
        "font-brand-space": "Space Grotesk",
        "app-name": "My Salesive App",
        "app-description": "A modern web application built with Salesive",
        "app-logo": "https://example.com/logo.png",
        "app-favicon": "https://example.com/favicon.ico"
    }
}
```

### What Gets Injected

The Salesive plugin automatically injects configuration into your HTML:

-   **Page Title**: From `variables.app-name`
-   **Meta Description**: From `variables.app-description`
-   **Favicon**: From `variables.app-favicon`
-   **CSS Variables**: All entries in `variables` as custom properties
-   **Global Object**: Available at `window.SALESIVE_CONFIG`

### Using the React Hook

```jsx
import { useSalesiveConfig } from "salesive-dev-tools";

function Header() {
    // Get specific variable values
    const appName = useSalesiveConfig("app-name");
    const brandColor = useSalesiveConfig("color-brand-primary");

    // Or get all variables
    const allVariables = useSalesiveConfig();

    return (
        <header style={{ backgroundColor: brandColor }}>
            <h1>{appName}</h1>
        </header>
    );
}
```

### Dynamic Configuration Updates

Update configuration at runtime and all components will automatically re-render:

```jsx
import { setSalesiveConfig, updateSalesiveConfig } from "salesive-dev-tools";

// Update a specific variable
setSalesiveConfig("app-name", "My Updated App Name");

// Update multiple variables at once (merges with existing config)
updateSalesiveConfig({
    variables: {
        "color-brand-primary": "#ff0000",
        "app-description": "Updated description",
    },
});

// Use a function to update based on previous state
updateSalesiveConfig((prevConfig) => ({
    ...prevConfig,
    variables: {
        ...prevConfig.variables,
        "app-name": `${prevConfig.variables["app-name"]} - Updated`,
    },
}));

// Replace entire config (no merging)
updateSalesiveConfig(newConfig, { merge: false });
```

### Helper Function (Non-Component Code)

```jsx
import { getSalesiveConfig } from "salesive-dev-tools";

// Get a specific variable value
const appName = getSalesiveConfig("app-name");

// Or get all variables
const allVariables = getSalesiveConfig();
```

## Salesive Form Builder

The Salesive Form Builder is a powerful tool that enables you to create dynamic configuration forms for collecting customization data from users of your template.

### What is the Form Builder?

The Form Builder allows you to create structured forms that collect configuration variables from users setting up your Salesive theme. These variables are then stored in `salesive.config.json` and can be accessed in your application using the hooks and functions described above.

### Use Cases

-   **Theme Customization**: Collect brand colors, logos, and visual preferences from users
-   **Content Configuration**: Gather page titles, descriptions, hero text, and other content elements
-   **Contact Information**: Capture business details like phone numbers, emails, and addresses
-   **Feature Toggles**: Enable or disable theme features based on user preferences

### How It Works

1. **Create Form Schema**: Build a JSON schema using `salesive.form.json` that defines your configuration form structure with pages, sections, and fields
2. **User Fills Form**: Users configuring your theme use the generated form to input their specific values (colors, text, images, etc.)
3. **Data Stored**: Form submissions are saved to `salesive.config.json` with all user-provided values
4. **Variables Injected**: Access the collected variables in your application using `useSalesiveConfig()` or `getSalesiveConfig()`

### Example Form Schema

```json
{
    "pages": [
        {
            "page": "home",
            "title": "Home Page",
            "sections": [
                {
                    "id": "hero",
                    "title": "Hero Section",
                    "fields": [
                        {
                            "id": "heroTitle",
                            "type": "text",
                            "label": "Hero Title",
                            "default": "Welcome to Our Store",
                            "required": true
                        },
                        {
                            "id": "heroImage",
                            "type": "media",
                            "mediaType": "image",
                            "label": "Hero Background",
                            "required": false
                        },
                        {
                            "id": "brandColor",
                            "type": "color",
                            "label": "Primary Brand Color",
                            "default": "#0d65d9",
                            "required": true
                        }
                    ]
                }
            ]
        }
    ]
}
```

When a user configures this template, they can enter their own hero title, upload a custom background image, and select their brand color. These values are then available in your application:

```jsx
function HeroSection() {
    const heroTitle = useSalesiveConfig("heroTitle");
    const heroImage = useSalesiveConfig("heroImage");
    const brandColor = useSalesiveConfig("brandColor");

    return (
        <section
            style={{
                backgroundImage: `url(${heroImage})`,
                backgroundColor: brandColor,
            }}
        >
            <h1>{heroTitle}</h1>
        </section>
    );
}
```

### Key Features

-   **Visual Form Builder**: Intuitive interface for building forms at [https://form.salesive.com](https://form.salesive.com)
-   **Live Preview**: See your form in real-time as you build it
-   **Multiple Field Types**: Text, media, color pickers, selects, toggles, and more
-   **Validation Support**: Mark fields as required and set constraints
-   **Organized Structure**: Use pages and sections to group related fields
-   **JSON Export**: Get clean, validated JSON ready for production
-   **Auto-Save**: Your work is preserved in browser local storage between sessions

### Creating Your Form

1. Visit the [Salesive Form Builder](https://form.salesive.com)
2. Design your form using the visual interface
3. Add pages, sections, and fields as needed
4. Export the JSON and save it as `salesive.form.json` in your project root
5. Deploy your template with `salesive cook` - the form configuration will be included automatically

> **Note**: The `salesive.form.json` file is optional but highly recommended for templates that require user customization.

> **Learn More**: Visit the [Form Builder documentation](https://form.salesive.com) for advanced form configuration options.

## React Router Integration

This template includes a pre-configured React Router setup with nested routes and automatic theme switching.

### Route Structure

```jsx
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "about", element: <AboutPage /> },
            { path: "contact", element: <ContactPage /> },
        ],
    },
]);
```

### Route-Based Theming

Automatically change themes based on the current route:

```jsx
import { Outlet, useLocation } from "react-router-dom";
import { setSalesiveConfig } from "salesive-dev-tools";
import { useEffect } from "react";

function ThemeManager() {
    const location = useLocation();

    useEffect(() => {
        // Update theme based on current route
        if (location.pathname.startsWith("/admin")) {
            setSalesiveConfig("color-brand-primary", "#2d3748");
        } else if (location.pathname.startsWith("/marketing")) {
            setSalesiveConfig("color-brand-primary", "#e53e3e");
        } else {
            setSalesiveConfig("color-brand-primary", "#0d65d9");
        }
    }, [location.pathname]);

    return <Outlet />;
}
```

## CLI Commands

The Salesive CLI provides powerful commands for managing your template. For complete CLI documentation, see the [Dev Tools package](https://www.npmjs.com/package/salesive-dev-tools).

### Authentication

Set up your Salesive API credentials for deploying templates:

```bash
# Set your Salesive API token
salesive auth set-token

# Check authentication status
salesive auth status

# Verify API key with server
salesive auth verify

# Clear your token if needed
salesive auth clear-token
```

### Validation

Validate your `salesive.config.json` before deployment:

```bash
# Validate current project
salesive validate

# Validate specific project
salesive validate --path ./my-project

# Validate specific config file
salesive validate --config ./custom-config.json

# Show verbose output
salesive validate --verbose
```

**Validation checks:**

-   Required fields: `name`, `version`, `description`
-   Name format: lowercase, no spaces (use hyphens)
-   Version format: semantic versioning (x.x.x)
-   Variables structure

### Template Deployment (Cook)

Package and deploy your template to the Salesive Themes API:

```bash
# Deploy template from current directory
salesive cook

# Deploy from a specific path
salesive cook --path ./my-template

# Use a custom config file
salesive cook --config ./custom-config.json

# Keep temporary files for debugging
salesive cook --keep-temp

# Show detailed error information
salesive cook --verbose
```

**What gets deployed:**

-   All template files (HTML, CSS, JS, images, etc.)
-   `salesive.config.json` (required)
-   `salesive.form.json` (optional, but recommended)

**Automatic exclusions:**

-   `node_modules/`
-   `.git/`
-   `.salesive-temp/`
-   `*.log`
-   `.DS_Store`

**Generate Form Configuration:**  
If you don't have a `salesive.form.json`, create one using the visual form builder at: [https://form.salesive.com](https://form.salesive.com)

## E-commerce Features

This template comes pre-configured with e-commerce functionality:

-   **Home Page**: Product listing with category filters, sorting, and search
-   **Product Detail Page**: Detailed product information with image gallery, variations, and add-to-cart functionality
-   **Checkout Page**: Cart management, shipping information, and payment processing

### Customization

E-commerce features can be customized through your configuration and component code.

## Vite Plugin Configuration

The template is pre-configured with the Salesive Vite plugin:

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { salesiveConfigPlugin } from "salesive-dev-tools";

export default defineConfig({
    plugins: [
        react(),
        salesiveConfigPlugin({
            // Optional: custom path to config file
            configPath: "./salesive.config.json",
        }),
    ],
});
```

**Note**: The plugin only runs during development (`vite dev`) and is automatically disabled for production builds.

## Error Handling

This template includes comprehensive error handling with:

-   Graceful error recovery
-   Development-mode error details
-   Production-mode user-friendly messages
-   Automatic error reporting (configurable)

All errors are styled to match your brand colors from `salesive.config.json`.

## Build & Deployment

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build locally
npm run preview
```

The built application will be in the `dist` directory and can be deployed to any static hosting service.

### Deploy Template to Salesive

```bash
# Set up authentication first
salesive auth set-token

# Validate your configuration
salesive validate

# Deploy your template
salesive cook
```

## Troubleshooting

### Common Issues

**Authentication Errors:**

```bash
# Verify your API key is valid
salesive auth verify

# Set a new API key if needed
salesive auth set-token
```

**Configuration Errors:**

```bash
# Validate your config file
salesive validate

# Check for common issues:
# - Name must be lowercase with no spaces
# - Version must follow x.x.x format
# - All required fields must be present
```

**Development Server Issues:**

```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

Use the `--verbose` flag with any CLI command to see detailed error information.

## Automatic Updates

The CLI automatically checks for updates once every 24 hours and notifies you when a new version is available:

```
┌──────────────────────────────────────────────────────────┐
│  Update available!  0.0.1 → 1.0.0                        │
│  Run npm install -g salesive-dev-tools to update         │
└──────────────────────────────────────────────────────────┘
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Salesive Platform Ecosystem

This template is part of the broader Salesive platform:

-   **Salesive Store API** - Headless commerce API for products, carts, orders, and more
-   **salesive-api-axios** - Typed API client with smart environment detection
-   **salesive-dev-tools** - CLI and Vite plugin for template development
-   **salesive-components** - React component library (coming soon)

Explore the full [Salesive documentation](https://docs.salesive.com/) to learn more about building commerce experiences.

## License

MIT
