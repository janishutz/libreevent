<template>
    <div class="login">
        <div class="login-app">
            <h1>Log into your account</h1>
            <form>
                <label for="username">Username</label><br>
                <input type="text" v-model="formData[ 'username' ]" name="username" id="username" required><br><br>
                <label for="username">Password</label><br>
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
        background-color: white;
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