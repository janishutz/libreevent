<template>
    <div>
        <h1>Account</h1>
        <p>Welcome, {{ accountData.first_name }} {{ accountData.name }}! <button @click="logout()">Log out</button></p>
        <button @click="resendMailConfirmation()" v-if="!accountData.mail_confirmed">Resend confirmation email</button>
        <div class="userData-wrapper">
            <table class="userData">
                <tr>
                    <td>
                        Email
                    </td>
                    <td>
                        <div v-if="!isEditingAccount">
                            {{ accountData.email }}
                        </div>
                        <div v-else>
                            <input type="email" name="email" id="email" v-model="accountData.email" @keyup="emailLiveChecker()"><br><br>
                            <p v-if="emailStatus" class="email-status">{{ emailStatus }}</p>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        Name
                    </td>
                    <td>
                        <div v-if="!isEditingAccount">
                            {{ accountData.first_name }} {{ accountData.name }}
                        </div>
                        <div v-else>
                            <input type="text" name="first_name" id="first_name" v-model="accountData.first_name">
                            <input type="text" name="name" id="name" v-model="accountData.name">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        Email notifications
                    </td>
                    <td>
                        <div v-if="!isEditingAccount">
                            <div v-if="accountData.marketing == 'true'">Enabled</div>
                            <div v-else>Disabled</div>
                        </div>
                        <select name="emailNotification" id="emailNotification" v-model="accountData.marketing" v-else>
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </td>
                </tr>
                <tr v-if="accountData.mail_confirmed && twoFASetting !== 'disable'">
                    <td>
                        Two-Factor Authentication
                    </td>
                    <td>
                        <div v-if="!isEditingAccount">
                            <div v-if="accountData.two_fa == 'enhanced'">Enhanced</div>
                            <div v-else-if="accountData.two_fa == 'simple'">Simple</div>
                            <div v-else>Disabled</div>
                        </div>
                        <select name="two_fa" id="two_fa" v-model="accountData.two_fa" v-else>
                            <option value="enhanced">Enhanced</option>
                            <option value="simple">Simple</option>
                            <option value="disabled" v-if="twoFASetting === 'allow'">Disabled</option>
                        </select>
                    </td>
                </tr>
            </table>
            <div>
                <button @click="toggleEditing">
                    <div v-if="!isEditingAccount">Edit</div>
                    <div v-else>Cancel</div>
                </button>
                <button @click="save()" v-if="isEditingAccount">Save</button>
            </div>
        </div>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
        <popups ref="popups" size="big" @data="data => { savePwd( data ) }"></popups>
    </div>
</template>


<style>
    nav {
        display: initial;
    }
</style>

<style scoped>
    .userData-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .userData {
        width: 50%;
    }

    .email-status {
        margin-top: -10px;
        color: red;
        font-style: italic;
        margin-bottom: 20px;
    }
</style>

<script>
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';
import notifications from '@/components/notifications/notifications.vue';
import popups from '@/components/notifications/popups.vue';

export default {
    data () {
        return {
            accountData: {},
            isEditingAccount: false,
            emailStatus: '',
            twoFASetting: 'allow',
        };
    },
    components: {
        notifications,
        popups,
    },
    computed: {
        ...mapStores( useUserStore )
    },
    methods: {
        logout() {
            fetch( '/user/logout' ).then( () => {
                this.$router.push( '/login' );
                this.userStore.setUserAuth( false );
            } );
        },
        toggleEditing () {
            if ( this.isEditingAccount ) {
                this.loadData();
            } else {
                this.emailLiveChecker();
            }
            this.isEditingAccount = !this.isEditingAccount;
        },
        save() {
            let fetchOptions = {
                method: 'post',
                body: JSON.stringify( this.accountData ),
                headers: {
                    'Content-Type': 'application/json',
                    'charset': 'utf-8'
                }
            };
            fetch( localStorage.getItem( 'url' ) + '/user/settings', fetchOptions ).then( res => {
                if ( res.status === 200 ) {
                    this.$refs.notification.createNotification( 'Settings updated!', 5, 'ok', 'normal' );
                    this.isEditingAccount = false;
                } else {
                    this.$refs.notification.createNotification( 'An error occurred whilst updating the settings. Please retry', 20, 'error', 'normal' );
                }
            } );
        },
        resendMailConfirmation() {
            fetch( localStorage.getItem( 'url' ) + '/user/resendEmail' ).then( res => {
                if ( res.status === 200 ) {
                    this.$refs.notification.createNotification( 'Confirmation email sent.', 5, 'ok', 'normal' );
                } else {
                    this.$refs.notification.createNotification( 'An error occurred whilst sending the confirmation mail. Please retry', 20, 'error', 'normal' );
                }
            } );
        },
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
            const mail = this.accountData.email ?? '';
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
        loadData () {
            // TODO: FUTURE Also get all orders of user (using join functions)
            fetch( localStorage.getItem( 'url' ) + '/settings/2fa' ).then( res => {
                if ( res.status === 200 ) {
                    res.text().then( text => {
                        this.twoFASetting = text;
                    } );
                }
            } );
            fetch( localStorage.getItem( 'url' ) + '/user/details' ).then( res => {
                if ( res.status === 200 ) {
                    res.json().then( data => {
                        if ( data.status ) {
                            this.accountData = data.data;
                            if ( !this.accountData.two_fa ) {
                                this.accountData.two_fa = 'disabled';
                            }
                            if ( !data.data.mail_confirmed ) {
                                setTimeout( () => {
                                    this.$refs.notification.createNotification( 'Your account is unverified. Please confirm your email using the link we have sent to your email!', 20, 'info', 'normal' );
                                }, 1000 );
                            }
                        } else {
                            this.userStore.setUserAuth( false );
                            this.userStore.setUser2fa( false );
                            this.$router.push( '/login' );
                        }
                    } );
                } else if ( res.status === 403 || res.status === 404 || res.status === 500 ) {
                    this.userStore.setUserAuth( false );
                    this.userStore.setUser2fa( false );
                    this.$router.push( '/login' );
                }
            } ).catch( err => {
                console.warn( '[ AccountView ] Loading failed with the following message: ' + err );
            } );
            if ( this.userStore.getUserTwoFACompliant ) {
                this.userStore.setUser2fa( false );
            }
        }
    },
    created () {
        this.loadData();
    }
};
</script>