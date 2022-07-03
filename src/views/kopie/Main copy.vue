<template>
  <div>

    <LoadingWheel MyName="oneScenerio"/>
    <!-- <b-container fluid> -->
    <div class="MainItemContainer" v-if="Scenerio != null">

        <b-button-toolbar >
                <b-button-group  class="ScenerioToolbar" size="lg">
                    <b-button title="Przesuń">
                        <b-icon icon="arrows-move" aria-hidden="true"></b-icon>
                    </b-button>
                    <b-button title="Dodaj Główny komponent" @click="AddMain(Scenerio.ID)">
                        <b-icon icon="plus-circle" aria-hidden="true"></b-icon>
                    </b-button>
                    <b-button title="Usuń">
                        <b-icon icon="x-square" aria-hidden="true"></b-icon>
                    </b-button>
                </b-button-group>
        </b-button-toolbar>

        <draggable
                v-bind="dragOptions"
                :list="Scenerio.SegMains"
                class="MainList"
                draggable= ".item"
                handle=".handleMain"
                group="a"
                @change="MainPositionChange"
                
        >
        <div class="item MainItem"
        v-bind:style="{'border-color':  mainElement.Color , 'background-color': mainElement.Color+'60'}"
        v-for="mainElement in Scenerio.SegMains" :key="mainElement.ID" name="cosdziala">
        
        <b-button-toolbar >
                <transition name="slide-fade" mode="out-in">
                <b-button-group v-if="Edit !== mainElement.ID" key="1" class="MainTolbar" >
                    
                        <b-button title="Przesuń" class="handleMain">
                            <b-icon icon="arrows-move" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button @click="AddNested(mainElement)" title="Dodaj nowy element">
                            <b-icon icon="plus-circle" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button @click="Edit = mainElement.ID" title="Przesuń" class="handleMain">
                            <b-icon icon="pencil" aria-hidden="true"></b-icon>
                        </b-button>
                        
                </b-button-group>
                <b-button-group v-if="Edit === mainElement.ID" key="2" class="MainTolbar" >
                        
                        <b-button  title="Wybierz kolor" >
                            <!-- <b-form-input class="CollorPicker" v-model.lazy="mainElement.Color" type="color" placeholder="Kolor"></b-form-input> -->
                            <label id="inpColor_wrapper" v-bind:style="{'background-color': mainElement.Color}">
                                <input id="inpColor" type="color" v-model="mainElement.Color" >
                            </label>
                        </b-button>
                        <b-button @click="UpdateMain(mainElement)" title="Zapisz">
                            <b-icon icon="file-earmark-arrow-up" style="color: #16b922;"  aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button @click="DeleteMain(mainElement)" title="Usuń element">
                            <b-icon icon="x-square" style="color: #840a0a;" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button @click="Edit = false" title="Powrót">
                            <b-icon icon="arrow-left" aria-hidden="true"></b-icon>
                        </b-button>
                </b-button-group>
                </transition>
                
            </b-button-toolbar>

                <div class="MainTitle text-truncate"  :title="mainElement.Title"  v-if="Edit !== mainElement.ID">{{mainElement.Title}}</div>
                <div class="MainTitle" v-if="Edit === mainElement.ID"> <b-form-input type="text" size="sm" v-model="mainElement.Title" placeholder="Tytuł"></b-form-input></div>

            <draggable
                :list="mainElement.SegNesteds"
                v-bind="dragOptions"
                class="list-group NestList"
                v-bind:style="{'background-color': mainElement.Color+'80'}"
                draggable=".item"
                handle=".handleNest"
                group="b"
                @change="NestPositionChange"
            >
                <div
                class=" item NestItem"
                v-bind:style="{'background-color': element.Color}"
                v-for="element in mainElement.SegNesteds"
                :key="element.ID"
                >
                    <div class="NestTitle"   :title="element.Title" >
                        <!-- <div class="NestTools" :style="[NestEdit === element.ID ? {'background-color': '#6c757d'}:'']">
                            <b-icon v-if="NestEdit !== element.ID" id="IconPensil" icon="pencil" @click="NestEdit = element.ID" aria-hidden="true"> </b-icon>
                            <b-icon v-if="NestEdit === element.ID" @click="UpdateNest(element)" id="IconCheck"  icon="check-square" aria-hidden="true"> </b-icon>
                            <b-icon v-if="NestEdit === element.ID" @click="RemoveNest(element)" id="IconRemove" icon="x-square" aria-hidden="true"></b-icon>
                            <label id="inpColor_wrapper" v-if="NestEdit === element.ID" v-bind:style="{'background-color': element.Color}">
                              <input id="inpColor" type="color" v-model="element.Color" >
                            </label>
                        </div> -->
                        <!-- <b-icon class="NestTools" icon="grid" aria-hidden="true"> </b-icon>  -->
                         <b-dropdown size="sm" variant="link" class="NestTools" toggle-class="text-decoration-none" no-caret>
                            <template #button-content>
                            <b-icon  icon="grid" aria-hidden="true"> </b-icon> 
                            </template>
                            <b-dropdown-item @click="UpdateNest(element)">
                                    <b-icon icon="file-earmark-arrow-up" style="color: #16b922;"  aria-hidden="true"></b-icon> Zapisz
                            </b-dropdown-item>
                            <b-dropdown-item @click="NestEdit === element.ID? NestEdit=null : NestEdit = element.ID">
                                    <b-icon icon="pencil" aria-hidden="true"></b-icon> Edytuj
                            </b-dropdown-item>
                            <b-dropdown-item @click="RemoveNest(element)">
                                    <b-icon  icon="x-square" style="color: #840a0a;" aria-hidden="true"></b-icon>  Usuń
                            </b-dropdown-item>
                        </b-dropdown>
                        <div class="NestText text-truncate handleNest"> {{element.Title}} </div>
                    </div>
                    <div class="NestContent" v-if="NestEdit === element.ID"> 
                        <b-form-input type="text" size="sm" v-model="element.Title" placeholder="Tytuł"></b-form-input>
                    </div>
                </div>
            </draggable>
        </div>
        </draggable>



    </div>
    <!-- </b-container> -->
    </div>

