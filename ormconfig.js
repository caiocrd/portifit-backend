module.exports = [
  {
    "type" : "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "12345",
    "database": "portifit",
    "entities": [
      "./dist/src/modules/**/infra/typeorm/entities/*.js"
    ],
    "migrations": [
      "./src/shared/infra/typeorm/migrations/*.js"
    ],
    "cli": {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  }

]

