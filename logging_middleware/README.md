# Logging Middleware

Reusable logging utility for the Afford Medical Technologies assessment.

## Features

- Sends logs to the evaluation logging service
- Supports backend stack logging
- Supports info, warn, error, debug and fatal levels

## Usage

```js
await Log(
  "backend",
  "info",
  "service",
  "Application started"
);