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
        <p>Detailed explanation of payment gateways can be found <a href="https://libreevent.janishutz.com/docs/payments" target="_blank">here</a>. You may install more payment gateway integrations in the plugins section.</p>

        <div class="admin-settings">
            <h2>Admin Accounts</h2>
            <p>Before setting or editing permissions here, please read the corresponding section of the documentation <a href="https://libreevent.janishutz.com/docs/admin-panel/settings/admin-accounts#permissions" target="_blank">here</a>.
            <br>Usually, the permissions automatically set by the system on account creation should be appropriate.</p>
            <div v-for="account in adminAccounts" class="account" @click="showAccountSettings( account.username );" title="Edit permissions of this account">
                <div class="location-name">
                    <h3>{{ account.username }}</h3>
                    <p>{{ account.email }}</p>
                </div>
            </div>
        </div>

        <popups ref="popup" size="big"></popups>
    </div>
</template>

<script>
    import settings from '@/components/settings/settings.vue';
    import popups from '@/components/notifications/popups.vue';

    export default {
        name: 'adminSettingsView',
        components: {
            settings,
            popups,
        },
        data () {
            return {
                adminAccounts: { 'janis': { 'username': 'janis', 'email': 'info@janishutz.com', 'permissions': [  ] }, 'admin': { 'username': 'admin', 'email': 'development@janishutz.com', 'permissions': [  ] } },
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
                    },
                    'addressRequired': { 
                        'display': 'Require user to provide address?', 
                        'id': 'addressRequired', 
                        'tooltip':'With this toggle you may specify whether or not a user has to provide their address when purchasing something. (Keep GDPR in mind when processing data!)', 
                        'value': false,
                        'type': 'toggle',
                    },
                    'phoneNumberRequired': { 
                        'display': 'Require user to provide address?', 
                        'id': 'phoneNumberRequired', 
                        'tooltip':'With this toggle you may specify whether or not a user has to provide their address when purchasing something. (Keep GDPR in mind when processing data!)', 
                        'value': false,
                        'type': 'toggle',
                    },
                    'paymentGateway': { 
                        'display': 'Select the payment gateway to use', 
                        'id': 'paymentGateway', 
                        'tooltip':'With this setting you may change which payment gateway you want to use. You will need to provide details below! If you are not sure what this setting means, please click the link below.', 
                        'value': 'stripe',
                        'type': 'select',
                        'restrictions': {
                            'stripe': { 
                                'displayName':'Stripe',
                                'value': 'stripe'
                            },
                            'adyen': { 
                                'displayName':'Adyen',
                                'value': 'adyen'
                            },
                        }
                    },
                }
            }
        },
        methods: {
            showAccountSettings ( account ) {
                this.$refs.popup.openPopup( 'Edit user permissions for ' + this.adminAccounts[ account ][ 'username' ], {
                    'pagesSettings': { 
                        'display': 'Modify pages', 
                        'id': 'pagesSettings', 
                        'tooltip':'Change this setting to allow or disallow the selected user to access and change any settings of pages like the start page.', 
                        'value': false,
                        'type': 'toggle',
                    },
                    'locationsSettings': { 
                        'display': 'Location settings and seat plans', 
                        'id': 'locationsSettings', 
                        'tooltip':'Change this setting to allow or disallow the selected user to modify, delete or create locations with their corresponding seat plans.', 
                        'value': false,
                        'type': 'toggle',
                    },
                    'plugins': { 
                        'display': 'Plugin management', 
                        'id': 'plugins', 
                        'tooltip':'Change this setting to allow or disallow the selected user to install or uninstall plugins. Some plugins might allow you to set extra permissions inside of their settings panels', 
                        'value': false,
                        'type': 'toggle',
                    },
                    'events': { 
                        'display': 'Event management', 
                        'id': 'events', 
                        'tooltip':'Change this setting to allow or disallow the selected user to install or uninstall plugins. Some plugins might allow you to set extra permissions inside of their settings panels', 
                        'value': false,
                        'type': 'toggle',
                    },
                    'entryControl': { 
                        'display': 'Entry control', 
                        'id': 'entryControl', 
                        'tooltip':'Change this setting to allow or disallow the selected user to execute entry control at the entrance to your event location.', 
                        'value': true,
                        'type': 'toggle',
                    },
                }
            , 'settings' );
            }
        }
    };
    // TODO: Load gateways and settings in general from server.

</script>


<style scoped>
    .admin-settings {
        text-align: justify;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .account {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: var( --primary-color );
        border-color: var( --primary-color );
        border-width: 1px;
        height: fit-content;
        border-style: solid;
        padding: 10px;
        transition: 0.4s;
        cursor: pointer;
        width: 60%;
        margin-bottom: 5px;
    }

    .account:hover {
        background-color: var( --hover-color );
        transition: 0.4s;
    }

    .location-name {
        margin-right: auto;
        max-width: 35%;
    }
</style>