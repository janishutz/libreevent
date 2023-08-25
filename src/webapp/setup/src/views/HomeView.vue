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
            <input type="text" v-model="formData[ 'key' ]" required name="key" id="key">
        </form>
        <button @click="setup();" class="button">Start setup</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                formData: {},
            }
        },
        methods: {
            setup () {
                this.$router.push( '/setup' );
            }
        },
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