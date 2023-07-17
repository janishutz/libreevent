<!--
*				libreevent - SetupCompleteView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <img src="@/assets/logo.png" alt="libreevent logo" style="height: 30vh;">
        <h1>Setup complete!</h1>
        <p>Congratulations on finishing the setup of libreǝvent!</p>
        <p>Please restart the node.js application to have it load the actual user interface for libreevent. You may then log in at <a :href="windowURL" target="_blank">{{ windowURL }}</a></p>
    </div>
</template>

<script>
     export default {
        data () {
            return {
                windowURL: location.protocol + '//' + location.host +'/admin/login',
            }
        },
    };
</script>
