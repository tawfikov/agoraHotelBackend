import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Agora Hotel API",
      version: "1.0.0",
      description: "API documentation for the Agora Hotel Admin Dashboard",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ['../modules/**/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true
    }
  }));

  console.log("Swagger running at: http://localhost:3000/api-docs");
};
