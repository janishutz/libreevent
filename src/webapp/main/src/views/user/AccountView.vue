<template>
    <div>
        <h1>Account</h1>
        <p>Welcome, {{ accountData.first_name }} {{ accountData.name }}!</p>
        <button @click="resendMailConfirmation()" v-if="!accountData.mail_confirmed">Resend confirmation email</button>
        <table class="userData">
            <tr>
                <td>
                    Email
                </td>
                <td>
                    {{ accountData.email }}
                </td>
            </tr>
            <tr>
                <td>
                    Name
                </td>
                <td>
                    {{ accountData.first_name }} {{ accountData.name }}
                </td>
            </tr>
            <tr>
                <td>
                    Email notifications
                </td>
                <td>
                    <div v-if="accountData.marketing">Enabled</div>
                    <div v-else>Disabled</div>
                </td>
            </tr>
            <tr>
                <td>
                    Two-Factor Authentication
                </td>
                <td>
                    <div v-if="accountData.two_fa == 'enhanced'">Enhanced</div>
                    <div v-else-if="accountData.two_fa == 'standard'">Standard</div>
                    <div v-else>Disabled</div>
                </td>
            </tr>
        </table>
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
    .userData {
        width: 50%;
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
            }
        },
        components: {
            notifications,
            popups,
        },
        computed: {
            ...mapStores( useUserStore )
        },
        methods: {
            resendMailConfirmation() {
                fetch( localStorage.getItem( 'url' ) + '/user/resendEmail' ).then( res => {
                    if ( res.status === 200 ) {
                        this.$refs.notification.createNotification( 'Confirmation email sent.', 5, 'ok', 'normal' );
                    } else {
                        this.$refs.notification.createNotification( 'An error occurred whilst sending the confirmation mail. Please retry', 20, 'error', 'normal' );
                    }
                } );
            }
        },
        created () {
            // TODO: FUTURE Also get all orders of user (using join functions)
            fetch( localStorage.getItem( 'url' ) + '/user/details' ).then( res => {
                if ( res.status === 200 ) {
                    res.json().then( data => {
                        if ( data.status ) {
                            this.accountData = data.data;
                            if ( this.accountData.marketing ) {
                                this.accountData.marketing = true;
                            } else {
                                this.accountData.marketing = false;
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
    }
</script>