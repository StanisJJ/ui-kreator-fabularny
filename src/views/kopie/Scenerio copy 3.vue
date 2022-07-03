<template>

<b-container fluid>
  <!-- Content here -->

<b-form @submit="AddNew" >
    <div>
    <b-button v-b-toggle.collapse-1 variant="primary w-100">Nowy scenarjusz</b-button>
    <b-collapse id="collapse-1" class="mt-2">
        <b-card v-bind:style="{'border-color':  NewScenerio.Color , 'background-color': NewScenerio.Color +'70'}" >
                <div class="row addScen">
                <b-form-group id="input-group-1" class="col-1" label="Tytuł:" label-for="input-1" ></b-form-group>
                <b-form-input id="input-1" class="col-3" v-model="NewScenerio.Title" type="text" placeholder="Tytuł" required></b-form-input>

                <b-form-group id="input-group-1" class="col-1" label="Avatar:" label-for="input-1" ></b-form-group>
                <!-- <b-form-input id="input-1" class="col-2" v-model="NewScenerio.Position" type="number" min="0" :max="(Scenerios === null)? 0: Scenerios.length" placeholder="Pozycja" required></b-form-input> -->
                <b-form-file
                class="col-3"
                
                ref="file" 
                accept="image/png, image/jpg, image/jpeg" 
                v-model="file"
                placeholder="Wybierz lub upuść tutaj plik..."
                drop-placeholder="Upuść plik tutaj..."
                ></b-form-file>

                <b-form-group id="input-group-1" class="col-1" label="Kolor:" label-for="input-1" ></b-form-group>
                <b-form-input id="input-1" class="col-1" v-model="NewScenerio.Color" type="color" placeholder="Kolor" required></b-form-input>

                <div class="col-2"><b-button v-b-toggle.collapse-1 class="submitButton mt-0" type="submit" variant="success">Dodaj</b-button></div>

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
    <hr>
    </div>
    </b-form>

    <div class="ItemsScenerios" >
      {{file}}
    <LoadingWheel MyName="scenerio"/>
    
        <draggable
        v-bind="dragOptions"
        :list="Scenerios" handle=".handle"
        tag="div"
        class="row wrap fill-height align-center sortable-list"
        >

        
        <div class="Card" v-bind:style="{border: 'solid 1px '+ element.Color , 'border-color':  element.Color , 'background-color': element.Color + '70'}" v-for="(element) in Scenerios" :key="element.ID">
          <div class="handle"></div>
          <transition name="slide-fade" mode="out-in">
          <b-card
            key="1"
            :title="element.Title"
            :img-src="Object.keys(element.DataImages).length === 0 ? 'http://localhost:5000/' : 'http://localhost:5000/'+element.DataImages[0].Path"
            img-alt="Image"
            img-top
            tag="article"
            v-if="edit !== element.ID"
          >
            <b-card-text v-if="element.Description !== null">
              {{element.Description}}
            </b-card-text>
            <b-card-text v-else>
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </b-card-text>
            <div>
                 <b-button-group >
                    <b-button  variant="info"  @click="edit = element.ID">Edytuj</b-button>
                    <b-button  variant="danger" @click="removeElement(element)">Usuń</b-button>
                  </b-button-group>

            </div>
          </b-card>

          <b-card
            key="2"
            :title="element.Title"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            v-else-if="edit === element.ID"
          >
            <b-card-text v-if="element.Description !== null">
              {{element.Description}}
            </b-card-text>
            <diV class="EditInputs">
              <div class="row">
                <b-form-file
                  v-on:change="handleFileUpload()"
                  ref="file2" 
                  accept="image/png, image/jpg, image/jpeg" 
                  v-model="file"
                  placeholder="Wybierz / upuść plik..."
                  drop-placeholder="Upuść plik tutaj..."
                  ></b-form-file>
              </div>
              <div class="row">
                <b-form-input id="input-Title" style="width: 100%" v-model="element.Title" type="text" placeholder="Tytuł" required></b-form-input>
              </div>
              <div class="row">
                  <b-form-textarea
                    id="textarea"
                    v-model="element.Description"
                    placeholder="Opis Scenariusza"
                    rows="3"
                    max-rows="6"
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
    <!-- {{NewScenerio}} -->
    <!-- <b-button v-b-toggle.collapse-1 variant="primary w-100" @click="getall">Nowy scenarjusz</b-button> -->
    <!-- <rawDisplayer class="col-3" :value="list" title="List" /> -->

