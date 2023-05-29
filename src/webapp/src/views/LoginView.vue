<!--
*				libreevent - LoginView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

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
    import { useUserStore } from '@/stores/userStore';
    import { mapStores } from 'pinia';

    export default {
        data () {
            return {
                formData: {}
            }
        },
        computed: {
            ...mapStores( useUserStore )
        },
        methods: {
            login () {
                this.userStore.setUserAuth( true );
                this.$router.push( sessionStorage.getItem( 'redirect' ) ? sessionStorage.getItem( 'redirect' ) : '/account' );
                sessionStorage.removeItem( 'redirect' );
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