// usage this.$store.commit('UseToast', ['danger','Element: "'+element.Title+'" został usunięty!', 'Usunięto element' ,5000])


<template>
<div>

  
    <b-toast :id="toastTitle" :variant="toastVariant" solid :autoHideDelay="toastTime" :appendToast="append">
      <template #toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline ">
          <b-img blank blank-color="#ff5555" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{toastTitle}}</strong>
          <small class="text-muted mr-2">successFull</small>
        </div>
      </template>
      {{toastMesage}}
    </b-toast>
  </div>
</template>


<script>

export default{
    name : 'App',
    data(){
        return{
            toastMesage: 'Test',
            toastVariant: 'success',
            toastTitle: "Tester",
            toastTime: 5000,
            append: true
        }
    },
    computed: {
    },
    watch: {
      "$store.state.ToastData"(variable) {
          console.log("im HERRRRE");
            this.toastMesage = variable.message;
            this.toastVariant = variable.variant;
            this.toastTitle = variable.title;
            this.toastTime = variable.time;
            this.toastHide = variable.hide;

            this.$bvToast.toast(variable.message, {
                title: variable.title,
                solid: true,
                autoHideDelay: variable.time,
                variant: variable.variant,
                appendToast: this.append,
                noAutoHide: variable.hide,
                toaster: 'b-toaster-bottom-right',
            })
            
      },
    },
}
</script>

<style lang="scss">

</style>
