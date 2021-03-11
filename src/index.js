const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

let repositories = [];

function checkRepository(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find(r => r.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepository, (request, response) => {
  const { title, url, techs } = request.body;
  let { repository } = request;

  repository = {
    ...repository,
    title: title || repository.title,
    url: url || repository.url,
    techs: techs || repository.techs,
  };

  return response.json(repository);
});

app.delete("/repositories/:id", checkRepository, (request, response) => {
  const { repository } = request;

  repositories = repositories.filter(r => r.id !== repository.id);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepository, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
