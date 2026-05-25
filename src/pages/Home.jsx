import React, { useState } from "react";
import { useSalesiveConfig } from "salesive-dev-tools";
import reactIcon from "../assets/react.svg";
import viteIcon from "../assets/vite.svg";
import salesiveIcon from "../assets/salesive.svg";

function HomePage() {
    const appName = useSalesiveConfig("name");
    const [copiedCommand, setCopiedCommand] = useState(false);
    const [copiedEnv, setCopiedEnv] = useState(false);
    const [copiedMcp, setCopiedMcp] = useState(false);

    const mcpSnippet = `{
  "mcpServers": {
    "salesive": {
      "url": "https://docs.salesive.com/mcp"
    }
  }
}`;

    const copy = (text, setter) => {
        navigator.clipboard.writeText(text);
        setter(true);
        setTimeout(() => setter(false), 2000);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
            {/* Subtle gradient blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/10 blur-[130px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-violet-600/8 blur-[130px]" />
            </div>

            <main className="grow flex flex-col items-center w-full px-4 py-16 z-10">
                <div className="w-full max-w-3xl space-y-8">

                    {/* Hero */}
                    <div className="text-center space-y-5">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                            <span className="text-sm font-medium text-gray-300 tracking-wide">
                                Salesive Starter Template
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                            Build{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-blue-400">
                                Salesive
                            </span>{" "}
                            <br className="hidden sm:block" />
                            Storefronts Faster
                        </h1>

                        <p className="max-w-xl mx-auto text-lg text-gray-400 leading-relaxed">
                            {appName} is ready. Configured with Vite, React, and Tailwind CSS v4.
                        </p>
                    </div>

                    {/* Setup Guide */}
                    <Card>
                        <CardHeader
                            icon={<ClockIcon />}
                            title="Quick Setup"
                            subtitle="Connect your Salesive shop in 3 steps"
                        />

                        <div className="divide-y divide-white/5">
                            {/* Step 1 */}
                            <Step number={1}>
                                <p className="text-sm font-semibold text-white">Sign in to your Salesive Dashboard</p>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    Go to{" "}
                                    <a
                                        href="https://dashboard.salesive.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-primary hover:underline font-medium"
                                    >
                                        dashboard.salesive.com
                                    </a>{" "}
                                    and log in to your account.
                                </p>
                            </Step>

                            {/* Step 2 */}
                            <Step number={2}>
                                <p className="text-sm font-semibold text-white">Navigate to Settings → Advanced</p>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    Open <span className="text-gray-300 font-medium">Settings</span> from the sidebar, select the <span className="text-gray-300 font-medium">Advanced</span> tab, and find your Shop ID under <span className="text-gray-300 font-medium">Shop Identifier</span>.
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <Crumb>Settings</Crumb>
                                    <ChevronRight />
                                    <Crumb>Advanced</Crumb>
                                    <ChevronRight />
                                    <Crumb highlight>Shop Identifier</Crumb>
                                </div>
                            </Step>

                            {/* Step 3 */}
                            <Step number={3}>
                                <p className="text-sm font-semibold text-white">
                                    Add your Shop ID to{" "}
                                    <code className="text-brand-primary font-mono text-[13px] bg-brand-primary/10 px-1.5 py-0.5 rounded">.env</code>
                                </p>
                                <p className="text-sm text-gray-400 mt-0.5">
                                    Paste your Shop ID into the <code className="font-mono text-xs bg-white/8 px-1 py-0.5 rounded text-gray-300">.env</code> file at the root of this project.
                                </p>
                                <CodeBlock
                                    className="mt-3"
                                    onCopy={() => copy("VITE_SALESIVE_SHOP_ID=your_shop_id_here", setCopiedEnv)}
                                    copied={copiedEnv}
                                >
                                    <span className="text-gray-500">VITE_SALESIVE_SHOP_ID</span>
                                    <span className="text-gray-500">=</span>
                                    <span className="text-emerald-400">your_shop_id_here</span>
                                </CodeBlock>
                            </Step>
                        </div>
                    </Card>

                    {/* MCP for AI */}
                    <Card>
                        <CardHeader
                            icon={<SparklesIcon />}
                            title="AI Integration via MCP"
                            subtitle="Connect AI assistants directly to your store"
                            badge="New"
                            docsHref="https://docs.salesive.com/mcp"
                        />

                        <div className="px-6 pb-6 pt-5 space-y-4">
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Salesive provides an{" "}
                                <span className="text-gray-300 font-medium">MCP (Model Context Protocol) server</span>
                                {" "}— giving AI assistants like Claude and Cursor direct access to Salesive documentation, API references, and code examples. Add the config below to your AI client.
                            </p>

                            {/* Capabilities */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                    "Search docs",
                                    "Query API refs",
                                    "Browse guides",
                                    "Find code examples",
                                    "Explore endpoints",
                                    "Read changelogs",
                                ].map((cap) => (
                                    <div key={cap} className="flex items-center gap-2 text-xs text-gray-400 bg-white/4 border border-white/6 rounded-lg px-3 py-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary flex-shrink-0" />
                                        {cap}
                                    </div>
                                ))}
                            </div>

                            {/* MCP config snippet */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Claude Desktop / Cursor config</p>
                                <div className="relative group bg-neutral-900 border border-white/8 rounded-xl overflow-hidden">
                                    <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
                                        {["bg-red-500/60","bg-yellow-500/60","bg-green-500/60"].map((c,i) => (
                                            <span key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                                        ))}
                                        <span className="text-xs text-gray-600 ml-2 font-mono">claude_desktop_config.json</span>
                                    </div>
                                    <pre className="text-xs font-mono px-4 py-4 overflow-x-auto leading-relaxed">
                                        <code>
                                            <span className="text-gray-600">{"{"}</span>{"\n"}
                                            {"  "}<span className="text-blue-400">"mcpServers"</span><span className="text-gray-600">: {"{"}</span>{"\n"}
                                            {"    "}<span className="text-blue-400">"salesive"</span><span className="text-gray-600">: {"{"}</span>{"\n"}
                                            {"      "}<span className="text-blue-400">"url"</span><span className="text-gray-600">: </span><span className="text-emerald-400">"https://docs.salesive.com/mcp"</span>{"\n"}
                                            {"    "}<span className="text-gray-600">{"}"}</span>{"\n"}
                                            {"  "}<span className="text-gray-600">{"}"}</span>{"\n"}
                                            <span className="text-gray-600">{"}"}</span>
                                        </code>
                                    </pre>
                                    <button
                                        onClick={() => copy(mcpSnippet, setCopiedMcp)}
                                        className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/8 hover:bg-white/14 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 hover:text-white transition-all"
                                    >
                                        {copiedMcp ? <><CheckIcon /><span className="text-emerald-400">Copied</span></> : <><CopyIcon /><span>Copy</span></>}
                                    </button>
                                </div>
                            </div>

                            <a
                                href="https://docs.salesive.com/mcp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-brand-primary hover:text-blue-400 font-medium transition-colors group"
                            >
                                Read the MCP docs
                                <svg className="group-hover:translate-x-0.5 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </Card>

                    {/* CTA Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href="https://docs.salesive.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-11 px-7 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-md shadow-brand-primary/20 transition-all hover:-translate-y-px active:translate-y-0 flex items-center"
                        >
                            Read Documentation
                        </a>
                        <div
                            onClick={() => copy("bun run cook", setCopiedCommand)}
                            className="group relative h-11 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/15 flex items-center gap-3 cursor-pointer transition-all"
                        >
                            <code className="font-mono text-sm text-gray-300">bun run cook</code>
                            <span className={`transition-colors ${copiedCommand ? "text-emerald-400" : "text-gray-600 group-hover:text-gray-400"}`}>
                                {copiedCommand ? <CheckIcon /> : <CopyIcon />}
                            </span>
                            <span className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap pointer-events-none ${copiedCommand ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                {copiedCommand ? "Copied!" : "Deploy to Salesive"}
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Or push to <code className="font-mono text-xs bg-white/6 px-1.5 py-0.5 rounded text-gray-400">main</code> to deploy automatically
                    </p>

                    {/* Tech Stack */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <TechCard href="https://vitejs.dev" icon={viteIcon} title="Vite" desc="Instant Server Start" />
                        <TechCard href="https://react.dev" icon={reactIcon} title="React 19" desc="UI library for the web" imgClass="react" />
                        <TechCard href="https://docs.salesive.com" icon={salesiveIcon} title="Salesive" desc="Complete Commerce Toolkit" imgClass="salesive" />
                    </div>
                </div>
            </main>

            <footer className="w-full py-6 text-center text-gray-600 text-sm border-t border-white/5 z-10">
                © {new Date().getFullYear()} Salesive. All rights reserved.
            </footer>
        </div>
    );
}

/* ── Shared primitives ── */

function Card({ children }) {
    return (
        <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden backdrop-blur-sm">
            {children}
        </div>
    );
}

function CardHeader({ icon, title, subtitle, badge, docsHref }) {
    return (
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/8 bg-white/3">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/15 rounded-lg text-brand-primary">{icon}</div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-white">{title}</h2>
                        {badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded-md">
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </div>
            {docsHref && (
                <a
                    href={docsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 flex-shrink-0"
                >
                    Docs
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                </a>
            )}
        </div>
    );
}

function Step({ number, children }) {
    return (
        <div className="flex gap-4 px-6 py-5">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {number}
            </div>
            <div className="space-y-1 w-full">{children}</div>
        </div>
    );
}

function Crumb({ children, highlight }) {
    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${highlight ? "bg-brand-primary/15 text-brand-primary" : "bg-white/8 text-gray-400"}`}>
            {children}
        </span>
    );
}

function CodeBlock({ children, onCopy, copied, className = "" }) {
    return (
        <div
            onClick={onCopy}
            className={`group flex items-center justify-between bg-neutral-900 border border-white/8 rounded-xl px-4 py-3 cursor-pointer hover:border-white/14 transition-colors ${className}`}
        >
            <code className="font-mono text-sm">{children}</code>
            <div className={`flex items-center gap-1.5 ml-4 flex-shrink-0 transition-colors ${copied ? "text-emerald-400" : "text-gray-600 group-hover:text-gray-400"}`}>
                {copied ? <><CheckIcon /><span className="text-xs font-medium">Copied</span></> : <><CopyIcon /></>}
            </div>
        </div>
    );
}

function TechCard({ href, icon, title, desc, imgClass = "" }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-xl bg-white/4 border border-white/8 hover:border-brand-primary/30 hover:bg-white/6 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-4"
        >
            <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-brand-primary/25 transition-colors">
                <img src={icon} className={`w-5 h-5 ${imgClass}`} alt={`${title} logo`} />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-brand-primary transition-colors">{title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
        </a>
    );
}

function ChevronRight() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
        </svg>
    );
}

function SparklesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z"/><path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z"/>
        </svg>
    );
}

export default HomePage;
