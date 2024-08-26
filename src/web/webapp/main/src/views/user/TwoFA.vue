<template>
    <div id="twoFA">
        <h1>Two-Factor Authentication</h1>
        <p>We have sent you an email containing a link for Authentication.</p>
        <div class="code-container" v-if="code[ 1 ] != ''">
            <p>Open the link in the email and enter this code:</p>
            <div class="code">
                <div class="code-sub" id="code-part1">{{ code[ 1 ] }}</div>
                <div class="code-sub" id="code-part2">{{ code[ 2 ] }}</div>
            </div>
        </div>
        <notifications ref="notification" location="bottomright" size="bigger"></notifications>
    </div>
</template>

<script>
import notifications from '@/components/notifications/notifications.vue';
import { useUserStore } from '@/stores/userStore';
import { mapStores } from 'pinia';

export default {
    name: 'twoFA',
    components: {
        notifications
    },
    data () { 
        return {
            code: { '1': '', '2': '' },
            serverPing: null,
        };
    },
    computed: {
        ...mapStores( useUserStore ),
    },
    created () {
        if ( this.userStore.getUserTwoFACompliant ) {
            if ( window.EventSource ) {
                setTimeout( () => {
                    let startNotification = this.$refs.notification.createNotification( 'Connecting to status service', 20, 'progress', 'normal' );
                    let source = new EventSource( localStorage.getItem( 'url' ) + '/user/2fa/check', { withCredentials: true } );
                        
                    let self = this;

                    source.onmessage = ( e ) => {
                        if ( e.data === 'authenticated' ) {
                            self.userStore.setUserAuth( true );
                            self.$router.push( sessionStorage.getItem( 'redirect' ) ?? '/account' );
                        }
                    };

                    source.onopen = () => {
                        self.$refs.notification.createNotification( 'Connected to status service', 5, 'ok', 'normal' );
                        self.$refs.notification.cancelNotification( startNotification );
                    };
                        
                    source.addEventListener( 'error', function( e ) {
                        if ( e.eventPhase == EventSource.CLOSED ) source.close();

                        if ( e.target.readyState == EventSource.CLOSED ) {
                            self.$refs.notification.cancelNotification( startNotification );
                            self.$refs.notification.createNotification( 'Could not connect to status service', 5, 'error', 'normal' );
                        }
                    }, false );
                }, 300 );
            } else {
                setTimeout( () => {
                    this.$refs.notification.createNotification( 'Unsupported browser detected. Redirection might take longer to occur!', 20, 'warning', 'normal' );
                }, 300 );
                // ping server every 5s to check if logged in
                this.serverPing = setInterval( () => {
                    fetch( '/user/2fa/ping' ).then( res => {
                        if ( res.status === 200 ) {
                            res.json().then( data => {
                                if ( data ) {
                                    if ( data.status === 'ok' ) {
                                        this.userStore.setUserAuth( true );
                                        this.$router.push( sessionStorage.getItem( 'redirect' ) ?? '/account' );
                                    }
                                }
                            } );
                        } else {
                            console.error( 'Request failed' );
                            this.$refs.notification.createNotification( 'We are sorry, but an error occurred. You will not be redirected automatically', 300, 'error', 'normal' );
                        }
                    } ).catch( error => {
                        console.error( error );
                        this.$refs.notification.createNotification( 'We are sorry, but an error occurred. You will not be redirected automatically', 300, 'error', 'normal' );
                    } );
                }, 5000 );
            }
            let code = sessionStorage.getItem( '2faCode' ) ? sessionStorage.getItem( '2faCode' ) : '';
            this.code = { '1': code.slice( 0, 3 ), '2': code.substring( 3 ) };
        } else {
            if ( this.userStore.getUserAuthenticated ) { 
                this.$router.push( '/account' );
            } else {
                this.$router.push( '/login' );
            }
        }
    },
    unmounted() {
        clearInterval( this.serverPing );
    }
};
</script>

<style scoped>
    #twoFA, .code-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .code-container {
        width: fit-content;
        padding: 5% 8%;
        border: var( --primary-color ) solid 2px;
        border-radius: 10px;
        margin-top: 3%;
        background-color: var( --popup-color );
    }

    .code {
        background-color: var( --hover-color );
        padding: 7% 10%;
        margin-bottom: 0;
        width: fit-content;
        border-radius: 10px;
        font-size: 200%;
        font-family: monospace;
        display: block;
    }

    .code-sub {
        display: inline-block;
    }

    #code-part2 {
        margin-left: 7px;
    }
</style>