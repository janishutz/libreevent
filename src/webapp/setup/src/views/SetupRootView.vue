<!--
*				libreevent - SetupRootView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="wrapper">
        <div class="content">
            <h1>Root account</h1>
            <p>The root account is the most powerful account. Therefore, it should only be used if really necessary and should have a strong password. 
                It also always requires Two Factor Authentication for added security. 
                You may log into the root account by typing 'root' into the Email-Address field on the admin login screen.
                Therefore, the email used for the root account may also be used for an additional admin account.</p>
            <p>You may find more infos about this part <a href="https://libreevent.janishutz.com/docs/setup/setup#root-account" target="_blank">here</a></p>
            <p>By default (when the toggle "Enforce password requirements" below is enabled), libreevent forces you to follow the password requirements listed below.
                You may turn off those password requirements and use any password, but we strongly advice against this.</p>
            <ul style="list-style: none;">
                <li>At least 15 characters long</li>
                <li>At least 2 special characters</li>
                <li>At least 2 numbers</li>
                <li>At least 2 lower and 2 upper case letters</li>
            </ul>
            <form>
                <label for="mail">Email address for 2FA</label><br>
                <input type="email" name="mail" id="mail" v-model="formData.mail" @keyup="emailLiveChecker()"><br>
                <p v-if="emailStatus" class="email-status">{{ emailStatus }}</p>
                <label for="password">Password</label><br>
                <input type="password" name="password" id="password" v-model="formData.password"><br>
                <label for="password2">Confirm password</label><br>
                <input type="password" name="password2" id="password2" v-model="formData.password2"><br>
                <label for="pwCheck">Enforce password requirements (leaving this turned on is strongly recommended)</label><br>
                <label class="switch">
                    <input type="checkbox" v-model="passwordCheck">
                    <span class="slider round"></span>
                </label><br>
            </form>
            <button @click="submit()" class="button">Continue</button>
        </div>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
    </div>
</template>

<script>
    import { useBackendStore } from '@/stores/backendStore.js';
    import { mapStores } from 'pinia';
    import notifications from '../components/notifications.vue';

    const lookup = [ '@', '!', '.', ',', '?', '%', '&', '-', '_', ':', ';', '*', '§', '<', '>', '{', '}', '[', ']', '(', ')', '/', '#' ];
    // TODO: Also add this to user signup
    export default {
        data () {
            return {
                formData: {},
                passwordCheck: true,
                emailStatus: '',
            }
        },
        components: {
            notifications,
        },
        computed: {
            ...mapStores( useBackendStore )
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
                        } else if ( !( /[a-z]/.test( mail[ l ] ) || /[A-Z]/.test( mail[ l ] ) || /[1-9]/.test( mail[ l ] ) ) ) { 
                            return false 
                        }
                    } else {
                        if ( mail[ l ] === '@' ) {
                            if ( l > 2 ) {
                                stat[ 'atPos' ] = parseInt( l );
                            } else {
                                return false;
                            }
                        } else if ( !( /[a-z]/.test( mail[ l ] ) || /[A-Z]/.test( mail[ l ] ) || /[1-9]/.test( mail[ l ] ) || mail[ l ] === '.' ) ) {
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
            submit () {
                // TODO: Maybe require confirming email before proceeding
                if ( this.formData.mail && this.formData.password && this.formData.password2 ) {
                    if ( this.checkEmail() ) {
                        if ( this.formData.password == this.formData.password2 ) {
                            if ( this.passwordCheck ) {
                                let requirementsCount = { 'special': 0, 'numbers': 0, 'lower': 0, 'upper': 0, 'incorrect': '' };
                                const pw = this.formData.password;
                                for ( let l in pw ) {
                                    console.log( pw[ l ] );
                                    if ( /[a-z]/.test( pw[ l ] ) ) {
                                        requirementsCount[ 'lower' ] += 1;
                                    } else if ( /[A-Z]/.test( pw[ l ] ) ) {
                                        requirementsCount[ 'upper' ] += 1;
                                    } else if ( lookup.includes( pw[ l ] ) ) {
                                        requirementsCount[ 'special' ] += 1;
                                    } else if ( !isNaN( pw[ l ] * 1 ) ) {
                                        requirementsCount[ 'number' ] += 1;
                                    } else {
                                        console.log( 'incorrect letter' );
                                        requirementsCount[ 'incorrect' ] = pw[ l ];
                                        break;
                                    }
                                }
                                if ( requirementsCount[ 'incorrect' ] ) {
                                    this.$refs.notification.createNotification( `Character "${ requirementsCount[ 'incorrect' ] }" cannot be used for passwords`, 5, 'error', 'normal' );
                                } else {
                                    if ( pw.length > 14 ) {
                                        if ( requirementsCount[ 'lower' ] > 1 && requirementsCount[ 'upper' ] > 1 && requirementsCount[ 'special' ] > 1 && requirementsCount[ 'numbers' ] > 1 ) {
                                            this.proceed();
                                        } else {
                                            this.$refs.notification.createNotification( 'Your password does not fulfill the requirements', 5, 'error', 'normal' );
                                        }
                                    } else {
                                        this.$refs.notification.createNotification( 'Your password is not long enough', 5, 'error', 'normal' );
                                    }
                                }
                            } else {
                                this.proceed();
                            }
                        } else {
                            this.$refs.notification.createNotification( 'Passwords do not match', 10, 'error', 'normal' );
                        }
                    } else {
                        this.$refs.notification.createNotification( 'The email address you entered is not an email address', 10, 'error', 'normal' );
                    }
                } else {
                    this.$refs.notification.createNotification( 'One or more fields missing!', 10, 'error', 'normal' );
                }
            },
            proceed () {
                this.backendStore.addVisitedSetupPages( 'page', true );
                this.$router.push( 'page' );
            }
        },
    };
</script>


<style scoped>
.email-status {
    margin-top: -10px;
    color: red;
    font-style: italic;
    margin-bottom: 20px;
}

/* https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_switch */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input { 
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked + .slider {
    background-color: #2196F3;
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>