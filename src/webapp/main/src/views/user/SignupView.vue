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
                <table>
                    <tr>
                        <td>
                            <label for="mail">Email</label><br>
                            <input type="email" v-model="formData[ 'mail' ]" name="mail" id="mail" required><br><br>
                        </td>
                        <td>
                            <label for="country">Country</label><br>
                            <input type="text" v-model="formData[ 'country' ]" name="country" id="country" required><br><br>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="firstName">First name</label><br>
                            <input type="text" v-model="formData[ 'firstName' ]" name="firstName" id="firstName" required><br><br>
                        </td>
                        <td>
                            <label for="name">Last name</label><br>
                            <input type="text" v-model="formData[ 'name' ]" name="name" id="name" required><br><br>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="password">Password</label><br>
                            <input type="password" v-model="formData[ 'password' ]" name="password" id="password" required><br><br>
                        </td>
                        <td>
                            <label for="password2">Confirm password</label><br>
                            <input type="password" v-model="formData[ 'password2' ]" name="password2" id="password2" required><br><br>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="news">Do you want to potentially get newsletter?</label><br>
                        </td>
                        <td>
                            <input type="checkbox" v-model="formData[ 'newsletter' ]" name="news" id="news"><br><br>
                        </td>
                    </tr>
                </table>
            </form>
            <notifications ref="notification" location="topright" size="bigger"></notifications>
            <button @click="signup();" class="button">Sign up</button>
            <router-link to="/login" class="button">Log in instead</router-link>
        </div>
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
            signup () {
                if ( !this.formData.mail ) {
                    this.$refs.notification.createNotification( 'An email address is required to sign up', 5, 'error', 'normal' );
                    return;
                }
                if ( !this.formData.password ) {
                    this.$refs.notification.createNotification( 'A password is required to sign up', 5, 'error', 'normal' );
                    return;
                }
                if ( !this.formData.password2 ) {
                    this.$refs.notification.createNotification( 'Please confirm your password using the "Confirm password field"', 5, 'error', 'normal' );
                    return;
                }
                if ( this.formData.password !== this.formData.password2 ) {
                    this.$refs.notification.createNotification( 'The passwords provided do not match. Please ensure they are the same', 5, 'error', 'normal' );
                    return;
                }
                if ( !this.formData.country ) {
                    this.$refs.notification.createNotification( 'Please provide the country you live in.', 5, 'error', 'normal' );
                    return;
                }
                if ( !this.formData.name && !this.formData.firstName ) {
                    this.$refs.notification.createNotification( 'Please provide your first and last name!', 5, 'error', 'normal' );
                    return;
                }
                let progress = this.$refs.notification.createNotification( 'Signing up...', 20, 'progress', 'normal' );
                let fetchOptions = {
                    method: 'post',
                    body: JSON.stringify( this.formData ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };
                fetch( localStorage.getItem( 'url' ) + '/user/signup', fetchOptions ).then( res => {
                    console.log( res );
                    res.text().then( status => {
                        if ( status === 'ok' ) {
                            this.$refs.notification.cancelNotification( progress );
                            this.$refs.notification.createNotification( 'Signed up successfully. We have sent you an email. Please confirm it to finish sign-up', 5, 'ok', 'normal' );
                            setTimeout( () => {
                                this.userStore.setUserAuth( true );
                                this.$router.push( sessionStorage.getItem( 'redirect' ) ?? '/account' );
                                sessionStorage.removeItem( 'redirect' );
                            }, 5000 );
                        } else if ( status === 'exists' ) {
                            this.$refs.notification.cancelNotification( progress );
                            this.$refs.notification.createNotification( 'An account with this email address already exists. Please log in using it.', 5, 'error', 'normal' );
                            this.$refs.notification.createNotification( 'If you do not remember your password, reset it!', 5, 'error', 'normal' );
                        } else {
                            console.log( status );
                        }
                    } );
                } );
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