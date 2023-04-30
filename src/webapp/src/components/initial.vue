<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <div>
            <h1>Welcome to myevent!</h1>
            <p>Let's start the setup by entering the setup key below! You may define a setup key in the config file of myevent. See <a href="https://myevent.janishutz.com/docs/setup/setup" target="_blank">here</a> for more instructions</p>
            <form>
                <label for="key">Your setup key</label><br>
                <input type="text" v-model="formData[ 'key' ]" required name="key" id="key">
            </form>
            <button @click="setup();" class="button">Start setup</button>
        </div>
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
        width: 20%;
    }
</style>