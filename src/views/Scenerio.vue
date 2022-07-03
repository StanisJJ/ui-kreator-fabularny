<template>

<b-container fluid>
  <!-- Content here -->

<b-form @submit="AddNew" >
    <div>
    <b-collapse id="collapse-1" class="mt-2">
        <b-card v-bind:style="{'border-color':  NewScenerio.Color , 'background-color': NewScenerio.Color +'50'}" >
                <div class="row addScen">
                <b-form-group id="input-group-1" class="col-1" label="Tytuł:" label-for="input-1" ></b-form-group>
                <b-form-input id="input-1" class="col-3" v-model="NewScenerio.Title" type="text" placeholder="Tytuł" required></b-form-input>

                <b-form-group id="input-group-1" class="col-1" label="Avatar:" label-for="input-1" ></b-form-group>
                <b-form-file
                class="col-3"
                accept="image/png, image/jpg, image/jpeg" 
                v-model="file"
                placeholder="Wybierz lub upuść tutaj plik..."
                drop-placeholder="Upuść plik tutaj..."
                required
                ></b-form-file>

                <b-form-group id="input-group-1" class="col-1" label="Kolor:" label-for="input-1" ></b-form-group>
                <b-form-input id="input-1" class="col-1" v-model="NewScenerio.Color" type="color" placeholder="Kolor" required></b-form-input>

                <div class="col-2"><b-button  class="submitButton mt-0" type="submit" variant="success">Dodaj</b-button></div>

                </div>
                <div class="row">
                  <b-form-textarea
                    id="textarea"
                    v-model="NewScenerio.Description"
                    placeholder="Opis Scenariusza"
                    rows="3"
                    max-rows="6"
                    required
                  ></b-form-textarea>
                </div>
                
            
        </b-card>
    </b-collapse>
    </div>
    </b-form>

    <div  class="MainToolBar" vertical >
      <b-row align-v="center">
        <b-col><b-icon title="Dodaj scenariusz"  v-b-toggle.collapse-1 class="MTBicon" icon="plus-square"> </b-icon></b-col>
      </b-row>
      <div class="MenuTitle">
        Menu
      </div>
    </div>
      
    <div class="ItemsScenerios" >
    <LoadingWheel MyName="scenerio"/>
        <draggable
        v-bind="dragOptions"
        :list="Scenerios" handle=".handle"
        tag="div"
        class="row wrap fill-height align-center sortable-list"
        >

        
        <div v-show="Search(element)" class="MyCard" v-bind:style="{border: 'solid 2px '+ element.Color , 'border-color':  element.Color , 'background-color': element.Color + '50'}" v-for="(element) in Scenerios" :key="element.ID">
          <transition name="slide-fade" mode="out-in">
          <div
            key="1"
            v-if="edit !== element.ID"
          >

          <div class="Avatar handle">
              <b-img :src="Object.keys(element.DataImages).length === 0 ? 'http://localhost:5000/' : 'http://localhost:5000/'+element.DataImages[0].Path+'?random='+imgRand" fluid alt="Responsive image">
              </b-img>
          </div>

          <b-container v-if="element.Title !== null" class="TextContainer text-left">
            <b-row>
              <b-col :title="element.Title" class="Title text-truncate align-left">
                {{element.Title}}
              </b-col>
            </b-row>
            <hr class="LineSeparator">
            <b-row v-if="element.Description !== null">
              <b-col class=" align-left test"> 
               <div class="Description">{{element.Description}}</div>
              </b-col>
            </b-row>
          </b-container>
          
          <b-button-group class="Buttons">
                    <b-button @click="start(element)" title="Uruchom">
                        <b-icon icon="play-btn" aria-hidden="true" ></b-icon>
                    </b-button>
                    <b-button @click="edit = element.ID" title="Edytuj">
                        <b-icon icon="pencil" aria-hidden="true" ></b-icon>
                    </b-button>
                    <b-button @click="removeElement(element)" title="Usuń element">
                        <b-icon icon="x-circle" aria-hidden="true"></b-icon>
                    </b-button>
          </b-button-group>
          </div>



          <b-card
            key="2"
            img-alt="Image"
            img-top
            v-else-if="edit === element.ID"
          >
            <diV class="EditInputs">
              <div class="row">
                <b-form-file
                  accept="image/png, image/jpg, image/jpeg" 
                  v-model="updateFile"
                  placeholder="Wybierz / upuść plik..."
                  drop-placeholder="Upuść plik tutaj..."
                  ></b-form-file>
              </div>
              <div class="row">
                <b-form-input id="input-Title" style="width: 100%" v-model="element.Title" type="text" placeholder="Tytuł" required></b-form-input>
              </div>
              <div class="row ">
                  <b-form-textarea
                    id="textarea"
                    v-model="element.Description"
                    placeholder="Opis Scenariusza"
                    class="TextBox"
                    no-resize
                  ></b-form-textarea>
                </div>
              <div class="row saveB" >
                    <b-button-group >
                      <b-form-input id="colorInput"   v-model="element.Color" type="color" placeholder="Kolor" required></b-form-input>
                      <b-button  variant="success" size="sm" @click="EditScene(element)">Zapisz</b-button>
                    </b-button-group>
              </div>
            </diV>
          </b-card>

          </transition>
        </div>

        </draggable>

    </div>

