<template>
    <div id="notifications" @click="handleNotifications();">
        <div class="message-box" :class="location">
            <div class="message-container" :class="messageType">
                <span class="material-symbols-outlined types hide" v-if="messageType == 'hide'">question_mark</span>
                <span class="material-symbols-outlined types" v-else-if="messageType == 'ok'" style="background-color: green;">done</span>
                <span class="material-symbols-outlined types" v-else-if="messageType == 'error'" style="background-color: red;">close</span>
                <span class="material-symbols-outlined types progress-spinner" v-else-if="messageType == 'progress'" style="background-color: blue;">progress_activity</span>
                <span class="material-symbols-outlined types" v-else-if="messageType == 'info'" style="background-color: lightblue;">info</span>
                <p class="message">{{ message }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'notifications',
        props: {
            location: {
                type: String,
                'default': 'topleft',
            }
        },
        data () {
            return {
                notifications: {},
                queue: [],
                message: '',
                messageType: 'hide',
                notificationDisplayTime: 0,
                notificationPriority: 'normal',
                currentlyDisplayedNotificationID: 0,
                currentID: { 'critical': 0, 'medium': 1000, 'low': 100000 },
                displayTimeCurrentNotification: 0,
                notificationScheduler: null,
            }
        },
        methods: {
            createNotification( message, showDuration, messageType, priority ) {
                /* 
                    Takes a notification options array that contains: message, showDuration (in seconds), messageType (ok, error, progress, info) and priority (low, normal, critical).
                    Returns a notification ID which can be used to cancel the notification. The component will throttle notifications and display
                    one at a time and prioritize messages with higher priority. Use vue refs to access these methods.
                */
                let id = 0;

                if ( priority === 'critical' ) {
                    this.currentID[ 'critical' ] += 1;
                    id = this.currentID[ 'critical' ];
                } else if ( priority === 'normal' ) {
                    this.currentID[ 'medium' ] += 1;
                    id = this.currentID[ 'medium' ];
                } else if ( priority === 'low' ) {
                    this.currentID[ 'low' ] += 1;
                    id = this.currentID[ 'low' ];
                }
                this.notifications[ id ] = { 'message': message, 'showDuration': showDuration, 'messageType': messageType, 'priority': priority };
                this.queue.push( id );
                console.log( 'scheduled notification: ' + id + ' (' + message + ')' );
                if ( this.displayTimeCurrentNotification >= this.notificationDisplayTime ) {
                    this.handleNotifications();
                }
                return id;
            },
            cancelNotification ( id ) {
                /* 
                    This method deletes a notification and, in case the notification is being displayed, hides it.
                */
                delete notifications[ id ];
                delete this.queue[ this.queue.findIndex( id ) ];
                if ( this.currentlyDisplayedNotificationID == id ) {
                    this.handleNotifications();
                }
            },
            handleNotifications () {
                /* 
                    This methods should NOT be called in any other component than this one!
                */
                this.displayTimeCurrentNotification = 0;
                this.notificationDisplayTime = 0;
                this.message = '';
                this.queue.sort();
                if ( this.queue.length > 0 ) {
                    this.message = this.notifications[ this.queue[ 0 ] ][ 'message' ];
                    this.messageType = this.notifications[ this.queue[ 0 ] ][ 'messageType' ];
                    this.priority = this.notifications[ this.queue[ 0 ] ][ 'priority' ];
                    this.notificationDisplayTime = this.notifications[ this.queue[ 0 ] ][ 'showDuration' ];
                    this.queue.reverse();
                    this.queue.pop();
                } else {
                    this.messageType = 'hide';
                }
            }
        },
        created () {
            this.notificationScheduler = setInterval( () => { 
                if ( this.displayTimeCurrentNotification >= this.notificationDisplayTime ) {
                    this.handleNotifications();
                } else {
                    this.displayTimeCurrentNotification += 0.5;
                }
            }, 500 );
        },
        unmounted ( ) {
            clearInterval( this.notificationScheduler );
        }
    }
</script>

<style scoped>
    .message-box {
        position: fixed;
        z-index: 5;
        color: white;
        height: 10vh;
        width: 15vw;
        transition: all 0.5s;
    }

    .topleft {
        top: 3%;
        left: 0.5%;
    }

    .topright {
        top: 3%;
        right: 0.5%;
    }

    .bottomright {
        bottom: 3%;
        right: 0.5%;
    }

    .bottomleft {
        top: 3%;
        right: 0.5%;
    }

    .message-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        opacity: 1;
        transition: all 0.5s;
        cursor: default;
    }

    .types {
        color: white;
        border-radius: 100%;
        margin-right: auto;
        margin-left: 5%;
        font-size: 200%;
    }

    .message {
        margin-right: 5%;
    }

    .ok {
        background-color: rgb(1, 71, 1);
    }

    .error {
        background-color: rgb(114, 1, 1);
    }

    .info {
        background-color: rgb(44, 112, 151);
    }

    .hide {
        opacity: 0;
    }

    .progress {
        background-color: rgb(0, 0, 99);
    }

    .progress-spinner {
        animation: spin 2s infinite linear;
    }

    @keyframes spin {
        from {
            transform: rotate( 0deg );
        }
        to {
            transform: rotate( 720deg );
        }
    }
</style>