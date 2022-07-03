<template>
    <div v-show="LoadingWheel.set && LoadingWheel.name === MyName">
        <div class="LoadingWheel" ></div>
        <b-spinner class="LWCenter" style="width: 50px; height: 50px;" variant="primary" label="Spinning"></b-spinner>
    </div>
</template>

<script>


export default{
    name : 'App',
    props: {
        MyName: String
    },
    data(){
        return{
            LoadingWheel:{
                set: false,
                name: "main"
            } 
        }
    },
    computed: {
      LoadingWheelCheck: function() {
        return this.$store.state.LoadingWheel;
      }
    },
    watch:{
        "$store.state.LoadingWheel"(variable) {
            if(variable !== null){
                this.LoadingWheel = variable
            } 
        }
    }
}
</script>
<style scoped>
    
  .LoadingWheel{
    position: absolute;
    width: calc(100% );
    height: calc(100% - 60px);
    margin: 0;
    background-color: aqua;
    opacity: 30%;
    z-index: 20;
  }
</style>