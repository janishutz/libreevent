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
                <input type="email" v-model="formData[ 'mail' ]" name="mail" id="mail" required class="input"><br><br>
                <label for="password">Password</label><br>
                <input type="password" v-model="formData[ 'password' ]" name="password" id="password" required class="input">
            </form>
            <button @click="login();" class="button">Log in</button>
            <router-link to="/signup" class="button">Sign up instead</router-link>
            <router-link to="/password-reset" class="button">Reset password</router-link>
        </div>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
    </div>
</template>

<script>
    import { useUserStore } from '@/stores/userStore';
    import { mapStores } from 'pinia';
    import notifications from '@/components/notifications/notifications.vue';

    export default {
        data () {
            return {
                formData: {}
            }
        },
        components: {
            notifications,
        },
        computed: {
            ...mapStores( useUserStore )
        },
        methods: {
            login () {
                if ( this.formData.mail ) { 
                    if ( this.formData.password ) {
                        let progress = this.$refs.notification.createNotification( 'Logging you in', 20, 'progress', 'normal' );
                        let fetchOptions = {
                            method: 'post',
                            body: JSON.stringify( this.formData ),
                            headers: {
                                'Content-Type': 'application/json',
                                'charset': 'utf-8'
                            }
                        };
                        fetch( localStorage.getItem( 'url' ) + '/user/login', fetchOptions ).then( res => {
                            res.json().then( json => {
                                if ( json.status === 'ok' ) {
                                    this.userStore.setUserAuth( true );
                                    this.$router.push( sessionStorage.getItem( 'redirect' ) ?? '/account' );
                                    sessionStorage.removeItem( 'redirect' );
                                } else if ( json.status === '2fa' ) {
                                    this.userStore.setUser2fa( true );
                                    this.$router.push( '/twoFactors' );
                                } else if ( json.status === '2fa+' ) {
                                    this.userStore.setUser2fa( true );
                                    sessionStorage.setItem( '2faCode', json.code );
                                    this.$router.push( '/twoFactors' );
                                } else {
                                    this.$refs.notification.cancelNotification( progress );
                                    this.$refs.notification.createNotification( 'The credentials you provided do not match our records.', 5, 'error', 'normal' );
                                }
                            } );
                        } );
                    } else {
                        this.$refs.notification.createNotification( 'A password is required to log in', 5, 'error', 'normal' );
                    }
                } else {
                    this.$refs.notification.createNotification( 'An email address is required to log in', 5, 'error', 'normal' );
                }
            },
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

    .input {
        width: 100%;
        padding: 10px;
        border-radius: 500px;
        border: solid 1px black;
        margin-top: 1%;
    }

    .button {
        padding: 5px 10px;
        margin-top: 2%;
    }

    nav {
        display: initial;
    }

    #missing-email, #missing-password, #credentials-wrong {
        display: none;
        margin-bottom: 20px;
    }
</style>