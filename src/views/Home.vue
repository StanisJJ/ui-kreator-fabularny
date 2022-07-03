<template>
<div>
  <b-container fluid class="p-4 containerIMG" >
  <b-row>
    <b-col>
      <b-img class="imgHome" thumbnail fluid :src="require('../assets/img/home1.png')" alt="Image 2"></b-img>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-img class="imgHome" thumbnail fluid :src="require('../assets/img/home2.png')" alt="Image 2"></b-img>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-img class="imgHome" thumbnail fluid :src="require('../assets/img/home3.png')" alt="Image 2"></b-img>
    </b-col>
  </b-row>

  
  </b-container>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
      return {
        
      }
    },
  methods: {
      
  }
}
</script>
<style scoped>
.containerIMG{
  background-color: #bebebe;
}
.imgHome{
  margin: 10px;
  max-width: 80%;
  background-color: #f5f5f5;
}
</style>

