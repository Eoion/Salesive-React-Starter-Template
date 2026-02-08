import React, { useState } from "react";
import { useSalesiveConfig } from "salesive-dev-tools";
import reactIcon from "../assets/react.svg";
import viteIcon from "../assets/vite.svg";
import salesiveIcon from "../assets/salesive.svg";
// Ensure we have a Github icon or similar for the footer if needed, otherwise just text.
// For now, I'll use text for the footer links.

function HomePage() {
    const appName = useSalesiveConfig("name");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("bun run cook");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-brand-primary selection:text-white flex flex-col font-sans">
            {/* Background Gradient Mesh - optional for depth */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/20 blur-[120px]" />
            </div>

            <main className="grow z-10 flex flex-col items-center justify-center w-full">
                <div className="w-full space-y-16 text-center px-4">
                    {/* Hero Section */}
                    <div className="space-y-8 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4 mt-10">
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg transition-transform hover:scale-105 cursor-default">
                            <span className="flex h-2 w-2 rounded-full bg-brand-secondary animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-300 tracking-wide">
                                Salesive Starter Template
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
                            Build{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-brand-secondary">
                                Salesive
                            </span>{" "}
                            <br className="hidden sm:block" />
                            Storefronts Faster
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 leading-relaxed">
                            {appName} is ready. A solid foundation configured
                            with Vite, React, and Tailwind CSS v4.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <a
                                href="https://docs.salesive.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-12 px-8 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold shadow-lg shadow-brand-primary/20 transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center"
                            >
                                Read Documentation
                            </a>
                            <div
                                onClick={handleCopy}
                                className="group h-12 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 flex items-center gap-3 cursor-pointer transition-all relative"
                                title="Deploy template to Salesive"
                            >
                                <code className="font-mono text-sm text-gray-300">
                                    bun run cook
                                </code>
                                <span
                                    className={`text-gray-500 group-hover:text-white transition-colors ${copied ? "text-green-400" : ""}`}
                                >
                                    {copied ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect
                                                x="9"
                                                y="9"
                                                width="13"
                                                height="13"
                                                rx="2"
                                                ry="2"
                                            ></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    )}
                                </span>
                                <span
                                    className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap pointer-events-none ${copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                >
                                    {copied ? "Copied!" : "Deploy to Salesive"}
                                </span>
                            </div>
                        </div>
                        <p className="tex-sm text-gray-500 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                            Or push to main branch to deploy automatically
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-backwards">
                        <FeatureCard
                            href="https://vitejs.dev"
                            icon={viteIcon}
                            title="Vite powered"
                            desc="Instant Server Start"
                            delay="0"
                        />
                        <FeatureCard
                            href="https://react.dev"
                            icon={reactIcon}
                            title="React 19"
                            desc="The library for web and native user interfaces"
                            delay="100"
                            imgClass="react"
                        />
                        <FeatureCard
                            href="https://docs.salesive.com"
                            icon={salesiveIcon}
                            title="Salesive"
                            desc="Complete Commerce Toolkit"
                            delay="200"
                            imgClass="salesive" // Keeping existing class for potential specific styles
                        />
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 text-center text-gray-500 text-sm z-10">
                <p>
                    © {new Date().getFullYear()} Salesive. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

function FeatureCard({ href, icon, title, desc, delay, imgClass = "" }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-primary/50 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-1 block text-left`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative z-10">
                <div className="w-12 h-12 mb-6 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                        src={icon}
                        className={`w-8 h-8 ${imgClass}`}
                        alt={`${title} logo`}
                    />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                    {title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {desc}
                </p>
            </div>
        </a>
    );
}

export default HomePage;
