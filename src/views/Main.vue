<template>
  <div class="GenerealContaintr">
      <DataSeg v-bind:ClickedNest="ClickedNest" @CloseNest="ClickedNest = $event"/>
    <LoadingWheel MyName="oneScenerio"/>
    <!-- <b-container fluid> -->

    <div  class="MainToolBar" vertical v-show="ClickedNest===null">
      <b-row align-v="center">
        <b-col><b-icon title="Dodaj element"  @click="AddMain(Scenerio)" class="MTBicon" icon="plus-square" > </b-icon></b-col>
      </b-row>
      <div class="MenuTitle">
        Menu
      </div>
    </div>
    

    <div class="MainItemContainer" v-if="Scenerio != null">
        <draggable
                v-bind="dragOptions"
                :list="Scenerio.SegMains"
                class="MainList"
                draggable= ".item"
                handle=".handleMain"
                group="a"
                @change="MainPositionChange"
                
        >
        <transition-group name="mainlist" tag="p">
        <div class="item MainItem"
        v-show="Search(mainElement)"
        v-bind:style="{'border-color':  mainElement.Color , 'background-color': mainElement.Color+'60'}"
        v-for="(mainElement , mainIndex) in Scenerio.SegMains" :key="mainElement.ID" name="cosdziala">

        <b-button-toolbar >
            
                <transition name="slide-fade" mode="out-in">
                <b-button-group v-if="Edit !== mainElement.ID" key="1" class="MainTolbar" >
                    
                        <b-button title="Przesuń" class="handleMain">
                            <b-icon icon="arrows-move" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-dropdown>
                            <template #button-content >
                                <b-icon v-if="mainElement.Status === 'StatNotExecuted'" icon="bookmark" class="ColorBlue" aria-hidden="true"></b-icon>
                                <b-icon v-if="mainElement.Status === 'StatExecuted'" icon="bookmark-check" class="ColorGreen" aria-hidden="true"></b-icon>
                                <b-icon v-if="mainElement.Status === 'StatMissed'" icon="bookmark-dash" class="ColorOrange" aria-hidden="true"></b-icon>
                                <b-icon v-if="mainElement.Status === 'StatLost'" icon="bookmark-x" class="ColorRed" aria-hidden="true"></b-icon>                            
                            </template>
                            <b-dropdown-item-button @click="mainElement.Status = 'StatNotExecuted',UpdateMainStatus(mainElement)">
                                <b-icon icon="bookmark" class="ColorBlue" aria-hidden="true"></b-icon>
                                Niewykonane
                            </b-dropdown-item-button>
                            <b-dropdown-item-button @click="mainElement.Status = 'StatExecuted',UpdateMainStatus(mainElement)">
                                <b-icon icon="bookmark-check" class="ColorGreen" aria-hidden="true"></b-icon>
                                Wykonane
                            </b-dropdown-item-button>
                            <b-dropdown-item-button @click="mainElement.Status = 'StatMissed',UpdateMainStatus(mainElement)">
                                <b-icon icon="bookmark-dash" class="ColorOrange" aria-hidden="true"></b-icon>
                                Pominięte
                            </b-dropdown-item-button>
                            <b-dropdown-item-button @click="mainElement.Status = 'StatLost',UpdateMainStatus(mainElement)">
                                <b-icon icon="bookmark-x" class="ColorRed" aria-hidden="true"></b-icon>
                                Utracone
                            </b-dropdown-item-button>
                            <b-dropdown-divider></b-dropdown-divider>
                            </b-dropdown>
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
                        <b-button @click="DeleteMain(mainElement , mainIndex)" title="Usuń element">
                            <b-icon icon="x-square" style="color: #840a0a;" aria-hidden="true"></b-icon>
                        </b-button>
                        <b-button @click="Edit = false" title="Powrót">
                            <b-icon icon="arrow-left" aria-hidden="true"></b-icon>
                        </b-button>
                </b-button-group>
                </transition>
                <div v-bind:class="'MainBookmarkColor '+mainElement.Status"></div>
                
            </b-button-toolbar>

                <div class="MainTitle text-truncate"  :title="mainElement.Title"  v-if="Edit !== mainElement.ID">
                    {{mainElement.Title!=null?mainElement.Title:"Tytuł"}}
                </div>
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

                    <transition name="NestTolbar">
                        <b-button-group v-if="NestEdit === element.ID" key="2" class="NestTollbar" size="sm">
                            <b-button  title="Wybierz kolor">
                                <label id="inpColor_wrapper" v-bind:style="{'background-color': element.Color}">
                                <input id="inpColor" type="color" v-model="element.Color" >
                                </label>
                            </b-button>
                            <b-button title="Avatar">
                                <b-form-file
                                    id="file1"
                                    accept="image/png, image/jpg, image/jpeg" 
                                    v-model="file"
                                    placeholder="Wybierz lub upuść tutaj plik..."
                                    drop-placeholder="Upuść plik tutaj..."
                                    style="display: none"
                                ></b-form-file>
                                <b-icon icon="images" onclick="document.getElementById('file1').click()"  aria-hidden="true"></b-icon>
                            </b-button>
                            <b-button @click="UpdateNest(element)" title="Zapisz">
                                <b-icon icon="file-earmark-arrow-up" style="color: #16b922;"  aria-hidden="true"></b-icon>
                            </b-button>
                            <b-button @click="RemoveNest(element)" title="Usuń element">
                                <b-icon icon="x-square" style="color: #840a0a;" aria-hidden="true"></b-icon>
                            </b-button>
                            <b-button @click="NestEdit = false" title="Powrót">
                                <b-icon icon="arrow-right" aria-hidden="true"></b-icon>
                            </b-button>
                        </b-button-group>
                    </transition>
                   
                    <div class="NetsAvatar handleNest" @click="ClickNest(element)" v-show="element.DataImages !== null">
                        <b-img :src="element.DataImages === null ? 'none' : 'http://localhost:5000/'+element.DataImages.Path+'?random='+imgRand" fluid alt="Responsive image">
                        </b-img>
                    </div>
                    
                    
                    <div class="NestTools" v-if="NestEdit !== element.ID">
                        <b-icon class="TolsIcon" @click="NestEdit = element.ID" icon="grid" aria-hidden="true"> </b-icon> 
                    </div>
                    
                    <div class="NestTitle text-truncate handleNest" @click="ClickNest(element)" :title="element.Title"> {{element.Title}} </div>
                    
                    <div class="NestContent" v-if="NestEdit === element.ID"> 
                        <b-form-input type="text" size="sm" v-model="element.Title" placeholder="Tytuł"></b-form-input>
                    </div>
                </div>
                
            </draggable>
        </div>
        </transition-group>
        </draggable>


    
    </div>
    <!-- </b-container> -->
    </div>

