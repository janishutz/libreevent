# How it works
This page gives you a somewhat detailed overview on how the system operates. Note that this page is not made with user-legibility in mind, as this page is oriented to give possible contributors an introduction to the project to help them getting started. Therefore we expect you to have quite decent understanding of the underlying programming languages and concepts.

# Programming languages
This project is written in a variety of different programming languages. First of all, the backend is written in Node.js with express.js routing. It also uses nodemysql to interact with the MySQL database, if the user chose to use one. For authentication, it uses express-session, for which a new session secret is generated whenever the server restarts to increase security.