<template>
    <div>
        <h1>Account</h1>
        <p>Welcome, {{ accountData.first_name }} {{ accountData.name }}!</p>
        <table>
            <tr>
                <td>
                    Email
                </td>
                <td>
                    {{ accountData.email }}
                </td>
            </tr>
        </table>
        <notifications ref="notification" location="topright" size="bigger"></notifications>
        <popups ref="popups" size="big" @data="data => { savePwd( data ) }"></popups>
    </div>
</template>


<style>
    nav {
        display: initial;
    }
</style>

<script>
    import { useUserStore } from '@/stores/userStore';
    import { mapStores } from 'pinia';
    import notifications from '@/components/notifications/notifications.vue';
    import popups from '@/components/notifications/popups.vue';

    export default {
        data () {
            return {
                accountData: {},
            }
        },
        components: {
            notifications,
            popups,
        },
        computed: {
            ...mapStores( useUserStore )
        },
        created () {
            // TODO: Also get all orders of user (using join functions)
            fetch( '/user/details' ).then( res => {
                if ( res.status === 200 ) {
                    res.json().then( data => {
                        if ( data.status ) {
                            this.accountData = data.data;
                            console.log( data.data );
                        } else {
                            this.userStore.setUserAuth( false );
                            this.userStore.setUser2fa( false );
                            this.$router.push( '/login' );
                        }
                    } );
                } else if ( res.status === 403 ) {
                    this.userStore.setUserAuth( false );
                    this.userStore.setUser2fa( false );
                    this.$router.push( '/login' );
                }
            } );
            if ( this.userStore.getUserTwoFACompliant ) {
                this.userStore.setUser2fa( false );
            }
        }
    }
</script>