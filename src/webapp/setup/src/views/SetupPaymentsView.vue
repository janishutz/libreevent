<!--
*				libreevent - SetupPaymentsView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h1>Setting up payment methods</h1>
        <p>You may choose all of the below payment methods, but we recommend to only select one payment gateway for simplicity. Recommended: Either Stripe or Adyen. See the comparison of the different payment methods <a href="https://libreevent.janishutz.com/docs/payments" target="_blank">here</a></p>
        <p>You may find more infos about this part <a href="https://libreevent.janishutz.com/docs/setup/setup#payment-methods" target="_blank">here</a></p>
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
                this.backendStore.addVisitedSetupPages( 'tos', true );
                this.$router.push( '/setup/events' );
            }
        },
    };
</script>
