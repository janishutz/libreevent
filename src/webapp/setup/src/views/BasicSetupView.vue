<!--
*				libreevent - BasicSetupView.vue
*
*	Created by Janis Hutz 08/23/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h1>Basic Setup</h1>
        <p>To make setting up the database and email accounts easier, you can enter the required values below.</p>
        <p>You may find more infos about this part <a href="https://libreevent.janishutz.com/docs/setup/setup#basic-setup" target="_blank">here</a></p>
        <h2>Database</h2>
        <p>A database is a piece of software that specializes in storing data. libreevent can use most SQL based databases as well as a custom JSON-based database. You are strongly encouraged to use a SQL based database, as they perform significantly better. Read more 
            <a href="https://libreevent.janishutz.com/docs/setup/installation#database">here</a>
        </p>
        <form>
            <label for="host">Database host name</label><br>
            <input type="url" name="host" id="host"><br>
            <label for="database">Database name</label><br>
            <input type="text" name="database" id="database"><br>
            <label for="user">Database user</label><br>
            <input type="text" name="user" id="user"><br>
            <label for="password">Password</label><br>
            <input type="password" name="password" id="password"><br>
            <label for="port">Database port (default usually fine)</label><br>
            <input type="number" name="port" id="port" min="1" value="3306" max="65535"><br>
        </form>
        <h2>Email</h2>
        <h3>Account</h3>
        <form>
            <label for="host">SMTP Server</label><br>
            <input type="url" name="host" id="host"><br>
            <label for="port">SMTP Port (default usually fine)</label><br>
            <input type="number" name="port" id="port" value="587" min="1" max="65535"><br>
            <label for="user">Email account name</label><br>
            <input type="email" name="user" id="user"><br>
            <label for="pass">Password</label><br>
            <input type="password" name="pass" id="pass"><br>
        </form>
        <h3>Display</h3>
        <form>
            <label for="display">Display name (what is shown to user in from field)</label><br>
            <input type="url" name="display" id="display"><br>
            <label for="dpEmail">Email address to show</label><br>
            <input type="text" name="dpEmail" id="dpEmail"><br>
        </form>
        <button @click="submit()">Continue</button>
    </div>
</template>

<script>
    import { useBackendStore } from '@/stores/backendStore.js';
    import { mapStores } from 'pinia';

    export default {
        data () {
            return {
                formData: {}
            }
        },
        computed: {
            ...mapStores( useBackendStore )
        },
        methods: {
            submit () {
                this.backendStore.addVisitedSetupPages( 'root', true );
                this.$router.push( '/setup/root' );
            }
        },
    };
</script>
