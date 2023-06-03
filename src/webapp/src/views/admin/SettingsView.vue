<!--
*				libreevent - SettingsView.vue
*
*	Created by Janis Hutz 05/14/2023, Licensed under the GPL V3 License
*			https://janishutz.com, development@janishutz.com
*
*
-->

<template>
    <div>
        <h2>Settings</h2>
        <settings v-model:settings="settings"></settings>
    </div>
</template>

<script>
    import settings from '@/components/settings/settings.vue';

    export default {
        name: 'adminSettingsView',
        components: {
            settings,
        },
        data () {
            return {
                settings: { 
                    '2fa': { 
                        'display': 'Require Two-Factor-Authentication of user', 
                        'id': '2fa', 
                        'tooltip':'Control whether or not users are required to use Two-Factor-Authentication. Defaults to "User can decide", which is recommended', 
                        'value': 'always',
                        'type': 'select',
                        'restrictions': {
                            'always': { 
                                'displayName':'Always require',
                                'value': 'always'
                            },
                            'userDecided': { 
                                'displayName':'User can decide',
                                'value': 'userDecided'
                            },
                            'never': { 
                                'displayName':'Disable',
                                'value': 'never'
                            },
                        }
                    }
                }
            }
        },
    };
</script>
