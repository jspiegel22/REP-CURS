## Project Overview

*   **Type:** cursor_project_rules
*   **Description:** I want to build a trip advisor / booking.com application specific for cabo san lucas mexico. the goal is to offer the best resorts, hotels, villas, adventures, travel guides, bachelorette tips, luxury concierge, local events in one place. Some landing pages will be a form fill, some will be a buy now.
*   **Primary Goal:** To offer a one-stop, visually captivating travel platform that seamlessly blends direct booking and lead generation, providing travelers with curated experiences and empowering local businesses with effective management tools.

## Project Structure

### Framework-Specific Routing

*   **Directory Rules:**

    *   **React Router 6:** Use the structure within `src/routes/` to define route components following the `createBrowserRouter` or hook-based configuration.
    *   Example: "React Router 6" → `src/routes/` for route definitions and nested route management.

### Core Directories

*   **Versioned Structure:**

    *   `src/components`: Contains React components built with the latest best practices.
    *   `src/routes`: Houses the routing definitions adhering to React Router 6 conventions.
    *   `server`: Contains Node.js/Express backend logic including API endpoints and business logic.
    *   Example: `server/app.js` → Main Express application file; `src/routes/App.jsx` → Primary routing entry point.

### Key Files

*   **Stack-Versioned Patterns:**

    *   `src/routes/App.jsx`: Main React Router setup utilizing React Router 6 for navigation.
    *   `server/app.js`: Core Express server initialization and middleware setup.
    *   Example: Maintain clear separation where frontend files reside in `src/` and backend files reside in `server/`, following version-specific conventions.

## Tech Stack Rules

*   **Version Enforcement:**

    *   react@latest: Implement React Router 6 with functional components and hooks.
    *   node_js@latest: Use Express with middleware-based routing and proper error handling.
    *   postgresql: Follow best practices for relational database design and indexing.
    *   aws_s3: Use secure, versioned bucket naming and access control policies.
    *   jwt@latest & passport_js: Enforce secure token-based authentication and role-based access.
    *   stripe, paypal, apple_pay: Integrate with the latest APIs ensuring secure and compliant payment processing.
    *   google_calendar_api: Adhere to synchronization and rate limit strategies as per current API guidelines.

## PRD Compliance

*   **Non-Negotiable:**

    *   "The platform is all about building a one-stop travel platform focused on Cabo San Lucas, Mexico that brings together the best resorts, hotels, villas, adventures, and local events with both direct booking and form fills for leads":

        *   Enforce a high-quality, image-centric UI with mobile optimization.
        *   Ensure differentiated flows for immediate booking (buy now) versus lead capture (form fill).
        *   Adhere to secure payment processing and robust CRM integration as specified in the PRD.

## App Flow Integration

*   **Stack-Aligned Flow:**

    *   Example: Booking Flow → `src/routes/Booking.jsx` handles navigation from category selection to the payment process, integrating directly with backend APIs defined in the Express server.
    *   Example: CRM Integration → API endpoints (e.g., `server/api/crm.js`) capture and manage customer details, booking history, and segmentation logic, storing data in PostgreSQL.

## Best Practices

*   **react**

    *   Use a component-based architecture with centralized state management (via Redux or Context API).
    *   Optimize rendering performance through lazy loading and code-splitting.
    *   Adhere to design systems for consistency in UI across the application.

*   **node_js/express**

    *   Implement middleware for robust error handling, logging, and security checks.
    *   Structure the project using controllers, services, and routers to enforce separation of concerns.
    *   Leverage async/await for handling asynchronous operations cleanly.

*   **postgresql**

    *   Normalize schemas and use indexing to enhance query performance.
    *   Enforce strict access controls and backup strategies for data integrity.
    *   Regularly review and optimize queries to scale with increasing data volumes.

*   **aws_s3**

    *   Enforce security policies, including bucket versioning and proper access controls.
    *   Utilize a CDN for optimized asset delivery and load time reduction.
    *   Regularly audit permissions and usage to maintain compliance.

*   **jwt & passport_js**

    *   Use secure token storage practices and ensure encrypted transmissions.
    *   Regularly rotate secrets and enforce token expiry policies.
    *   Integrate role-based access controls to segregate administration and user privileges.

*   **Payment Gateways (stripe, paypal, apple_pay)**

    *   Follow latest API documentation and securely handle sensitive payment data.
    *   Validate transactions server-side and setup webhook listeners for status updates.
    *   Maintain comprehensive logging for audit trails and troubleshooting.

*   **google_calendar_api**

    *   Cache responses efficiently to manage API rate limits.
    *   Secure API keys using environmental variables and proper OAuth practices.
    *   Ensure real-time synchronization and handle event updates gracefully.

## Rules

*   Derive folder/file patterns **directly** from techStackDoc versions and avoid mixing different versioning conventions.
*   If using React Router 6: Enforce the use of the `src/routes/` directory with nested route files and avoid mixing in Next.js or alternative patterns.
*   Maintain strict separation between frontend (React) and backend (Express) directories.
*   Adhere to mobile-first design principles, ensuring that the layout is responsive and optimized for image-centric interfaces.
*   Enforce secure authentication and payment processing as defined in the tech stack best practices, ensuring compliance with industry standards.
*   Always synchronize the external calendar events with Google Calendar using proper API guidelines to maintain real-time accuracy.
