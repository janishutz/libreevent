<!--
*				libreevent - PasswordResetView.vue
*
*	Created by Janis Hutz 08/10/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h1>Password Reset</h1>
        <p>Please enter the email address connected to your account to begin the password reset process.</p>
        <input type="email" v-model="email" class="input"><br>
        <button @click="reset()" class="button">Reset</button>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
    </div>
</template>

<style scoped>
    .input {
        width: 50%;
        padding: 10px;
        border-radius: 500px;
        border: solid 1px black;
        margin-top: 1%;
    }
</style>

<script>
    import notifications from '@/components/notifications/notifications.vue';

    export default {
        data () {
            return {
                email: '',
            }
        },
        components: {
            notifications,
        },
        methods: {
            reset() {
                const startNotification = this.$refs.notification.createNotification( 'Starting password reset', 20, 'progress', 'normal' );
                let fetchOptions = {
                    method: 'post',
                    body: JSON.stringify( {'email': this.email } ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };
                fetch( localStorage.getItem( 'url' ) + '/API/resetPW', fetchOptions ).then( res => {
                    if ( res.status !== 200 ) {
                        this.$refs.notification.cancelNotification( startNotification );
                        this.$refs.notification.createNotification( 'An account with this email address does not exist.', 5, 'error', 'normal' );
                    } else {
                        this.$refs.notification.cancelNotification( startNotification );
                        this.$refs.notification.createNotification( 'Password reset email sent. Please follow the instructions given there.', 30, 'ok', 'normal' );
                        setTimeout( () => {
                            location.href = '/login';
                        }, 10000 );
                    }
                } );
            }
        }
    }
</script>