<template>
    <div>
        <h3>Setting up payment methods</h3>
        <p>The root account is the most powerful account. Therefore, it should only be used if really necessary and should have a strong password. It also always requires Two Factor Authentication for added security. You may log into the root account by typing 'root' into the Email/Username field on the admin login screen.</p>
        <p>You may find more infos about this part <a href="https://myevent.janishutz.com/docs/setup/setup#root-account" target="_blank">here</a></p>
        <p>Password requirements:</p>
        <ul style="list-style: none;">
            <li>At least 15 characters long</li>
            <li>At least 2 special characters</li>
            <li>At least 2 numbers</li>
            <li>At least 2 lower and 2 upper case letters</li>
        </ul>
        <form>
            <label for="mail">Email address for 2FA</label><br>
            <input type="email" name="mail" id="mail"><br>
            <label for="password">Password</label><br>
            <input type="email" name="password" id="password"><br>
            <label for="password2">Confirm password</label><br>
            <input type="email" name="password2" id="password2">
        </form>
        <button @click="submit()">Continue</button>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                formData: {}
            }
        },
        methods: {
            submit () {
                
            }
        },
    };
</script>