</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';
import LoadingWheel from '../components/LoadingWheel.vue';


export default{
    name : 'App',
    components: {
        draggable,
        LoadingWheel
    },
    data(){
        return{
            ActiveScenerioID: null,
            Scenerio: null,
            Mains: null,
            Edit: true,
            NestEdit: false,
        }
    },
    created(){
        this.ActiveScenerioID = this.$route.params.scenID;
    },
    mounted(){
        this.GetScenerio();
    },
    computed:{
        dragOptions() {
            return {
                animation: 200,
                disabled: false,
                ghostClass: "ghost",
            };
        },
    },
    methods:{
        NestPositionChange: function() {
            let nestTemp = [];
            if(this.Scenerio.SegMains !== null) {
                this.Scenerio.SegMains.forEach(element => {
                    if(element.SegNesteds.length != 0){
                        element.SegNesteds.forEach((nestEl,index) => {
                            if(nestEl.Position !== index || nestEl.SegMainID !== element.ID){
                                nestEl.Position = index;
                                nestEl.SegMainID = element.ID;
                                nestTemp.push({ID:nestEl.ID,Position:nestEl.Position,SegMainID:nestEl.SegMainID});
                            } 
                        })
                    }
                });
            }
            if(nestTemp.length != 0) this.UdataAllNest(nestTemp);
            console.log(nestTemp );
        },
        UpdateNest(nest){
            axios.put('http://localhost:5000/api/SegNested',nest,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res=>{
                        console.log("Update nest",res.data);
                        this.NestEdit = false;
                    }, err =>{
                        console.log("Update Error",err);
                        this.NestEdit = false;
                    })
                
        },
        UdataAllNest(nest){
            axios.put('http://localhost:5000/api/SegNested/All',nest,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res=>{
                        console.log("Update nest",res.data);
                        this.Edit = false;
                    }, err =>{
                        console.log("Update Error",err);
                        this.Edit = false;
                    })
        },
        AddNested(main){
            let segNest = {
                SegMainID: main.ID,
                Color: '#7fffd4'
            };

             axios.post('http://localhost:5000/api/SegNested/',segNest,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
                })
                .then(res=>{
                    console.log("AddNest",res.data);
                    main.SegNesteds.push(res.data.nest);
                }, err =>{
                    console.log("AddNest",err);
                })
        },
        RemoveNest(nest){
            console.log(nest)
            let segNest = {
                ID: nest.ID,
            };

             axios.delete('http://localhost:5000/api/SegNested/',{
                headers:{'Authorization': localStorage.getItem('token')} ,
                data:  segNest  })
                    .then(res=>{
                        console.log("Delete",res.data);
                        this.GetScenerio();
                    }, err =>{
                        console.log("Delete",err);
                    })
        },
        MainPositionChange: function() {
            let mainTemp = [];
            if(this.Scenerio.SegMains !== null) {
                this.Scenerio.SegMains.forEach((element,index) => {
                    if(element.Position !== index){
                        element.Position = index;
                        mainTemp.push({ID:element.ID,Position:element.Position});
                    } 
                });
            }
            if(mainTemp.length != 0) this.UdataAllMain(mainTemp);
            console.log(mainTemp );
        },
        UpdateMain(mine){
            axios.put('http://localhost:5000/api/SegMain/',mine,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res=>{
                        console.log("Position change",res.data);
                        this.Edit = false;
                    }, err =>{
                        console.log("Position Error",err);
                        this.Edit = false;
                    })
        },
        UdataAllMain(MainsTable){
             axios.put('http://localhost:5000/api/SegMain/all',MainsTable,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res=>{
                        console.log("Position change",res.data);
                        // this.GetScenerio();
                    }, err =>{
                        console.log("Position Error",err);
                    })
        },
        GetScenerio(){

            axios.get('http://localhost:5000/api/SegMain/ByScenId/'+this.ActiveScenerioID,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("getOne",res.data)
                        this.Scenerio = res.data.scenerio;
                        this.Mains = res.data.scenerio.SegMains
                    }
                }, err =>{
                    console.log("getOne",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariusza , błąd servera', 5])
                })
        },
        AddMain(scenerioID){

            let segMain = {
                SegScenerioID: scenerioID,
                Color: '#36bdf7'
            };

             axios.post('http://localhost:5000/api/SegMain/',segMain,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
                })
                .then(res=>{
                    console.log("AddMain",res.data);
                    this.GetScenerio();
                }, err =>{
                    console.log("AddMain",err);
                })
        },
        DeleteMain(main){
            console.log(main)
            let segMain = {
                ID: main.ID,
                SegScenerioID: main.SegScenerioID 
            };

             axios.delete('http://localhost:5000/api/SegMain/',{
                headers:{'Authorization': localStorage.getItem('token')} ,
                data:  segMain  })
                    .then(res=>{
                        console.log("Delete",res.data);
                        this.GetScenerio();
                    }, err =>{
                        console.log("Delete",err);
                    })
        }

    }

}
</script>

