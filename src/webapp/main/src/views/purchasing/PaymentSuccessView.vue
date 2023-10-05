<!-- eslint-disable no-undef -->
<!--
*				libreevent - GuestPurchaseView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="wrapper">
        <div class="content">
            <h1 style="font-size: 250%;">Thank you for your purchase!</h1>
            <p>The system is currently processing your order and you will be able to download your tickets within a moment's notice.</p>
            <p>You will receive an email with your tickets within the next few minutes</p>
            <a href="/tickets/tickets.pdf" class="submit" style="display: none; text-decoration: none;" id="manual-download" target="_blank">Download manually</a>
            <button onclick="if ( confirm( 'Do you really want to leave this page? You will not be able to download the tickets directly and instead you will have to download them from the email.' ) ) {
                location.href = '/' }" class="submit">Back to the home page</button>
        </div>
        <notifications ref="notification" location="bottomright" size="bigger"></notifications>
    </div>
</template>

<script>
import notifications from '@/components/notifications/notifications.vue';

export default {
    name: 'PaymentSuccessView',
    components: {
        notifications
    },
    methods: {

    },
    data() {
        return {};
    },
    created() {
        if ( window.EventSource ) {
            setTimeout( () => {
                let startNotification = this.$refs.notification.createNotification( 'Connecting to status service...', 20, 'progress', 'normal' );
                let source = new EventSource( localStorage.getItem( 'url' ) + '/payments/status', { withCredentials: true } );
                    
                let self = this;

                source.onmessage = ( e ) => {
                    if ( e.data === 'ready' ) {
                        self.$refs.notification.cancelNotification( startNotification );
                        self.$refs.notification.createNotification( 'Your tickets are ready! Starting download...', 10, 'progress', 'normal' );
                        localStorage.removeItem( 'cart' );
                        fetch( '/getAPI/reloadData' ).catch( () => {} );
                        setTimeout( () => {
                            open( '/tickets/tickets.pdf' );
                            source.close();
                        }, 500 );
                        setTimeout( () => {
                            $( '#manual-download' ).slideDown( 500 );
                        }, 2000 );
                    } else if ( e.data === 'paymentOk' ) {
                        self.$refs.notification.createNotification( 'Your payment has been marked as completed!', 5, 'ok', 'normal' );
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
                        self.$refs.notification.createNotification( 'Disconnected from status service', 20, 'info', 'normal' );
                    }
                }, false );
            }, 300 );
        } else {
            setTimeout( () => {
                this.$refs.notification.createNotification( 'Unsupported browser detected. Ticket generation might take longer!', 20, 'warning', 'normal' );
            }, 300 );
            // ping server every 5s to check if ticket ready
            this.serverPing = setInterval( () => {
                fetch( '/payments/status/ping' ).then( res => {
                    if ( res.status === 200 ) {
                        res.json().then( data => {
                            if ( data ) {
                                if ( data.status === 'ready' ) {
                                    open( '/tickets/get' );
                                } else if ( data.status === 'paymentOk' ) {
                                    this.$refs.notification.createNotification( 'Your payment has been marked as completed!', 5, 'ok', 'normal' );
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
    }
};
</script>

<style>
    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .content {
        width: 70%;
    }

    .small {
        font-size: 75%;
        color: rgb(158, 158, 158);
    }

    .submit {
        margin-top: 2%;
        background: linear-gradient(90deg, rgb(30, 36, 131), rgb(87, 66, 184), rgb(105, 115, 214), rgb(30, 36, 131), rgb(41, 128, 109), rgb(146, 50, 47));
        background-size: 300px;
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 3s;
        font-size: 75%;
        color: white;
    }

    .submit:hover {
        background-size: 200%;
        background-position: -100%;
    }
</style>