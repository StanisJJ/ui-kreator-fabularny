
//usage this.$store.commit('UseAlert', ['success','Dodałeś właśnie nowy scenariusz',4])


<template>
    <b-alert class="alertBox" :show="dismissCountDown" dismissible :variant="alertvariant" @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">
                <div class="alertText"> {{alertMesage}} </div>
                <b-progress :variant="alertvariant" :max="dismissSecs" :value="dismissCountDown" height="4px"></b-progress>
    </b-alert>
</template>

<script>

export default{
    name : 'App',
    data(){
        return{
            showDismissibleAlert: false,
            dismissSecs: 10,
            dismissCountDown: 0,
            alertMesage: 'asd',
            alertvariant: 'success',

            LoadingWheel: false,
        }
    },
    computed: {
    },
    watch: {
      "$store.state.AlertData"(variable) {
         console.log(variable.message);
            this.alertMesage = variable.message;
            this.alertvariant = variable.variant;
            this.dismissSecs = variable.dismissSecs;
            this.showAlert();
      },
    },
    methods:{
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        showAlert() {
            this.dismissCountDown = this.dismissSecs
        },
    }
}
</script>

<style lang="scss">

</style>
