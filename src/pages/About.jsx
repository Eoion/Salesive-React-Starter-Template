import React from "react";
import { useSalesiveConfig } from "salesive-dev-tools";

const AboutPage = () => {
    const appName = useSalesiveConfig("variables.app.name");

    return (
        <div>
            <h1>About Page</h1>
        </div>
    );
};

export default AboutPage;