</b-container>
</template>

<script>

import draggable from "vuedraggable";
import LoadingWheel from '../components/LoadingWheel.vue';
import {FileUpload} from '../Mixins/FileUpload.js'
import {UserMessage} from '../Mixins/UserMessage.js'
import {ScenerioElement} from '../Mixins/ScenerioElement.js'
export default {
  mixins: [FileUpload , UserMessage , ScenerioElement],
  name: "scenerios",
  order: 5,
  props: ['search'],
  components: {
    draggable,
    LoadingWheel,
  },
  data() {
    return {
        MTBar: {
          Lock: true,
          Width: "20px",
          WidthOn: "50px",
          WidthOff: "20px"
        },

        NewScenerio: {
            Title: null,
            Color: null,
            Position: 1,
            Image: null,
            Description: null
        },

        NewImage:{
            Title: "Testy"
        },
        Scenerios: null,

        edit: null,
        file: null,

        updateFile: null,
        fileError: '',
        serverError: '',
        rand: 0,
        
    };
  },
  mounted(){
      if(localStorage.getItem('role') === null) {
        this.$store.commit('UseAlert', ['danger','Zaloguj się lub zarejestruj',4])
        this.$router.push("/login");
        }
      else this.getall();
  },
  computed: {
    imgRand(){
        return this.rand
    },
    dragOptions() {
      let scenTemp = [];
        if(this.Scenerios !== null) {
          this.Scenerios.forEach((element,index) => {
            if(element.Position !== index){
                element.Position = index;
                scenTemp.push(element);
            } 
          });
        }
        if(scenTemp.length != 0) this.UpdateScen(scenTemp);
        console.log(scenTemp);

      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
  },
  methods: {
    Search(element){
      console.log(this.search);
      if(this.search!==null&&this.search!==''){
        if(element.Title.toLowerCase().includes(this.search.toLowerCase())) return true;
        if(element.Description.toLowerCase().includes(this.search.toLowerCase())) return true;
        return false;
      }else return true;
    },
    start(element){
      this.$router.push({name: 'main', params: { scenID: element.ID}});
    },
    imgRdn(){
      this.rand = this.rand + Math.random();
        return this.rand
    },
    
  } 
};
</script>
<style scoped>

/* Standard clasess for dragable */
.button {
  margin-top: 35px;
}
.handle {
  float: left;
  cursor: move;
}
.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}
input {
  display: inline-block;
  width: 50%;
}

.addScen{
  align-items: center;
  justify-content: center;
}


.list-group-item{
  margin-top: 10px;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
  float: left;
  width: 100%;
}


/* Dragable */

.wrap{
  margin-left: 15px;
  margin-right: 15px;
}


/* Dragable */


.container-fluid{
  min-width: 800px;
  height: calc(100% - 100px);
  margin-right: 20px;
  margin-left: 30px;
  width: calc(100% - 40px);
}

.ItemsScenerios{
  margin-top: 10px;
  margin-left: -15px;
  margin-right: -15px;
  padding-top: 10px;
  background-color: #d9d9d9;
  height: 100%;
}

.MyCard{
  float: left;
  margin: 5px;
  border-radius: 3px;
  width: 330px;
  height: 400px;
  overflow: hidden;
  box-shadow: 8px 7px 14px -8px rgb(15, 15, 15);
}

.MyCard .card{
  height: 400px;
}

.Avatar{
  float: left;
  height: 250px;
  width: 350px;
}

.Avatar img{
  height: 100%;
  width: 100%;
}


.LineSeparator{
  margin: 5px;
}

.TextContainer{
  float: left;
  height: 110px;
}

.Title{
  color: #555;
  margin: 5px;
  font-size: 20px;
}

.Description::-webkit-scrollbar {
  width: 2px;
}

.Description::-webkit-scrollbar-thumb {
  background: rgb(165, 165, 165); 
}

.Description{
  height: 60px;
  color: #555;
  font-size: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.Buttons{
  margin-top: 2px;
  width: 100%;
  height: 35px;
  float:left;
}


.Buttons .btn{
  border-radius: 0 !important;
  background-color: transparent;
  border-color: transparent;
}

.Buttons .btn:hover{
  border-radius: 0 !important;
  background-color: #54545482;
  border-color: #54545482;
  cursor: pointer !important;
}

.EditInputs{
  height: 400px;
}

.EditInputs .saveB{
  align-items: center;
  justify-content: center;
}

.EditInputs .row{
  margin-top: 10px;
}

.form-file-text{
  width: 150px !important;
}

.TextBox{
  height: 200px;
}

#colorInput{
  min-width: 40px !important;
}






/*transition ------------- */

.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(0.1, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}


</style>