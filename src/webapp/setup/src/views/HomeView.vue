<!--
*				libreevent - HomeView.vue
*
*	Created by Janis Hutz 07/17/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="home">
        <img alt="Libreevent logo" src="../assets/logo.png">
        <h1>Welcome to libreǝvent!</h1>
        <p>Let's start the setup by entering the setup key below! You may define a setup key in the <i>setupkey.txt</i> file of libreevent. See <a href="https://libreevent.janishutz.com/docs/setup/installation" target="_blank">here</a> for more instructions</p>
        <form>
            <label for="key">Your setup key</label><br>
            <input type="text" v-model="formData[ 'token' ]" required name="key" id="key">
        </form>
        <button @click="setup();" class="button">Start setup</button>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
    </div>
</template>

<script>
    import notifications from '../components/notifications.vue';

    export default {
        data() {
            return {
                formData: {},
            }
        },
        components: {
            notifications,
        },
        methods: {
            setup () {
                const options = {
                    method: 'post',
                    body: JSON.stringify( this.formData ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };
                fetch( '/setup/start', options ).then( res => {
                    if ( res.status === 200 ) {
                        this.$router.push( '/setup' );
                    } else {
                        this.$refs.notification.createNotification( 'Setup key incorrect!', 5, 'error', 'normal' );
                    }
                } );
            }
        },
        created() {
            fetch( '/setup/getKeyStatus' ).then( res => {
                if ( res.status === 200 ) {
                    res.text().then( text => {
                        if ( text === 'ok' ) {
                            this.$router.push( '/setup' );
                        }
                    } );
                }
            } );
        }
    }
</script>

<style scoped>
    img {
        height: 40vh;
    }

    .home {
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    form {
        width: 50%;
    }
</style>