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
            <div class="parent">
                <div class="field">
                    <label for="mail">Email</label><br>
                    <input type="email" v-model="formData[ 'mail' ]" name="mail" id="mail" required @keyup="emailLiveChecker()" class="input"><br><br>
                    <p v-if="emailStatus" class="email-status">{{ emailStatus }}</p>
                </div>
                <div class="field">
                    <label for="country">Country</label><br>
                    <input type="text" v-model="formData[ 'country' ]" name="country" id="country" required class="input"><br><br>
                </div>
                <div class="field">
                    <label for="firstName">First name</label><br>
                    <input type="text" v-model="formData[ 'firstName' ]" name="firstName" id="firstName" required class="input"><br><br>
                </div>
                <div class="field">
                    <label for="name">Last name</label><br>
                    <input type="text" v-model="formData[ 'name' ]" name="name" id="name" required class="input"><br><br>
                </div>
                <div class="field">
                    <label for="password">Password</label><br>
                    <input type="password" v-model="formData[ 'password' ]" name="password" id="password" required class="input"><br><br>
                </div>
                <div class="field">
                    <label for="password2">Confirm password</label><br>
                    <input type="password" v-model="formData[ 'password2' ]" name="password2" id="password2" required class="input"><br><br>
                </div>
                <div class="field">
                    <label for="news">Do you want to potentially get newsletter?</label><br>
                </div>
                <div class="field">
                    <input type="checkbox" v-model="formData[ 'newsletter' ]" name="news" id="news"><br><br>
                </div>
            </div>

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
            formData: {},
            emailStatus: '',
        };
    },
    components: {
        notifications,
    },
    computed: {
        ...mapStores( useUserStore )
    },
    methods: {
        emailLiveChecker () {
            setTimeout( () => {
                if ( this.checkEmail() ) {
                    this.emailStatus = '';
                } else {
                    this.emailStatus = 'Invalid email address';
                }
            }, 100 );
        },
        checkEmail () {
            const mail = this.formData.mail ?? '';
            let stat = { 'atPos': 0, 'topLevelPos': 0 };
            for ( let l in mail ) {
                if ( stat[ 'atPos' ] > 0 ) {
                    if ( mail[ l ] === '@' ) {
                        return false;
                    } else if ( mail[ l ] === '.' ) {
                        if ( stat[ 'topLevelPos' ] > 0 ) {
                            if ( l > stat[ 'topLevelPos' ] + 2 ) {
                                stat[ 'topLevelPos' ] = parseInt( l );
                            } else { 
                                return false;
                            }
                        } else {
                            if ( l > stat[ 'atPos' ] + 2 ) {
                                stat[ 'topLevelPos' ] = parseInt( l );
                            } else {
                                return false;
                            }
                        }
                    } else if ( !( /[a-z]/.test( mail[ l ] ) || /[A-Z]/.test( mail[ l ] ) || /[1-9]/.test( mail[ l ] ) || mail[ l ] === '-' || mail[ l ] === '_' ) ) { 
                        return false; 
                    }
                } else {
                    if ( mail[ l ] === '@' ) {
                        if ( l > 2 ) {
                            stat[ 'atPos' ] = parseInt( l );
                        } else {
                            return false;
                        }
                    } else if ( !( /[a-z]/.test( mail[ l ] ) || /[A-Z]/.test( mail[ l ] ) || /[1-9]/.test( mail[ l ] ) || mail[ l ] === '.' || mail[ l ] === '-' || mail[ l ] == '_' ) ) {
                        return false;
                    }
                }
            }
            if ( mail.length > stat[ 'topLevelPos' ] + 2 && stat[ 'topLevelPos' ] > 0 && stat[ 'atPos' ] > 0 ) {
                return true;
            } else {
                return false;
            }
        },
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

            if ( !this.checkEmail() ) {
                this.$refs.notification.createNotification( 'This email address is not an email address', 5, 'error', 'normal' );
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
};
</script>

<style scoped>
    .parent {
        display: flex;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .field {
        width: 90%;
        margin-bottom: 2%;
    }

    .email-status {
        margin-top: -10px;
        color: red;
        font-style: italic;
        margin-bottom: 20px;
    }

    .login {
        width: 100%;
        display: flex;
    }

    .login-app {
        background-color: var( --background-color );
        margin-top: 0;
        width: 100%;
        height: 100%;
        padding: 5% 5%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .button {
        padding: 5px 10px;
        margin-top: 2%;
    }

    .input {
        width: 80%;
        padding: 10px;
        border-radius: 500px;
        border: solid 1px black;
        margin-top: 1%;
    }

    @media only screen and (min-width: 999px) {
        .login {
            background-color: green;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .login-app {
            width: 50vw;
            height: min-content;
            border-radius: 50px;
        }

        .field {
            width: 40%;
        }
    }
</style>