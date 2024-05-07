import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`))