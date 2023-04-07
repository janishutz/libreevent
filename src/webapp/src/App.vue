<template>
    <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/tickets">Tickets</router-link> | 
        <router-link to="/login">Account</router-link>
    </nav>
    <router-view />
</template>

<style>
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    display: flex;
    flex-direction: column;
}

nav {
    padding: 30px;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
}

nav a.router-link-exact-active {
    color: #42b983;
}
</style>
