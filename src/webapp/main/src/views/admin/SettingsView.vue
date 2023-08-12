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
        <!-- <h2>Setup check</h2> -->
        <!-- TODO: Maybe add -->
        <!-- TODO: call config check of payment + check if events are deployed -->
        <h2>Settings</h2>
        <p>Changing any of these settings requires a restart of libreevent.</p>
        <p>Currency codes used must be valid ISO 4217 codes. Read more on <a href="https://libreevent.janishutz.com/docs/admin-panel/settings#currency" target="_blank">this page</a> of the documentation <!-- https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes"--></p>
        <settings v-model:settings="settings"></settings>
        <table class="gateway-settings">
            <tr>
                <td style="width: 75%;">
                    Edit settings of the payment gateway
                </td>
                <td>
                    <span class="material-symbols-outlined" @click="showPaymentSettings();" style="cursor: pointer;" title="Edit settings for the payment gateway you selected">settings</span>
                </td>
            </tr>
        </table>
        <p>Detailed explanation of payment gateways can be found <a href="https://libreevent.janishutz.com/docs/payments" target="_blank">here</a>. You may install more payment gateway integrations in the plugins section. Only one may be used at any given time.</p>

        <div class="admin-settings">
            <h2>Admin Accounts</h2>
            <button @click="createAccount()">Create new account</button>
            <p>Before setting or editing permissions here, please read the corresponding section of the documentation <a href="https://libreevent.janishutz.com/docs/admin-panel/settings/admin-accounts#permissions" target="_blank">here</a>.
            <br>Usually, the permissions automatically set by the system on account creation should be appropriate.</p>
            <div v-for="account in adminAccounts" class="account" @click="showAccountSettings( account.username );" title="Edit permissions of this account (right click for more options)" @contextmenu="( e ) => { e.preventDefault(); openRightClickMenu( account.username, e ); }">
                <div class="location-name">
                    <h3>{{ account.username }}</h3>
                    <p>{{ account.email }}</p>
                </div>
            </div>
        </div>
        <rightClickMenu ref="rclk" @command="( command ) => { executeCommand( command ) }"></rightClickMenu>
        <popups ref="popup" size="big" @data="( data ) => { handlePopupReturns( data ); }"></popups>
    </div>
</template>

<script>
    import settings from '@/components/settings/settings.vue';
    import popups from '@/components/notifications/popups.vue';
    import rightClickMenu from '@/components/settings/rightClickMenu.vue';

    export default {
        name: 'adminSettingsView',
        components: {
            settings,
            popups,
            rightClickMenu,
        },
        data () {
            return {
                adminAccounts: { 'janis': { 'username': 'janis', 'email': 'info@janishutz.com', 'permissions': [  ] }, 'admin': { 'username': 'admin', 'email': 'development@janishutz.com', 'permissions': [  ] } },
                currentlyOpenMenu: '',
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
                        'display': 'Require user to provide phone number?', 
                        'id': 'phoneNumberRequired', 
                        'tooltip':'With this toggle you may specify whether or not a user has to provide their phone number when purchasing something. (Keep GDPR in mind when processing data!)', 
                        'value': false,
                        'type': 'toggle',
                    },
                    'dobRequired': { 
                        'display': 'Require user to provide their birth date?', 
                        'id': 'dobRequired', 
                        'tooltip':'With this toggle you may specify whether or not a user has to provide their date of birth when purchasing something. (Keep GDPR in mind when processing data!)', 
                        'value': false,
                        'type': 'toggle',
                    },
                    'currency': { 
                        'display': 'Currency', 
                        'id': 'currency', 
                        'tooltip':'Specify a currency in which the prices are displayed to the customer. Defaults to USD. Please use valid currency codes.', 
                        'value': 'USD',
                        'type': 'text',
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
                                'displayName':'Payrexx',
                                'value': 'payrexx'
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
            },
            showPaymentSettings () {
                this.$refs.popup.openPopup( 'Payment gateway settings', {
                        'link': '/payments/settings',
                    }
                , 'iframe' );
            },
            createAccount() {
                this.$refs.popup.openPopup( 'Create new admin user', {
                    'pagesSettings': { 
                        'display': 'Modify pages',
                        'id': 'pagesSettings',
                        'tooltip':'With this setting you can choose one of the preset permissions for users. Account management is only allowed for the root user.', 
                        'value': 'eventManager',
                        'type': 'select',
                        'restrictions': {
                            'fullAccess': { 
                                'value': 'fullAccess',
                                'displayName': 'Full Access'
                            },
                            'eventManager': { 
                                'value': 'eventManager',
                                'displayName': 'Event Manager'
                            },
                            'entryControl': { 
                                'value': 'entryControl',
                                'displayName': 'Entry Control'
                            }
                        }
                    },
                    'username': { 
                        'display': 'Username', 
                        'id': 'username', 
                        'tooltip':'Add a username for this user', 
                        'value': '',
                        'type': 'text',
                    },
                    'email': { 
                        'display': 'Email', 
                        'id': 'email', 
                        'tooltip':'Add an email-address for this user', 
                        'value': '',
                        'type': 'text',
                    },
                }
            , 'settings' );
            },
            executeCommand( command ) {
                if ( command === 'openPermissions' ) {
                    this.showAccountSettings( this.currentlyOpenMenu );
                } else if ( command === 'deleteUser' ) {
                    this.$refs.popup.openPopup( 'Do you really want to delete the user ' + this.currentlyOpenMenu + '?', {}, 'confirm' );
                }
            },
            handlePopupReturns( data ) {
                console.log( data );
                // TODO: Delete user
                if ( data.status === 'cancel' ) {
                    console.log( 'user canceled' );
                    return;
                } else if ( data.status === 'settings' ) {
                    console.log( 'settings processing' )
                } else {
                    console.log( 'hi' );
                }
            },
            openRightClickMenu( id, event ) {
                this.$refs.rclk.openRightClickMenu( event, { 'edit': { 'command': 'openPermissions', 'symbol': 'edit', 'display': 'Edit permissions' }, 'delete': { 'command': 'deleteUser', 'symbol': 'delete', 'display': 'Delete User' } } )
                this.currentlyOpenMenu = id;
            }
        }
    };
    // TODO: Load gateways and settings in general from server.

</script>


<style scoped>

    .gateway-settings {
        width: 70%;
        text-align: justify;
        margin-left: 15%;
    }

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