</template>

<script>

import draggable from 'vuedraggable';
import LoadingWheel from '../components/LoadingWheel.vue';
import {FileUpload} from '../Mixins/FileUpload.js'
import {UserMessage} from '../Mixins/UserMessage.js'
import {NestElements} from '../Mixins/NestElements.js'
import {MainElements} from '../Mixins/MainElements.js'
import DataSeg from '../components/DataSeg.vue';


export default{
    mixins: [FileUpload , UserMessage , NestElements , MainElements],
    name : 'App',
    components: {
        draggable,
        LoadingWheel,
        DataSeg
    },
    props: ['search'],
    data(){
        return{
            ActiveScenerioID: null,
            Scenerio: null,
            Edit: true,
            NestEdit: false,
            ClickedNest:null,
            file: null,
            seelct: null,
        }
    },
    created(){

        if(localStorage.getItem('role') === null){
            this.ShowToast("Zaloguj się lub zarejestrzuje !!" , "Informacje", 4000,"info" , true , false);
            this.$router.push("/login"); 
        } 
        else {
            this.ActiveScenerioID = this.$route.params.scenID;
            this.GetScenerio();
        }
    },
    mounted(){
        
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
        

    }

}
</script>

<style lang="scss">

.btn:focus {
    outline: none !important;
    box-shadow:  none !important;
}

.handle {
  float: left;
  cursor: move;
}

.ScenerioToolbar button{
    border-radius: 0px !important;
}

.GenerealContaintr{
    position: relative;
    height: calc(100% - 60px);
    width: 100%;
}

.MainItemContainer{
    width: 100%;
    height: 100%;
    background-color: cadetblue;
}

.MainList{
    position: relative;
    background-color: #b5b5b5;
    overflow-x: scroll;
    white-space: nowrap;
    height: 100%;
    padding-left: 30px;
}

.MainList::-webkit-scrollbar {
    height: 20px;
}

.MainList::-webkit-scrollbar-thumb:horizontal{
    background: gray;
    border: solid 1px white;
    border-radius: 5px;
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

.MainBookmarkColor{
    height: 5px;
    width: 100%;
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
    font-weight: 600;
    align-content: center;
    justify-content: center;
    padding: 8px;
    padding-left: 10px;
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
    padding-bottom: 10px;
    width: 100%;
    min-height: 200px;
    max-height: 700px;
    background-color: rgb(29, 159, 192);
    border-radius: 0 !important;
    border-top: 0 !important;
    overflow-y: scroll;
}

.NestList::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.NestItem{
    position: relative;
    margin: 5px;
    border-radius: 5px;
    width: calc(100% - 8px);
}

.NetsAvatar{
    width: 100%;
    max-height: 300px;
}

.NetsAvatar img{
    width: 100%;
    max-height: 300px;
}

.NestTitle{
    padding: 5px;
    float: left;
    font-size: 13px;
    width: calc(100% - 30px);
    height: 30px;
    padding-left: 10px;
    font-family:Arial, Helvetica, sans-serif;
    font-weight: 550;
    text-align: left;
    cursor: pointer;
}

.NestContent{
    max-height: 100px;
    width: 100%;
    font-weight: 400;
    padding: 5px;
}

.NestTollbar{
    transform: scale(0.9);
    background-color: transparent;
}

.NestTools{
    position: absolute !important;
    width: 30px;
    top:2px;
    right: 2px; 
    color: rgb(255, 255, 255);
    margin-bottom: 5px;
    padding: 0px !important;
    background-color: rgba(0, 0, 0, 0.349);
    border-radius: 15%;
}

.TolsIcon:hover{
    transition: 0.3s;
    transform: scale(1.4);
    color: rgb(0, 89, 255);
}






.StatNotExecuted{
    background-color: rgb(17, 17, 228);
}

.StatExecuted{
    background-color: rgb(0, 255, 0);
}

.StatMissed{
    background-color: rgb(233, 166, 21);
}

.StatLost{
    background-color: rgb(219, 11, 11);
}





.ColorBlue{
    color: rgb(17, 17, 228);
}

.ColorGreen{
    color: rgb(0, 255, 0);
}

.ColorRed{
    color: rgb(219, 11, 11);
}

.ColorOrange{
    color: rgb(233, 166, 21);
}









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

//nest buttons


.NestTolbar-enter-active, .NestTolbar-leave-active {
  transition: all .4s ease;
}
.NestTolbar-enter, .NestTolbar-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-5px);
}


//main elements add/remove
.mainlist-item {
  display: inline-block;
  margin-right: 10px;
}
.mainlist-enter-active, .mainlist-leave-active {
  transition: all 1s;
}
.mainlist-enter, .mainlist-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}


// transitions
</style>
