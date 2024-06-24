# Secure Tab Manager

A secure web app for managing tabs, creating knowledge bases, and communicating between tabs.

## Continuous Integration and Deployment

This project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/ci-cd.yml`.

### CI Process

On every push to the `main` and `develop` branches, and for all pull requests to these branches:

1. The code is checked out.
2. Node.js and MongoDB are set up.
3. Dependencies are installed.
4. Tests are run.

### CD Process

If all tests pass and the push is to the `main` branch:

1. The project is built.
2. The backend is deployed to Heroku.
3. The extension is deployed to the Chrome Web Store.

## Development

To set up the project for development:

1. Clone the repository
2. Run `npm run install:all` to install all dependencies
3. Run `npm run dev:backend` to start the backend in development mode
4. Run `npm run build:extension` to build the extension

## Testing

Run `npm test` to run all tests.

## Building

Run `npm run build` to build both the extension and the backend.

## Deployment

Deployment is handled automatically by the CI/CD pipeline. To deploy manually:

1. Ensure all tests pass by running `npm test`
2. Build the project with `npm run build`
3. Deploy the backend to your hosting service
4. Submit the extension to the Chrome Web Store

