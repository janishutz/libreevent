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
        <!-- TODO: FUTURE add -->
        <!-- call config check of payment + check if events are deployed -->
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
        <button @click="save()">Save</button>
        <p>Detailed explanation of payment gateways can be found <a href="https://libreevent.janishutz.com/docs/payments" target="_blank">here</a>. Please note that you need to save the settings before you can edit settings of the payment gateway after changing it.</p>

        <div class="admin-settings">
            <h2>Admin Accounts</h2>
            <button @click="createAccount()">Create new account</button>
            <p style="margin-bottom: 0;">Before setting or editing permissions here, please read the corresponding section of the documentation <a href="https://libreevent.janishutz.com/docs/admin-panel/settings/admin-accounts#permissions" target="_blank">here</a>.</p>
            <p style="margin-top: 0;">Usually, the permissions automatically set by the system on account creation should be appropriate. (TIP: Right click for more options)</p>
            <div v-if="Object.keys( adminAccounts ).length > 0" class="account-wrapper">
                <div v-for="account in adminAccounts" class="account" @click="showAccountSettings( account.username );" title="Edit permissions of this account (right click for more options)" @contextmenu="( e ) => { e.preventDefault(); openRightClickMenu( account.username, e ); }">
                    <div class="location-name">
                        <h3>{{ account.username }}</h3>
                        <p>{{ account.email }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="account-wrapper">
                <p>No additional admin accounts configured yet.</p>
                <button @click="createAccount()">Create new account</button>
            </div>
        </div>
        <rightClickMenu ref="rclk" @command="( command ) => { executeCommand( command ) }"></rightClickMenu>
        <popups ref="popup" size="big" @data="( data ) => { handlePopupReturns( data ); }"></popups>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
    </div>
</template>

<script>
    import settings from '@/components/settings/settings.vue';
    import popups from '@/components/notifications/popups.vue';
    import rightClickMenu from '@/components/settings/rightClickMenu.vue';
    import notifications from '@/components/notifications/notifications.vue';

    export default {
        name: 'adminSettingsView',
        components: {
            settings,
            popups,
            rightClickMenu,
            notifications,
        },
        data () {
            return {
                adminAccounts: { 'janis': { 'username': 'janis', 'email': 'info@janishutz.com', 'permissions': [  ] }, 'admin': { 'username': 'admin', 'email': 'development@janishutz.com', 'permissions': [  ] } },
                currentlyOpenMenu: '',
                currentPopup: '',
                settings: { 
                    '2fa': { 
                        'display': 'Require Two-Factor-Authentication of user', 
                        'id': '2fa', 
                        'tooltip':'Control whether or not users are required to use Two-Factor-Authentication. Defaults to "User can decide", which is recommended', 
                        'value': 'enforce',
                        'type': 'select',
                        'restrictions': {
                            'enforce': { 
                                'displayName':'Always require',
                                'value': 'enforce'
                            },
                            'allow': { 
                                'displayName':'User can decide',
                                'value': 'allow'
                            },
                            'disable': { 
                                'displayName':'Disable',
                                'value': 'disable'
                            },
                        }
                    },
                    'currency': { 
                        'display': 'Currency', 
                        'id': 'currency', 
                        'tooltip':'Specify a currency in which the prices are displayed to the customer. Defaults to USD. Please use valid currency codes.', 
                        'value': 'USD',
                        'type': 'text',
                    },
                    'ticketTimeout': { 
                        'display': 'Ticket Timeout (s)', 
                        'id': 'ticketTimeout', 
                        'tooltip': 'Specify how long the user has to be inactive for their order to be canceled. Time is to be specified in seconds', 
                        'value': 900,
                        'type': 'number',
                        'restrictions': {
                            'min': 0,
                            'max': 10000,
                        }
                    },
                    'paymentGateway': { 
                        'display': 'Select the payment gateway to use', 
                        'id': 'paymentGateway', 
                        'tooltip':'With this setting you may change which payment gateway you want to use. You will need to provide details below! If you are not sure what this setting means, please click the link below.', 
                        'value': 'stripe',
                        'type': 'select',
                        'restrictions': {
                            'payrexx': { 
                                'displayName':'Payrexx',
                                'value': 'payrexx'
                            },
                            'stripe': { 
                                'displayName':'Stripe',
                                'value': 'stripe'
                            },
                        }
                    },
                    // 'addressRequired': { 
                    //     'display': 'Require user to provide address?', 
                    //     'id': 'addressRequired', 
                    //     'tooltip':'With this toggle you may specify whether or not a user has to provide their address when purchasing something. (Keep GDPR in mind when processing data!)', 
                    //     'value': false,
                    //     'type': 'toggle',
                    // },
                    // 'phoneNumberRequired': { 
                    //     'display': 'Require user to provide phone number?', 
                    //     'id': 'phoneNumberRequired', 
                    //     'tooltip':'With this toggle you may specify whether or not a user has to provide their phone number when purchasing something. (Keep GDPR in mind when processing data!)', 
                    //     'value': false,
                    //     'type': 'toggle',
                    // },
                    // 'dobRequired': { 
                    //     'display': 'Require user to provide their birth date?', 
                    //     'id': 'dobRequired', 
                    //     'tooltip':'With this toggle you may specify whether or not a user has to provide their date of birth when purchasing something. (Keep GDPR in mind when processing data!)', 
                    //     'value': false,
                    //     'type': 'toggle',
                    // },
                }
            }
        },
        methods: {
            showAccountSettings ( account ) {
                this.currentPopup = 'account';
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
                    'pass': { 
                        'display': 'Password', 
                        'id': 'pass', 
                        'tooltip':'Change the password for this user.', 
                        'value': '',
                        'type': 'password',
                    },
                }
            , 'settings' );
            },
            showPaymentSettings () {
                this.currentPopup = 'payments';
                fetch( '/admin/getAPI/getPaymentGatewaySettings' ).then( res => {
                    if ( res.status === 200 ) {
                        res.json().then( json => {
                            this.$refs.popup.openPopup( 'Payment gateway settings for ' + json.gateway, json.data, 'settings' );
                        } );
                    } else if ( res.status === 500 ) {
                        this.$refs.notification.createNotification( 'This payment gateway does not appear to have settings', 10, 'error', 'normal' );
                    }
                } );
            },
            createAccount() {
                this.currentPopup = 'createAccount';
                this.$refs.popup.openPopup( 'Create new admin user', {
                    'role': { 
                        'display': 'User role',
                        'id': 'role',
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
                    'pass': { 
                        'display': 'Password', 
                        'id': 'pass', 
                        'tooltip':'Create a password for this user.', 
                        'value': '',
                        'type': 'password',
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
                    console.log( this.currentPopup );
                    if ( this.currentPopup === 'account' ) { 
                        console.log( 'settings processing' )
                    } else if ( this.currentPopup === 'payments' ) {
                        for ( let setting in data.data ) {
                            if ( !data.data[ setting ] ) {
                                this.$refs.notification.createNotification( 'Settings for the payment gateway are missing!', 10, 'error', 'normal' );
                                this.showPaymentSettings();
                                return;
                            }
                        }
                        let fetchOptions = {
                            method: 'post',
                            body: JSON.stringify( data.data ),
                            headers: {
                                'Content-Type': 'application/json',
                                'charset': 'utf-8'
                            }
                        };
                        fetch( '/admin/API/updatePaymentGatewaySettings', fetchOptions ).then( res => {
                            if ( res.status === 200 ) {
                                this.$refs.notification.createNotification( 'Payment gateway settings saved!', 5, 'ok', 'normal' );
                            }
                        } )
                    } else if ( this.currentPopup === 'createAccount' ) {

                    }
                } else {
                    console.log( 'hi' );
                }
            },
            openRightClickMenu( id, event ) {
                this.$refs.rclk.openRightClickMenu( event, { 'permissions': { 'command': 'openPermissions', 'symbol': 'edit', 'display': 'Edit permissions' }, 'password': { 'command': 'updatePassword', 'symbol': 'password', 'display': 'Edit password' }, 'delete': { 'command': 'deleteUser', 'symbol': 'delete', 'display': 'Delete User' } } )
                this.currentlyOpenMenu = id;
            },
            loadData() {
                fetch( '/admin/getAPI/getSettings' ).then( res => {
                    if ( res.status === 200 ) {
                        res.json().then( json => {
                            this.settings[ '2fa' ].value = json.twoFA;
                            this.settings.currency.value = json.currency;
                            this.settings.paymentGateway.value = json.payments;
                            this.settings.ticketTimeout.value = json.ticketTimeout;
                        } );
                    }
                } );
            },
            save() {
                let fetchOptions = {
                    method: 'post',
                    body: JSON.stringify( { 
                        'twoFA': this.settings[ '2fa' ].value, 
                        'currency': this.settings.currency.value, 
                        'payments': this.settings.paymentGateway.value,
                        'ticketTimeout': this.settings.ticketTimeout.value,
                    } ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                };
                fetch( localStorage.getItem( 'url' ) + '/admin/API/updateSettings', fetchOptions ).then( res => {
                    if ( res.status === 200 ) {
                        this.$refs.notification.createNotification( 'Saved settings successfully. Restart libreevent to apply changes', 20, 'ok', 'normal' );
                        this.loadData();
                    }
                } );
            }
        },
        created () {
            this.loadData();
            fetch( '/admin/getAPI/getAdminAccounts' ).then( res => {
                if ( res.status === 200 ) {
                    res.json().then( json => {
                        console.log( json );
                        if ( json.status === 'ok' ) {
                            for ( let account in json.data ) {
                                this.adminAccounts[ json.data[ account ][ 'username' ] ] = json.data[ account ];
                            }
                        } else {
                            this.adminAccounts = {};
                        }
                    } );
                }
            } );
        }
    };
    // TODO: Load gateways and settings for gateways from server.
</script>


<style scoped>
    .account-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
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