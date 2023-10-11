<!--
*				libreevent - BasicSetupView.vue
*
*	Created by Janis Hutz 08/23/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="wrapper">
        <div class="content">
            <h1>Basic Setup</h1>
            <p>To make setting up the database and email accounts easier, you can enter the required values below.</p>
            <p>You may find more infos about this part <a href="https://libreevent.janishutz.com/docs/setup/setup#basic-setup" target="_blank">here</a></p>

            <h2>General information</h2>
            <label for="name">Name of the website</label><br>
            <input type="text" name="name" id="name" v-model="formData.websiteName"><br>
            

            <h2>Database</h2>
            <p>A database is a piece of software that specializes in storing data. libreevent can use most SQL based databases as well as a custom JSON-based database. You are strongly encouraged to use a SQL based database, as they perform significantly better. Read more 
                <a href="https://libreevent.janishutz.com/docs/setup/installation#database" target="_blank">here</a>
            </p>
            <label for="dbType">Database type</label><br>
            <select name="dbType" id="dbType" v-model="formData.dbType">
                <option value="mysql">SQL-Database</option>
                <option value="json">JSON-Database</option>
            </select>
            <form v-if="formData.dbType === 'mysql'">
                <label for="host">Database host name (usually domain name or IP of webserver)</label><br>
                <input type="url" name="host" id="host" v-model="formData.db.host"><br>
                <label for="database">Database name</label><br>
                <input type="text" name="database" id="database" v-model="formData.db.database"><br>
                <label for="user">Database user</label><br>
                <input type="text" name="user" id="user" v-model="formData.db.user"><br>
                <label for="password">Password</label><br>
                <input type="password" name="password" id="password" v-model="formData.db.password"><br>
                <label for="port">Database port (default usually fine)</label><br>
                <input type="number" name="port" id="port" min="1" max="65535" v-model="formData.db.port"><br>
            </form>
            <h2>Email</h2>
            <p>An email address is required for libreevent to send out mails to users automatically, including their ticket and, in case Two-Factor-Authentication is enabled,
            a Two-Factor-Authentication email.</p>

            <h3>Account</h3>
            <p>Here you have to enter the connection details for an email account. Most webhosting plans come with email addresses, so you might as well create a new one. 
            Note that you can customize how the sender of the mail appears down below in the display section.</p>
            <form>
                <label for="host">SMTP Server</label><br>
                <input type="url" name="host" id="host" v-model="formData.email.host"><br>
                <label for="port">SMTP Port (default usually fine)</label><br>
                <input type="number" name="port" id="port" min="1" max="65535" v-model="formData.email.port"><br>
                <label for="user">Email account name</label><br>
                <input type="email" name="user" id="user" v-model="formData.email.user"><br>
                <label for="pass">Password</label><br>
                <input type="password" name="pass" id="pass" v-model="formData.email.pass"><br>
            </form>
            <h3>Display</h3>
            <p>Here you can adjust how the email sender appears to the customer. This also means, that the email address shown below might receive a response if
                a customer does not possess the ability to read, which might happen from time to time. All mails contain the information that one should not respond
                to them.
            </p>
            <form>
                <label for="display">Display name (what is shown to user in from field)</label><br>
                <input type="url" name="display" id="display" v-model="formData.display"><br>
                <label for="dpEmail">Email address to show</label><br>
                <input type="text" name="dpEmail" id="dpEmail" v-model="formData.dpEmail"><br>
            </form>
            <button @click="submit()" class="button">Continue</button>
        </div>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
    </div>
</template>

<style scoped>
    #dbType {
        margin-bottom: 5%;
    }
</style>

<script>
import { useBackendStore } from '@/stores/backendStore.js';
import { mapStores } from 'pinia';
import notifications from '../components/notifications.vue';

export default {
    components: {
        notifications,
    },
    data () {
        return {
            formData: {
                'dbType': 'mysql',
                'db': {
                    'port': 3306,
                },
                'email': {
                    'port': 587
                },
                'websiteName': 'libreevent',
            },
        };
    },
    computed: {
        ...mapStores( useBackendStore )
    },
    methods: {
        submit() {
            this.collectUrl();
            if ( this.formData.dbType === 'mysql' ) {
                if ( !this.formData.db.port || !this.formData.db.host || !this.formData.db.database || !this.formData.db.user || !this.formData.db.password ) {
                    this.$refs.notification.createNotification( 'Database settings are not complete!', 5, 'error', 'normal' );
                    return;
                }
            }
            if ( this.formData.email.port && this.formData.email.host && this.formData.email.user && this.formData.email.pass
                && this.formData.dpEmail && this.formData.display && this.formData.websiteName ) {
                this.formData.mailDisplay = this.formData.display + ' <' + this.formData.dpEmail + '>';
                let progressNot = this.$refs.notification.createNotification( 'Setting up...', 20, 'progress', 'normal' );
                const options = {
                    method: 'post',
                    body: JSON.stringify( this.formData ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };
                fetch( '/setup/saveBasicSettings', options ).then( res => {
                    if ( res.status === 200 ) {
                        this.$refs.notification.cancelNotification( progressNot );
                        this.$refs.notification.createNotification( 'Saved!', 5, 'ok', 'normal' );
                        setTimeout( () => {
                            this.continue();
                        }, 2000 );
                    } else {
                        this.$refs.notification.createNotification( 'Setup key incorrect!', 5, 'error', 'normal' );
                    }
                } );
            } else {
                this.$refs.notification.createNotification( 'Missing entries', 5, 'error', 'normal' );
                return;
            }
        },
        continue () {
            sessionStorage.setItem( 'basics', JSON.stringify( this.formData ) );
            this.backendStore.addVisitedSetupPages( 'root', true );
            this.$router.push( '/setup/root' );
        },
        collectUrl() {
            this.formData.yourDomain = location.protocol + '//' + location.host;
            this.formData.db.host = location.hostname;
        }
    },
    created () {
        if ( sessionStorage.getItem( 'basics' ) ) {
            this.formData = JSON.parse( sessionStorage.getItem( 'basics' ) );
        }
    }
};
</script>
