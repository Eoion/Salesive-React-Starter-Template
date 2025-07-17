import { useSalesiveConfig } from "salesive-dev-tools";

const ContactPage = () => {
    const appName = useSalesiveConfig("variables.app.name");

    return (
        <div>
            <h1>Contact Page</h1>
        </div>
    );
};

export default ContactPage;