</b-container>
</template>

<script>
import axios from 'axios'

import draggable from "vuedraggable";
import LoadingWheel from '../components/LoadingWheel.vue';
export default {
  name: "handle",
  display: "Handle",
  instruction: "Drag using the handle icon",
  order: 5,
  components: {
    draggable,
    LoadingWheel
  },
  data() {
    return {
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
        dragging: false,
        edit: null,
        file: null,
        fileError: '',
        serverError: ''
    };
  },
  mounted(){
       this.getall();
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
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
    save(scenId){
            
             this.fileError = '';
             let imgNew = this.NewImage;
             imgNew.SegScenerioId = scenId;

             if(this.file != null){

                let formData = new FormData();
                formData.append('file', this.file);
                formData.append('data', JSON.stringify(imgNew));

                if(this.file['type'] === 'image/jpeg' || this.file['type'] === 'image/png' || this.file['type'] === 'image/jpeg'){
                        axios.post('http://localhost:5000/api/Upload/',formData,{headers: {
                        authorization: localStorage.getItem('token'),
                        }} ).then(res => {
                            //if successfull
                            if(res.status === 200){
                                console.log(res);
                                this.getall();
                            }
                            this.error = '';
                        },err => {
                            console.log(err.response);
                            this.error = err.response.data.errors.Name[0];
                        })
                }
            }
      },
    handleFileUpload(){
      console.log(this.$refs.file.files)
      this.file = this.$refs.file.files[0];
      },
    EditScene(Scen){
      axios.put('http://localhost:5000/api/Segment',Scen,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log(res.data)
                        this.edit = null;
                    }
                }, err =>{
                    console.log(err)
                    this.$store.commit('UseAlert', ['danger','Niestety zapis nie powiódł sie',6])
                })
    },
    AddNew(event){
            event.preventDefault();
            this.NewScenerio.Position = 1;
            axios.post('http://localhost:5000/api/Segment',this.NewScenerio,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("ważne",res.data)
                        this.save(res.data.ScenID);
                        this.$store.commit('UseAlert', ['success','Dodałeś właśnie nowy scenariusz',4])
                        Object.keys(this.NewScenerio).forEach(k => this.NewScenerio[k] = null);
                    }
                }, err =>{
                    console.log(err)
                })
    },
    UpdateScen(Scen){
        axios.put('http://localhost:5000/api/Segment/All',Scen,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log(res.data)
                    }
                }, err =>{
                    console.log(err)
                })
    },
    removeElement(element) {
      console.log("mess",element)
        axios.delete('http://localhost:5000/api/Segment',{
        headers:{'Authorization': localStorage.getItem('token')} ,
        data:  element  }).then(res=>{
                        if(res.status === 200){
                            console.log(res.data)
                            this.getall();
                        }
                    }, err =>{
                        console.log(err)
                    })
    },
    getall(){
            this.$store.commit('SetLoadingWheel', {set:true,name:"scenerio"});

            axios.get('http://localhost:5000/api/Segment',{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log(res.data)
                        this.Scenerios = res.data.list;
                        this.$store.commit('SetLoadingWheel', {set:false , name:"scenerio"});
                        
                    }
                }, err =>{
                    console.log(err)
                    this.$store.commit('SetLoadingWheel', {set:false , name:"scenerio"});
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
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


.ItemsScenerios{
  margin-top: 10px;
  margin-left: -15px;
  margin-right: -15px;
  background-color: #b5b9cae6;
}

b-card{
  width: 20rem;
}

.Card{
  float: left;
  margin: 5px;
  border-radius: 5px;
  max-width: 20rem;
  max-height: 600px;
  min-height: 540px;
  overflow: hidden;
}

.card-body{
  min-height: 210px !important;
}

.Card img {
  height: 300px;
}

.handle{
  width: 100%;
  height: 30px;
}
.handle:hover{
  background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0 0);
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