<!--
*				libreevent - SignupView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="login">
        <div class="login-app">
            <h1>Sign up</h1>
            <form>
                <label for="mail">Email</label><br>
                <input type="email" v-model="formData[ 'mail' ]" name="mail" id="mail" required><br><br>
                <label for="name">Full name</label><br>
                <input type="text" v-model="formData[ 'name' ]" name="name" id="name" required><br><br>
                <label for="password">Password</label><br>
                <input type="password" v-model="formData[ 'password' ]" name="password" id="password" required><br><br>
                <label for="password2">Confirm password</label><br>
                <input type="password" v-model="formData[ 'password2' ]" name="password2" id="password2" required>
            </form>
            <button @click="signup();" class="button">Sign up</button>
            <router-link to="/login" class="button">Log in instead</router-link>
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
            signup () {

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