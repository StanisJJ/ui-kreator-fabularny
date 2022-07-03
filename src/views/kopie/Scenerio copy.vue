<template>

<b-container fluid>
  <!-- Content here -->

<b-form @submit="AddNew" >
    <div>
    <b-button v-b-toggle.collapse-1 variant="primary w-100">Nowy scenarjusz</b-button>
    <b-collapse id="collapse-1" class="mt-2">
        <b-card v-bind:style="{'border-color':  NewScenerio.Color , 'background-color': NewScenerio.Color + '70'}" >
            
                <div class="row">
                <b-form-group id="input-group-1" class="col-1" label="Tytuł:" label-for="input-1" ></b-form-group>
                <b-form-input id="input-1" class="col-3" v-model="NewScenerio.Title" type="text" placeholder="Tytuł" required></b-form-input>

                <b-form-group id="input-group-1" class="col-1" label="Pozycja:" label-for="input-1" ></b-form-group>
                <b-form-input id="input-1" class="col-2" v-model="NewScenerio.Position" type="number" min="0" :max="(Scenerios === null)? 0: Scenerios.length" placeholder="Pozycja" required></b-form-input>

                <b-form-group id="input-group-1" class="col-1" label="Kolor:" label-for="input-1" ></b-form-group>
                <b-form-input id="input-1" class="col-2" v-model="NewScenerio.Color" type="color" placeholder="Kolor" required></b-form-input>

                <div class="col-2"><b-button class="submitButton" type="submit" variant="success">Dodaj</b-button></div>

                </div>
                
            
        </b-card>
    </b-collapse>
    <hr>
    </div>
    </b-form>

    <div >
      <h3>Draggable {{ draggingInfo }}</h3>

      
        <draggable
        tag="ul" :list="Scenerios" class="list-group" handle=".handle"
          v-bind="dragOptions"
          @start="dragging = true"
          @end="dragging = false"
        >
          <li class="list-group-item" v-bind:style="{border: 'solid 1px' , 'border-color':  element.Color , 'background-color': element.Color + '70'}" v-for="(element) in Scenerios" :key="element.ID" >
            <div class="row">
                <b-icon class="handle col-1" scale="2" icon="grip-horizontal " ></b-icon>

                <div class="col-8 row Title Options" v-show="edit !== element.ID"><span class="col-2">Poz:{{element.Position }}</span><div class="col-10">{{ element.Title }}</div></div>
                <div class="col-8 row Title Options" v-show="edit === element.ID">
                  <span class="Title col-2"> Title: </span>
                  <b-form-input id="input-1" class="col-9" v-model="element.Title" type="text" placeholder="Tytuł" required></b-form-input>
                </div>

                <div class="Options col-3">
                 <b-button-group v-show="edit !== element.ID" >
                    <b-button  variant="info"  @click="edit = element.ID">Edytuj</b-button>
                    <b-button  variant="danger" @click="removeElement(element)">Usuń</b-button>
                  </b-button-group>

                  <b-button-group v-show="edit === element.ID" >
                    <b-form-input id="colorInput" style="width: 100%"  v-model="element.Color" type="color" placeholder="Kolor" required></b-form-input>
                    <b-button  variant="success"  @click="EditScene(element)">Zapisz</b-button>
                  </b-button-group>
                  <!-- <b-form-input id="input-1" class="OptionGroup" v-model="NewScenerio.Color" type="color" placeholder="Kolor" required></b-form-input> -->
                </div>
            </div>
          </li>
        </draggable>
      <hr>

    </div>
    {{NewScenerio}}
    <!-- <b-button v-b-toggle.collapse-1 variant="primary w-100" @click="getall">Nowy scenarjusz</b-button> -->
    <!-- <rawDisplayer class="col-3" :value="list" title="List" /> -->

</b-container>
</template>

<script>
import axios from 'axios'

import draggable from "vuedraggable";
export default {
  name: "handle",
  display: "Handle",
  instruction: "Drag using the handle icon",
  order: 5,
  components: {
    draggable
  },
  data() {
    return {
        NewScenerio: {
            Title: null,
            Color: null,
            Position: null,
        },
        Scenerios: null,
        dragging: false,
        edit: null
    };
  },
  created()
  {
      this.getall();
  },
  computed: {
    draggingInfo() {
        this.Scenerios.forEach((element,index) => {
            if(element.Position !== index){
                element.Position = index;
                this.UpdateScen(element);
            } 
        });
      return this.dragging ? "under drag" : "";
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
  },
  methods: {
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
            axios.post('http://localhost:5000/api/Segment',this.NewScenerio,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log(res.data)
                        this.getall();
                        this.$store.commit('UseAlert', ['success','Dodałeś właśnie nowy scenariusz',4])
                        Object.keys(this.NewScenerio).forEach(k => this.NewScenerio[k] = null);
                    }
                }, err =>{
                    console.log(err)
                })
    },
    UpdateScen(Scen){
        axios.put('http://localhost:5000/api/Segment',Scen,{
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
        axios.delete('http://localhost:5000/api/Segment',{
        headers:{'Authorization': localStorage.getItem('token')} ,
        data: { ID: element.ID } }).then(res=>{
                        if(res.status === 200){
                            console.log(res.data)
                            this.getall();
                        }
                    }, err =>{
                        console.log(err)
                    })
    },
    getall(){
            axios.get('http://localhost:5000/api/Segment',{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log(res.data)
                        this.Scenerios = res.data;
                    }
                }, err =>{
                    console.log(err)
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
  width: 65px;
  height: 30px;
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
.text {
  margin: 20px;
}

.flip-list-move {
  transition: transform 0.5s;
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
}
.Title{
  font-size: 35px;
  float: left;
}
.Options{
  display: flex;
  justify-content: right;
  align-items: center;
  min-width: 150px;
}

#colorInput{
  min-width: 40px;
}
/* Standard clasess for dragable */



</style>