<template>
    <div id="twoFA">
        <h1>Two-Factor Authentication</h1>
        <p>We have sent you an email containing a link for Authentication.</p>
        <div class="code-container" v-if="code != ''">
            <p>Open the link in the email and enter this code:</p>
            <div class="code">
                <div class="code-sub" id="code-part1">{{ code[1] }}</div>
                <div class="code-sub" id="code-part2">{{ code[2] }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'twoFA',
        data () { 
            return {
                code: { '1': '', '2': '' }
            }
        },
        created () {
            let code = sessionStorage.getItem( '2faCode' ) ? sessionStorage.getItem( '2faCode' ) : '';
            this.code = { '1': code.slice( 0, 3 ), '2': code.substring( 3 ) };
        },
    }
</script>

<style scoped>
    #twoFA, .code-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .code-container {
        width: fit-content;
        padding: 5% 8%;
        border: var( --primary-color ) solid 2px;
        border-radius: 10px;
        margin-top: 3%;
        background-color: var( --popup-color );
    }

    .code {
        background-color: var( --hover-color );
        padding: 7% 10%;
        margin-bottom: 0;
        width: fit-content;
        border-radius: 10px;
        font-size: 200%;
        font-family: monospace;
        display: block;
    }

    .code-sub {
        display: inline-block;
    }

    #code-part2 {
        margin-left: 7px;
    }
</style>