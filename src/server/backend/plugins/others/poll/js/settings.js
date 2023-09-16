const { createApp } = Vue;

createApp( {
    data() {
        return {
            polls: {},
            newPoll: {},
            operation: 'Add new',
        };
    },
    methods: {
        getData() {
            fetch( '/admin/plugins/polls/getData' ).then( response => {
                response.json().then( data => {
                    this.polls = data;
                    this.newPoll = {};
                } );
            } );
        },
        save() {
            if ( this.newPoll.comment && this.newPoll.display && this.newPoll.id ) {
                this.polls[ this.newPoll.id ] = this.newPoll;
                let fetchOptions = {
                    method: 'post',
                    body: JSON.stringify( this.polls ),
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    },
                };
                fetch( '/admin/plugins/polls/save', fetchOptions ).then( response => {
                    if ( response.status !== 200 ) {
                        alert( 'there was an error updating' );
                    }
                } );
                this.closePopup();
                this.getData();
            } else {
                alert( 'Not all required fields are filled out!' );
            }
        },
        closePopup() {
            $( '#popup' ).fadeOut( 500 );
            $( 'body' ).removeClass( 'menuOpen' );
            this.getData();
        },
        addPoll () {
            this.newPoll = { 'allowAdding': true };
            this.operation = 'Add new';
            $( '#popup' ).fadeIn( 500 );
            $( 'body' ).addClass( 'menuOpen' );
        },
        editPoll ( pollID ) {
            this.operation = 'Edit';
            this.newPoll = this.polls[ pollID ];
            $( '#popup' ).fadeIn( 500 );
            $( 'body' ).addClass( 'menuOpen' );
        }
    }, 
    mounted() {
        this.getData();
    }
} ).mount( '#app' );
