<template>
    <div class="login">
        <div class="login-app">
            <h1>Log in</h1>
            <form>
                <label for="mail">Email</label><br>
                <input type="email" v-model="formData[ 'mail' ]" name="mail" id="mail" required><br><br>
                <label for="password">Password</label><br>
                <input type="password" v-model="formData[ 'password' ]" name="password" id="password" required>
            </form>
            <button @click="login();" class="button">Log in</button>
            <router-link to="/signup" class="button">Sign up instead</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                formData: {}
            }
        },
        methods: {
            login () {

            }
        },
    }
</script>

<style scoped>

    /* TODO: Update colour to image */
    .login {
        background-color: green;
        width: 100%;
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0 1 auto;
    }

    .login-app {
        background-color: var( --background-color );
        width: 40%;
        height: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
    }

    .button {
        padding: 5px 10px;
        margin-top: 2%;
    }
</style>