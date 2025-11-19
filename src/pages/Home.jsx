import React, { useState } from "react";
import { useSalesiveConfig } from "salesive-dev-tools";
import reactIcon from "../assets/react.svg";
import viteIcon from "../assets/vite.svg";
import salesiveIcon from "../assets/salesive.svg";

function HomePage() {
    const [count, setCount] = useState(0);

    // Salesive config values
    const appName = useSalesiveConfig("variables.app.name");
    const appLogo = useSalesiveConfig("variables.app.logo");
    const brandPrimary = useSalesiveConfig("variables.css.color-brand-primary");
    const brandSecondary = useSalesiveConfig(
        "variables.css.color-brand-secondary"
    );
    const brandAccent = useSalesiveConfig("variables.css.color-brand-accent");

    return (
        <div className="w-full max-w-7xl mx-auto p-8 text-center">
            <div className="flex justify-center gap-8 mb-12">
                {/* Vite Logo */}
                <a
                    href="https://vitejs.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                >
                    <img
                        src={viteIcon}
                        className="h-32 p-6 will-change-[filter] transition-[filter] duration-300 logo"
                        alt="Vite logo"
                    />
                </a>

                {/* React Logo */}
                <a
                    href="https://react.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                >
                    <img
                        src={reactIcon}
                        className="h-32 p-6 will-change-[filter] transition-[filter] duration-300 logo react"
                        alt="React logo"
                    />
                </a>

                {/* Salesive Logo */}
                <a
                    href="https://salesive.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                >
                    <img
                        src={salesiveIcon}
                        className="h-32 p-6 will-change-[filter] transition-[filter] duration-300 logo salesive"
                        alt="Salesive logo"
                    />
                </a>
            </div>

            <h1 className="text-4xl font-bold mb-6">{appName}</h1>

            <div className="py-8">
                <button
                    onClick={() => setCount((count) => count + 1)}
                    className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium text-white cursor-pointer transition-colors duration-250 bg-brand-primary hover:border-brand-secondary focus:outline-none mb-4"
                >
                    count is {count}
                </button>
                <p className="mt-2">
                    Edit{" "}
                    <code className="font-mono text-gray-100 px-1 rounded">
                        src/pages/Home.jsx
                    </code>{" "}
                    and save to test HMR
                </p>
            </div>

            <p className="text-[#888] mb-12">
                Click on the logos to learn more
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div
                    className="border rounded-lg p-6 w-60 transition-transform duration-300 hover:-translate-y-1.5"
                    style={{ borderColor: brandSecondary }}
                >
                    <h3 className="text-xl font-semibold mt-0 mb-2">Vite</h3>
                    <p>Next Generation Frontend Tooling</p>
                </div>

                <div
                    className="border rounded-lg p-6 w-60 transition-transform duration-300 hover:-translate-y-1.5"
                    style={{ borderColor: brandPrimary }}
                >
                    <h3 className="text-xl font-semibold mt-0 mb-2">React</h3>
                    <p>A JavaScript library for building user interfaces</p>
                </div>

                <div
                    className="border rounded-lg p-6 w-60 transition-transform duration-300 hover:-translate-y-1.5"
                    style={{ borderColor: brandAccent }}
                >
                    <h3 className="text-xl font-semibold mt-0 mb-2">
                        Salesive
                    </h3>
                    <p>Build, launch, and scale commerce experience</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
