This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Infinite Solution Contractor and Client Dashboard

This repository contains the code for the Infinite Solution Contractor and client dashboard, where users can manage their quotes, orders, and generate reports. Follow the setup instructions below to get the application running on your local machine.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A modern web browser (e.g., Chrome, Firefox)
- [Git](https://git-scm.com/) (for cloning the repository)


## Setup Instructions

### 1. Clone the Repository
```bash
$ git clone https://github.com/Odunsih/infinite-solution.git
$ cd infinite-solution
```

### 2. Install Dependencies
Install the required dependencies using npm or yarn:

```bash
# Using npm
$ npm install

# OR using yarn
$ yarn install
```

### 3. Run the Development Server
Start the development server:

```bash
$ npm run dev

# OR using yarn
$ yarn dev
```

### 4. Open in Browser
Open your browser and navigate to:

```
http://localhost:3000
```

---

## Testing Instructions

### 1. Functional Testing
1. **Login:**
   - Enter valid credentials on the login page and verify redirection to the dashboard.
   - If invalid credentials are entered, ensure an error message is displayed.

2. **Quotes Management:**
   - Enter a valid Client ID to fetch quotes.
   - Ensure the correct quotes are displayed based on the Client ID.
   - Accept and reject quotes to validate functionality.

3. **Order Creation:**
   - Accept a quote and create an order.
   - Ensure the order details (start date, end date, total amount) are reflected accurately.

4. **Reports Generation:**
   - Navigate to the reports section and generate a report for a specified date range.
   - Verify the report is generated successfully and contains accurate data.

5. **Logout:**
   - Log out and ensure the session is cleared, with redirection to the login page.


   ### 2. API Integration Testing
- Use tools like Postman or cURL to test backend API endpoints for quotes, orders, and reports.
- Validate responses for various inputs and scenarios.

### 3. Debugging
- Open the browser console to check for errors during runtime.
- Monitor the terminal for server logs.

---

## Deployment

To deploy the application:

1. Build the production-ready app:

```bash
$ npm run build

# OR using yarn
$ yarn build
```

2. Start the production server:

```bash
$ npm start

# OR using yarn
$ yarn start
```

3. Deploy to your preferred hosting provider (e.g., Vercel, Netlify, onrender).

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request for review.