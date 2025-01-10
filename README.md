# Payment Merchant Backend

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy .env.example to .env and update values
4. Run the server: `npm start`

## Development
- Start development server: `npm run dev`
- Run tests: `npm test`
- Run linting: `npm run lint`

## API Documentation
API documentation can be found in the `/docs` directory.

## Project Structure
```
payment-merchant-backend/
├── package.json
├── .env
├── .env.example
├── .gitignore
└── src/
    ├── config/
    │   └── constants.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   └── zohoInvoice.controller.js
    ├── middleware/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   ├── roleCheck.js
    │   └── validate.js
    ├── models/
    │   ├── user.model.js
    │   ├── userRole.model.js
    │   └── organization.model.js
    ├── routes/
    │   ├── index.js
    │   ├── auth.routes.js
    │   └── zohoInvoice.routes.js
    ├── services/
    │   └── zohoInvoiceAPI.js
    ├── utils/
    │   ├── errors.js
    │   ├── logger.js
    │   └── zohoAuth.js
    ├── validations/
    │   └── auth.validation.js
    └── index.js
```

# PaymentMerchant-BE
