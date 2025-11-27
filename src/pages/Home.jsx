import React, { useState } from "react";
import { useSalesiveConfig } from "salesive-dev-tools";
import reactIcon from "../assets/react.svg";
import viteIcon from "../assets/vite.svg";
import salesiveIcon from "../assets/salesive.svg";

function HomePage() {
    const appName = useSalesiveConfig("name");

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
                    href="https://docs.salesive.com"
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

            <div className="py-8">
                <button className="rounded-lg border border-transparent px-5 py-2.5 text-base font-medium text-white cursor-pointer transition-colors duration-250 bg-brand-primary hover:border-brand-secondary focus:outline-none mb-4">
                    {appName}
                </button>
                <p className="mt-2">
                    Edit name in{" "}
                    <code className="font-mono text-gray-100 px-1 rounded">
                        salesive.config.json
                    </code>{" "}
                    and save to test HMR
                </p>
            </div>

            <p className="text-[#888] mb-12">
                Click on the logos to learn more
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="border rounded-lg p-6 w-60 transition-transform duration-300 hover:-translate-y-1.5">
                    <h3 className="text-xl font-semibold mt-0 mb-2">Vite</h3>
                    <p>Next Generation Frontend Tooling</p>
                </div>

                <div className="border rounded-lg p-6 w-60 transition-transform duration-300 hover:-translate-y-1.5">
                    <h3 className="text-xl font-semibold mt-0 mb-2">React</h3>
                    <p>A JavaScript library for building user interfaces</p>
                </div>

                <div className="border rounded-lg p-6 w-60 transition-transform duration-300 hover:-translate-y-1.5">
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
