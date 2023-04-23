<template>
    <div class="purchase">
        <h1>Purchase</h1>
        <h3>Personal information</h3>
        <div class="purchase-app">
            <div v-if="!isAuthenticated">
                <form>
                    <label for="email">Email address *</label><br>
                    <input type="email" name="email" id="email" required v-model="formData.email">
                </form>
                <router-link to="/login">Log in with an existing account</router-link>
            </div>
            <div v-else></div>
        </div>
    </div>
</template>

<style scoped>
    .purchase-app {
        text-align: justify;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ul {
        list-style: none;
        width: 80%;
    }

    .ticket {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: var( --primary-color );
        border-color: var( --primary-color );
        border-width: 1px;
        height: fit-content;
        border-style: solid;
        padding: 10px;
        transition: 0.4s;
    }

    .ticket:hover {
        background-color: var( --hover-color );
        transition: 0.4s;
    }

    .ticket-logo {
        height: 20vh;
        width: auto;
        margin-left: auto;
    }

    .ticket-name {
        margin-right: auto;
    }

    .ticket-info {
        margin-left: auto;
        margin-right: auto
    }
</style>

<script>
export default {
    name: 'PurchaseView',
    data () {
        return {
            settings: { 'accountRequired':true },
            isAuthenticated: false,
            formData: {}
        }
    }
};
</script>
