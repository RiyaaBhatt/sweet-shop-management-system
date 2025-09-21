/**
 * @fileoverview Server entry point
 * This file initializes and starts the Express server with the configured
 * host and port settings. It serves as the main entry point for the application.
 */
import app from "./app";
const PORT = parseInt(process.env.PORT || "8000", 10);
const HOST = process.env.HOST || "localhost";
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
    console.log(`Swagger docs available at http://${HOST}:${PORT}/api-docs`);
});
