
export const UserMessage = {
    data(){
        return {
            
        }
    },
    computed: {
    },
    methods:{
        
        ShowModal: function(mes , title , okTitle , cancleTitle , okVariant){ //this.ShowModal("Czy na pewno chcesz usunąć ten element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
            return this.$bvModal.msgBoxConfirm(mes, {
                title: title, // Potwierdzenie działania
                size: 'sm',
                buttonSize: 'sm',
                okVariant: okVariant, //Dengwer ..
                okTitle: okTitle, // Yes..
                cancelTitle: cancleTitle, //No..
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
              })
        },
        ShowToast: function(message , title , time , variant , append , autohide){ // this.ShowToast("Dodano element" , "Sukces", 5000,"success" , append , true)
            this.$bvToast.toast(message, {
                title: title,
                solid: true,
                autoHideDelay: time,
                variant: variant,
                appendToast: append,
                noAutoHide: autohide,
                toaster: 'b-toaster-bottom-right',
            })
        }
    }
}

