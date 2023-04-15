<template>
    <div>
        <h2>Home</h2>
        <p>Welcome to the admin panel!</p>
        <div class="bigButton-container">
            <router-link to="/admin/admin-accounts" class="bigButton">Admin-accounts</router-link>
            <router-link to="/admin/pages" class="bigButton">Pages</router-link>
            <router-link to="/admin/events" class="bigButton">Events</router-link>
            <router-link to="/admin/events" class="bigButton">Plugins</router-link>
            <router-link to="/admin/events" class="bigButton">Settings</router-link>
            <a href="https://myevent.janishutz.com/docs" class="bigButton" target="_blank">Documentation</a>
        </div>
    </div>
</template>

<style scoped>
    .bigButton-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    .bigButton {
        background-color: var( --accent-background );
        width: 40%;
        height: 30vh;
        border-color: black;
        margin: 0.02%;
        border-style: inset;
        color: var( --secondary-color );
        text-decoration: none;
        border-width: 2px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    .bigButton:hover {
        background-color: var( --accent-background-hover );
    }
</style>
