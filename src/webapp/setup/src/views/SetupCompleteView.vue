<!--
*				libreevent - SetupCompleteView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div class="wrapper">
        <div class="content">
            <img src="@/assets/logo.png" alt="libreevent logo" style="height: 30vh;">
            <h1>Setup complete!</h1>
            <p>Congratulations on finishing the setup of libreǝvent!</p>
            <p>Please restart the node.js application to have it load the actual user interface for libreevent and finish setup. 
                You may then log in at <a :href="windowURL" target="_blank">{{ windowURL }}</a>. 
                You may open that link now and then come back to that page once libreevent is restarted.</p>
            <p>In the admin panel, there are a few things you still need to change. You may find a list of all things 
                <a href="https://libreevent.janishutz.com/docs/setup/afterSetup" target="_blank">here</a></p>
            <div class="list-wrapper">
                <ul>
                    <li>Choose a payment gateway and set it up</li>
                    <li>Create a event location and an event</li>
                    <li>Create other admin accounts with less privileges</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
    ul {
        text-align: justify;
    }

    .list-wrapper {
        display: flex;
        justify-content: center;
    }
</style>

<script>
     export default {
        data () {
            return {
                windowURL: location.protocol + '//' + location.host +'/admin/login',
            }
        },
    };
</script>
