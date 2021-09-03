import http from "http";
import Application from "./application";

const server = http.createServer(Application.app);
server.listen(Application.port);

if (Application.production !== "true") {
  console.log(`Serveur démarré sur l'url http://localhost:${Application.port}`);
}
