<template>
    <div class="login">
        <div class="login-app">
            <h1>Log into your admin account</h1>
            <form>
                <label for="mail">Email address</label><br>
                <input type="email" v-model="formData[ 'mail' ]" name="mail" id="mail" required><br><br>
                <label for="password">Password</label><br>
                <input type="text" v-model="formData[ 'password' ]" name="password" id="password" required>
            </form>
            <button @click="login();" class="button">Log in</button>
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
                this.$router.push( '/admin' );
            }
        },
    }
</script>

<style scoped>
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
        min-height: fit-content;
        min-height: fit-content;
        padding: 5% 20%;
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

<style>
    nav {
        display: block;
    }
</style>