<style lang="scss">

.handle {
  float: left;
  cursor: move;
}

.ScenerioToolbar button{
    border-radius: 0px !important;
}

.MainItemContainer{
    width: 100%;
    height: 800px;
    background-color: cadetblue;
}

.MainList{
    background-color: #b5b5b5;
    overflow-x: scroll;
    white-space: nowrap;
    height: 100%;
}

.MainItem{
    background-color: rgb(255, 255, 255);
    display: inline-block;
    vertical-align:top;
    width: 250px;
    min-height: 200px;
    max-height: 90%;
    margin: 10px;
    border-top-left-radius: 6px !important;
    border-top-right-radius: 6px !important;
    box-shadow: 0px 5px 10px 1px rgba(0,0,0,0.34);
    border: solid 1px;
}

.MainTolbar{
    width: 100%;
    height: 32px;
}

.MainTolbar button{
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.MainTitle{
    font-size: 17px;
    height: 40px;
    width: 100%;
    font-family: 'Times New Roman', Times, serif;
    font-weight: 500;
    align-content: center;
    justify-content: center;
    padding: 8px;
    padding-left: 10px;
    text-decoration: underline;
}

.handleMain , .handleNest{
    cursor: grab !important;
}

.handleMain:active , .handleNest:active{
    cursor: grabbing !important;
}

.handleNest:hover{
    border: 1px solid rgba(0, 38, 255, 0);
}


.NestList{
    position: relative;
    padding-top: 10px;
    width: 100%;
    min-height: 200px;
    max-height: 600px;
    background-color: rgb(29, 159, 192);
    border-radius: 0 !important;
    border-top: 0 !important;
    overflow-y: scroll;
}

.NestList::-webkit-scrollbar {
  width: 2px;
}

.NestItem{
    position: relative;
    margin: 5px;
    border-radius: 2px;
}

.NestTitle{
    height: 50px;
    width: 100%;
    font-weight: 400;
    padding: 5px;
}

.NestContent{
    max-height: 100px;
    width: 100%;
    font-weight: 400;
    padding: 5px;
}

.NestText{
    float: left;
    font-size: 15px;
    width: calc(100% - 30px);
    height: 30px;
    padding-left: 10px;
    font-family:Arial, Helvetica, sans-serif;
    text-align: left;
}

.NestTools{
    position: absolute;
    margin-top: -5px;
    float: right;
    width: 30px;
    color: black;
    margin-bottom: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 0px !important;
}

#IconPensil{
    color: rgb(15, 15, 255);
}
#IconCheck{
    color: rgb(0, 255, 0);
}
#IconRemove{
    color: rgb(219, 11, 11);
}


// .NestTools .dropdown-toggle-no-caret{
//     padding: 0px !important;
// }

// .NestTools .dropdown-item{
//     padding-left: 10px;
//     padding-right: 15px;
// }



#inpColor{
    visibility:hidden;
  height: 20px;
  width: 20px;
  border: solid 1px white;
}

#inpColor_wrapper{
  background-color:black;
  height:20px;
  width:20px;
  border: solid 1px white;
  margin: 0 !important;
}



// transitions 


.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-10px);
}

// transitions
</style>
