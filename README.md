# FinTech Bot Document Retrieval

### 🚀 How to run

#### On development

- Install NodeJS

- Install node dependencies

```sh
npm install
```

- Start development server

```sh
npm run dev
```

#### On production

- Build Docker image

```sh
docker build -t chatbot-fe .
```

- Run Docker container

```sh
docker run --name chatbot-fe -d --rm -p 80:80 chatbot-fe
```
