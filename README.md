# Green Park Technical Test Repository

This repository contains the technical test for Green Park, a condominium management company in Brazil.

## Challenge Summary

In the Green Park condominium in Brazil, two applications are used: one for gate access control and another for condominium fee management in the finance department. The condo manager noticed that people were using the gate access app more than the finance app. As a result, the manager decided to export the finance invoices and import them into the gate access app.

As an employee of the company responsible for the gate access app, your task is to create an endpoint that will receive invoice imports in .csv and .pdf formats and pass the invoices from the finance system to the gate access system, following all the instructions.

## Tasks

- [x] Activity 1
- [x] Activity 2
- [x] Activity 3
- [x] Activity 4
- [x] Activity 5

## API Routes

- **POST /api/bills/csv:** Endpoint to receive the .csv file. The file should be sent via form-data in the "file" field.
- **POST /api/bills/pdf:** Endpoint to receive the .pdf file. The file should be sent via form-data in the "file" field.
- **GET /api/bills:** Endpoint to retrieve bills with optional query parameters. The available query parameters are:
  - `name`: Filter by the recipient's name
  - `min_amount`: Filter by minimum bill amount
  - `max_amount`: Filter by maximum bill amount
  - `lot_id`: Filter by lot ID
  - `report`: Generate a report (if set to 1)

## Environment Variables

To run the application the following environment variables are required:

- `MYSQL_EXT_PORT`: Port for external connections to the MySQL server.

- `MYSQL_ROOT_PASSWORD`: Password for the MySQL root user.

- `MYSQL_ROOT_HOST`: Environment variable that allows specifying which IP addresses are allowed to connect to the database. Set it to '%' to allow connections from any IP address.

- `NODE_PORT`: Port on which the Node.js server will listen.

- `DB_USER`: Username for the MySQL database.

- `DB_PASSWORD`: Password for the MySQL database.

- `DB_NAME`: Name of the MySQL database.

- `DB_PORT`: Port for the MySQL database.

- `DB_HOST`: Hostname or IP address of the MySQL database server.

Please make sure to provide the appropriate values for these environment variables in your `.env` file or when running your application.


Example
```env
# Database Env
MYSQL_EXT_PORT=4001
MYSQL_ROOT_PASSWORD=my_secret_root_passw
MYSQL_ROOT_HOST='%'

# Node Env
NODE_PORT=4000
DB_USER=root
DB_PASSWORD=${MYSQL_ROOT_PASSWORD}
DB_NAME=green_park
DB_PORT=3306
DB_HOST=db

```

## Commands

To run the application locally without Docker, follow these steps:

1. Change to the project directory:
```
cd green-park
```
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm run dev
```

To run the application with Docker, use the following commands:

- Start:
```
docker compose -f docker-compose.dev.yml up -d
```

- Stop:
```
docker compose -f docker-compose.dev.yml down
```

