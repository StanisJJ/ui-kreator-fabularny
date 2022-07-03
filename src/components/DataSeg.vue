// ND - nest title
<template>
<div v-if="ClickedNest !== null" >

    <div  class="MainToolBar" vertical v-show="ClickedNest!==null">
        <div class="MenuTitle">
        Menu
      </div>
      <b-row align-v="center">
        <b-col><b-icon title="Dotaj pole tekstowe"  @click="AddSegData('TextArea')" class="MTBicon" icon="textarea-t" > </b-icon></b-col>
      </b-row>
      <b-row align-v="center">
        <b-col><b-icon title="Dotaj zadania"  @click="AddSegData('Task')" class="MTBicon" icon="card-checklist" > </b-icon></b-col>
      </b-row>
      <b-row align-v="center">
        <b-col><b-icon title="Dodaj element"  @click="AddSegData('Image')" class="MTBicon" icon="images" > </b-icon></b-col>
      </b-row>
      <b-row align-v="center">
        <b-col><b-icon title="Dodaj element"  @click="AddSegData('Character')" class="MTBicon" icon="person-square" > </b-icon></b-col>
      </b-row>
    </div>



    <div class="NDBackground" @click="CloseNest">
    </div>
    <div class="NDContainer" v-bind:style="{border: 'solid 1px '+ ClickedNest.Color , 'max-width':ClickedNest.Width+'px' }" v-show="ClickedNest !== null">
        <b-form-input v-if="Resize" id="range-2" @change="UpdateNestWidth({ID:ClickedNest.ID , Width:ClickedNest.Width})" v-model="ClickedNest.Width" type="range" min="900" max="1500"></b-form-input>
        <div class="NDTitle text-truncate">Tytuł: {{ClickedNest.Title}}
        <b-icon class="IconRight" @click="Resize = !Resize" icon="arrows-angle-expand" ></b-icon>    
        </div> 
       
        <LoadingWheel MyName="Nested"/>
            <draggable
                :list="SegDatas"
                v-bind="dragOptions"
                draggable=".item"
                handle=".NDHandle"
                group="a"
                @change="ChangePosition()"
            >

                <div
                class="item"
                v-for="(element,segDataIndex) in SegDatas"
                :key="element.ID"
                >
                
                    <div class="NDCard">

                        <transition name="fade" mode="out-in">
                            <div v-if="SegEdit !== element.ID" class="EditSegData" key="1"><b-icon icon="pencil" class="IconPencil IconRight"  @click="SegEdit = element.ID"></b-icon></div>
                            <div class="NDToolBar" key="2" v-if="SegEdit === element.ID">  
                                    <b-icon icon="arrows-move" title="złap u przesuń" class="NDHandle IconLeft IconMove" ></b-icon>
                                    <b-icon @click="SegEdit = null" icon="arrow-Right" class="IconRight IconBack" ></b-icon>
                                    <b-icon @click="SaveSegData(element)" icon="file-earmark-arrow-up" class="IconRight IconSave" ></b-icon>
                                    <b-icon @click="RemoveSegData(element,segDataIndex)" icon="x-square" class="IconRight IconRemove" ></b-icon>
                                    <div v-if="element.Type==='Task'" class="NDCustomToolbar">
                                        <b-icon  @click="AddDataText(element,'Task')" icon="plus-square" class="IconRight" ></b-icon>
                                    </div>
                                    <div v-if="element.Type==='Character'" class="NDCustomToolbar">
                                        <b-icon  @click="AddDataObject(element,'Character')" icon="plus-square" title="Dodaj Bohatera" class="IconRight" ></b-icon>
                                    </div>
                                    <div v-if="element.Type==='Image'" class="NDCustomToolbar">
                                        <b-form-file
                                        id="file1"
                                        accept="image/png, image/jpg, image/jpeg" 
                                        v-model="file"
                                        placeholder="Wybierz lub upuść tutaj plik..."
                                        drop-placeholder="Upuść plik tutaj..."
                                        style="display: none"
                                        ></b-form-file>
                                        <b-icon icon="image" title="Dodaj zdjęcie" onclick="document.getElementById('file1').click()" class="IconRight" aria-hidden="true"></b-icon>
                                    </div>
                            </div >
                        </transition>


                        <vue-editor v-if="element.Type==='TextArea'" @blur="SaveDataText(element.DataTexts[0])" v-model="element.DataTexts[0].DataString" :editorToolbar="customToolbar"></vue-editor>

                        <div v-if="element.Type==='Task'" class="NDTasks">
                            <div class="NDTitle TaskTitle text-truncate">
                                <b-row>
                                <b-col cols="10">
                                <div v-if="SegEdit !== element.ID">Zadania: {{element.Title}} </div>
                                <div v-if="SegEdit === element.ID"><b-form-input v-model="element.Title" size="sm" placeholder="Tytuł zadania:"></b-form-input></div>
                                </b-col>

                                <b-col cols="2" class="text-right">
                                    <b-row>
                                        <b-col>
                                        <b-form-checkbox
                                            v-model="element.Show"
                                            switch
                                            @change="SaveSegData(element)"
                                        >
                                        </b-form-checkbox>
                                        </b-col>
                                    </b-row>
                                    
                                </b-col>
                                </b-row>
                            </div>
                            
                            <b-collapse v-model="element.Show">
                            <draggable
                                :list="element.DataTexts"
                                v-bind="dragOptions"
                                draggable=".item2"
                                handle=".TaskHandle"
                                group="b"
                                @change="ChangeDataTextPosition(element.DataTexts,element.ID)"
                            >
                            <transition-group name="AddRemove" tag="p">
                                <div class="NDTaskRow item2" v-for="(dataText,textIndex) in element.DataTexts" :key="dataText.ID">
                                <b-row align-h="start" class="text-left">
                                    <b-icon v-if="dataText.DataInt>0" icon="check-circle-fill" scale="1" class="mt-1" variant="success"></b-icon>   
                                    <b-icon v-if="dataText.DataInt==0" icon="x-square-fill" scale="1" class="mt-1" variant="danger"></b-icon>   
                                    <b-icon v-if="dataText.DataInt===null||dataText.DataInt=='-1'" class="mt-1" icon="exclamation-triangle-fill" scale="1" variant="warning"></b-icon>   
                                    
                                    <b-col v-if="SegEdit !== element.ID" class="text-truncate TaskHandle">   
                                        <div v-if="dataText.Name===null">Zadanie:</div> {{dataText.Name}}
                                    </b-col>
                                    
                                    <b-col v-if="SegEdit === element.ID">
                                        <b-form-input v-model="dataText.Name" size="sm" placeholder="Zadanie:"></b-form-input>
                                    </b-col>
                                    
                                    <b-col cols="6" v-if="SegEdit !== element.ID">
                                        <b-form-group  >
                                            <b-form-radio-group @change="SaveDataText(dataText)" v-model="dataText.DataInt" >
                                                    <b-form-radio value="100">sukces</b-form-radio>
                                                    <b-form-radio value="50">1/2</b-form-radio>
                                                    <b-form-radio value="20">1/5</b-form-radio>
                                                    <b-form-radio value="0">porażka</b-form-radio>
                                                    <b-form-radio value="-1">Brak</b-form-radio>
                                            </b-form-radio-group>
                                        </b-form-group>
                                    </b-col>
                                    
                                    <div class="IconTask" title="Więcej ->"><b-icon v-b-toggle="'collapse'+dataText.ID+''" icon="box-arrow-down" ></b-icon></div>
                                    <div v-if="SegEdit === element.ID" class="IconTask IconRemove" title="Usuń"><b-icon @click="RemoveDataText(dataText,textIndex,element)" icon="x-square"  ></b-icon></div> 
                                </b-row>
                                <b-row>
                                    <b-col cols="12">
                                        <b-collapse :id="'collapse'+dataText.ID+''" class="mt-2">
                                            <b-form-textarea size="sm" @change="SaveDataText(dataText)" v-model="dataText.DataString" :rows="dataText.Height" placeholder="Opis zadania:"></b-form-textarea> 
                                            <b-form-input v-if="SegEdit === element.ID" id="range-1"  v-model="dataText.Height" type="range" min="0" max="15"></b-form-input>
                                            <hr>
                                        </b-collapse>
                                    </b-col>
                                </b-row>
                                </div>
                            </transition-group>
                            </draggable>
                            </b-collapse>
                           
                            <b-progress class="mt-2" :max="element.DataTexts.length" show-value>
                                <b-progress-bar :value="element.DataTexts.filter(x=>x.DataInt>0).length" variant="success"></b-progress-bar>
                                <b-progress-bar :value="element.DataTexts.filter(x=>x.DataInt=='0').length" variant="danger"></b-progress-bar>
                                <b-progress-bar :value="element.DataTexts.filter(x=>x.DataInt===null||x.DataInt=='-1').length" variant="warning"></b-progress-bar>
                            </b-progress>
                        </div>
                        <div v-if="element.Type==='Image'" class="NDImage" v-bind:style="{'max-height': element.Height+'px'}">
                            <div class="ImageConfig" v-if="SegEdit === element.ID">
                                  <b-row>
                                       <b-col ><b-form-input v-b-tooltip.hover title="Szerokość" id="range-1"  v-model="element.Width" type="range" min="4" max="12"></b-form-input></b-col>
                                       <b-col ><b-form-input v-b-tooltip.hover title="Wysokość max" id="range-1"  v-model="element.Height" type="range" min="200" max="1000"></b-form-input></b-col>
                                  </b-row>
                            </div>
                            <b-row class="justify-content-md-center">
                                <b-col :cols="element.Width">
                                    <b-carousel
                                    id="carousel-1"
                                    v-model="slide"
                                    :interval="interval"
                                    controls
                                    indicators
                                    img-width="1024"
                                    img-height="480"
                                    background="#ababab"
                                    style="text-shadow: 1px 1px 2px #333;"
                                    class="NDImagesSlider"
                                    @sliding-start="onSlideStart"
                                    @sliding-end="onSlideEnd"
                                    >
                                    <b-carousel-slide v-for="dataImage in element.DataImages" :key="dataImage.ID">
                                        <template #img>
                                        <img
                                            v-bind:style="{'max-height': element.Height+'px'}"
                                            class="NDImage"
                                            :src="dataImage.Path === null ? 'none' : 'http://localhost:5000/'+dataImage.Path+'?random='+imgRand"
                                            alt="image slot"
                                        >
                                        </template>
                                        
                                            <b-form-input v-if="SegEdit === element.ID" v-model="dataImage.Title" size="sm" placeholder="Tytuł:"></b-form-input>
                                            <b-button variant="danger" @click="RemoveDataImage(dataImage)" v-if="SegEdit === element.ID" size="sm" class="mt-1">Usuń zdjęcie</b-button>
                                        
                                        <span class="text-truncate" v-if="dataImage.Title !==null && SegEdit !== element.ID">{{dataImage.Title}}</span>
                                    </b-carousel-slide>
                                    </b-carousel>
                                    <!-- <h3 v-if="element.DataImages!=null?element.DataImages.length == 0:false" class="mt-1">Dodaj zdjęcie</h3> -->
                                </b-col>
                            </b-row>
                            

                        </div>
                        <div v-if="element.Type==='Character'" class="NDObject">
                            <draggable
                                :list="element.DataObjects"
                                v-bind="dragOptions"
                                draggable=".item3"
                                handle=".ObjectHandle"
                                tag="div"
                                group="C"
                                @change="ChangeDataObjectPosition(element.DataObjects,element.ID)"
                                class="row wrap fill-height align-center sortable-list"
                            >
                                <div class="item3" v-for="(dataObject,dataObjectIndex) in element.DataObjects" :key="dataObject.ID">
                                    <transition name="fade-object" mode="out-in">
                                        <div key="1" v-if="dataObject.Data == '1'?false:DataObjectEdit !== dataObject.ID" @click="DataObjectEdit = dataObject.ID" class="ObjectAvatar AvatarList">
                                            <div class="ObjectTitle text-truncate ObjectHandle">
                                                <div class="text-truncate" :title="dataObject.Fname">{{dataObject.Fname !== null?dataObject.Fname:'Nazwa:'}}</div>
                                            </div>
                                            <img v-if="dataObject.DataImages !== null"
                                                class="NDImage"
                                                :src="dataObject.DataImages === null ? 'none' : 'http://localhost:5000/'+dataObject.DataImages.Path+'?random='+imgRand"
                                                alt="image slot"
                                            >
                                            <b-icon class="AddImageObjectIcon" v-else icon="image-alt"></b-icon>

                                        </div>
                                        <div key="2" v-if="dataObject.Data == '1'?true:DataObjectEdit === dataObject.ID" class="ObjectContainer" v-bind:style="{'width':(ClickedNest.Width-45)+'px' }">
                                            <div class="ObjectCloseIcon text-right" >
                                                <b-row>
                                                    <b-icon icon="box-arrow-left" @click="DataObjectEdit = null" class="IconPencil"></b-icon>
                                                </b-row>
                                                <b-row>
                                                    <b-icon @click="SaveDataObject(dataObject)" icon="file-earmark-arrow-up" class="IconRight IconSave" ></b-icon>
                                                </b-row>
                                                <b-row>
                                                    <b-icon @click="RemoveDataObject(dataObject,dataObjectIndex,element)" icon="x-square" class="IconRemove" ></b-icon>
                                                </b-row>
                                                <b-row>
                                                    <b-icon @click="AddCoppyDataObject(dataObject,element)" icon="files" class="IconCoppy" ></b-icon>
                                                </b-row>
                                                <b-form-checkbox
                                                    v-model="dataObject.Data"
                                                    value="1"
                                                    unchecked-value="0"
                                                    switch 
                                                >
                                                </b-form-checkbox>
                                            </div>
                                            
                                        
                                            <b-row >
                                                <b-col cols="3">
                                                    <div class="ObjectAvatar">
                                                        <div class="ObjectTitle text-truncate">
                                                            <div v-if="SegEdit !== element.ID">{{dataObject.Fname !== null?dataObject.Fname:'Nazwa:'}}</div>
                                                            <div v-if="SegEdit !== element.ID">{{dataObject.Lname !== null?dataObject.Lname:''}}</div>
                                                            <b-form-input  v-if="SegEdit === element.ID" v-model="dataObject.Fname" size="sm" type="text" placeholder="Imie:"></b-form-input>
                                                            <b-form-input  v-if="SegEdit === element.ID" v-model="dataObject.Lname" size="sm" type="text" placeholder="Nazwisko:"></b-form-input>
                                                        </div>

                                                        <b-form-file
                                                            id="file2"
                                                            accept="image/png, image/jpg, image/jpeg" 
                                                            v-model="file2"
                                                            placeholder="Wybierz lub upuść tutaj plik..."
                                                            drop-placeholder="Upuść plik tutaj..."
                                                            style="display: none"
                                                        ></b-form-file>
                                                        <img
                                                            v-if="dataObject.DataImages !== null"
                                                            @click="dataObject.DataImages !== null? DataObjectImageID = dataObject.DataImages.ID : DataObjectImageID=null" onclick="document.getElementById('file2').click()"
                                                            class="NDImage"
                                                            :src="dataObject.DataImages === null ? 'none' : 'http://localhost:5000/'+dataObject.DataImages.Path+'?random='+imgRand"
                                                            alt="image slot"
                                                        >
                                                        <b-icon @click="dataObject.DataImages !== null? DataObjectImageID = dataObject.DataImages.ID : DataObjectImageID=null" onclick="document.getElementById('file2').click()" class="AddImageObjectIcon" v-else icon="file-earmark-image" ></b-icon>
                                                    </div>
                                                </b-col>
                                                <b-col cols="9">
                                                    <b-row class=" text-right">
                                                        <b-col>
                                                        <b-row class="mt-1 mb-2">
                                                            <b-col cols="4" v-for="(dataField) in DataFieldsOf(dataObject.DataFields,'Stat')" :key="dataField.ID">
                                                                <b-row >
                                                                    <b-col  cols="6" class="Stat text-truncate">
                                                                         <b-form-input size="sm" :title="dataField.Name" :disabled="SegEdit !== element.ID" type="text" placeholder="Cecha:" v-model="dataField.Name" ></b-form-input>
                                                                    </b-col>
                                                                    
                                                                    <b-col cols="4" class="Stat text-truncate">
                                                                        <b-form-input v-model="dataField.DataNumber" size="sm" type="number"></b-form-input>
                                                                    </b-col>
                                                                    <p v-if="SegEdit === element.ID" class="StatRemoveIcon IconRemove" title="Usuń">
                                                                        <b-icon @click="RemoveDataField(dataField)" icon="x-square"  >
                                                                        </b-icon>
                                                                    </p> 
                                                                </b-row>
                                                            </b-col>
                                                            <b-col cols="4" v-if="SegEdit === element.ID">
                                                                <b-button size="sm" class="AddNewStat" @click="AddDataField(dataObject,'Stat')" variant="success">
                                                                    <b-icon icon="plus-square" class="mr-2"></b-icon>
                                                                    Dodaj Nowe Pole
                                                                </b-button>
                                                            </b-col>
                                                        </b-row>
                                                        </b-col>
                                                    </b-row>
                                                    
        
                                                </b-col>
                                            </b-row>
                                            <vue-editor v-model="dataObject.Description" :editorToolbar="customToolbar"></vue-editor>
                                            
                                            <b-row class="mt-3 mb-2">
                                            <b-col cols="4" v-for="dataField in DataFieldsOf(dataObject.DataFields,'StatExtand')" :key="dataField.ID">
                                                <b-row >
                                                    <b-col  cols="8" class="Stat text-truncate">
                                                            <b-form-input size="sm" :title="dataField.Name" :disabled="SegEdit !== element.ID" type="text" placeholder="Nazwa cechy:" v-model="dataField.Name" ></b-form-input>
                                                    </b-col>
                                                    
                                                    <b-col cols="2" class="Stat text-truncate">
                                                        <b-form-input v-model="dataField.DataNumber" size="sm" type="number"></b-form-input>
                                                    </b-col>
                                                    <p v-if="SegEdit === element.ID" class="StatRemoveIcon IconRemove" title="Usuń">
                                                        <b-icon @click="RemoveDataField(dataField)" icon="x-square"  >
                                                        </b-icon>
                                                    </p> 
                                                </b-row>
                                            </b-col>

                                            <b-col cols="4" v-if="SegEdit === element.ID">
                                                <b-button size="sm" class="AddNewStat" @click="AddDataField(dataObject,'StatExtand')" variant="success">
                                                    <b-icon icon="plus-square" class="mr-2"></b-icon>
                                                    Dodaj Nowe Pole
                                                </b-button>
                                            </b-col>
                                            </b-row>
                                            
                                        </div>
                                    </transition>
                                </div>

                            </draggable>
                        </div>


                    </div>
                </div>

            </draggable>
            
    </div>




</div>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';
import { VueEditor } from "vue2-editor";
import {UserMessage} from '../Mixins/UserMessage.js'
import {FileUpload} from '../Mixins/FileUpload.js'
import LoadingWheel from '../components/LoadingWheel.vue';

export default{
    mixins: [ UserMessage , FileUpload],
    name : 'App',
    props: ['ClickedNest'],
    components:{
        draggable,
        LoadingWheel,
        VueEditor
    },
    data(){
        return{
            slide: 0,
            sliding: null,
            interval:4000,
            visible:false,

            SegDatas : null,
            SegEdit : null,
            DataObjectEdit:null,
            DataObjectImageID:null,
            Resize: false,
            customToolbar: [
                [{ header: [false, 1, 2, 3, 4, 5, 6] }],
                ["bold", "italic", "underline", "strike"], // toggled buttons
                [
                { align: "" },
                { align: "center" },
                { align: "right" },
                { align: "justify" }
                ],
                ["blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                ["link", "video"],
                ["clean"] // remove formatting button
            ],
        }
    },
    created(){
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                disabled: false,
                ghostClass: "ghost",
            };
        },
    },
    watch:{
        ClickedNest: function() { // watch it
            if(this.ClickedNest!==null) this.GetDataSegments();
        },
        file: function(){
            if(this.file!==null) this.AddImage('DataSeg');
        },
        file2: function(){
            if(this.file2!==null) this.AddImage('DataObject');
        },
        SegEdit: function(){
            if(this.SegEdit!==null) this.interval = 0;
            else this.interval = 4000;
        },

    },
    methods:{
        test(){
            console.log("asdasd");
        },
        DataFieldsOf(dataFields,type){
            if(dataFields != null) return dataFields.filter(x=>x.FieldType == type);
            else return false;
        },
        onSlideStart() {
            this.sliding = true
        },
        onSlideEnd() {
            this.sliding = false
        },
        AddImage(type){
            let DataImagesTemp = null;
            let FileTemp = null;

            if(this.SegEdit !== null && type === "DataSeg"){ 
                DataImagesTemp = {
                        SegDataID : this.SegEdit,
                    }
                FileTemp = this.file;
            }else if(this.DataObjectEdit !== null && type === "DataObject"){
                DataImagesTemp = {
                        DataObjectID : this.DataObjectEdit,
                    }
                if(this.DataObjectImageID != null) DataImagesTemp.ID = this.DataObjectImageID;
                FileTemp = this.file2;
            }

            if(DataImagesTemp !== null){
                console.log('img  TEMP',DataImagesTemp , this.DataObjectImageID)
                if(FileTemp !== null){
                    if(this.DataObjectImageID !== null){
                        console.log('jestem w Updata File');
                        this.UpdateFile(DataImagesTemp,FileTemp).then(() => {
                        this.ShowToast("Zdjęcie zmieniono" , "Informacje", 4000,"success" , true , false);
                        this.GetDataSegments();
                        this.imgRdn();
                        });
                    }else{
                        console.log('jestem w Add File');
                        this.AddNewFile(DataImagesTemp,FileTemp).then(() => {
                        this.ShowToast("Zdjęcie dodano" , "Informacje", 4000,"success" , true , false);
                        this.GetDataSegments();
                        this.imgRdn();
                        });
                    }
                    this.file=null;
                    this.file2=null;
                    this.DataObjectImageID=null;
                }
            }
        },
        CountTasks: function(dataTexts,type){
            // if(type === "success") return dataTexts.filter(x => x.DataInt > 0).length;
            if(type === 'failure') return dataTexts.filter(x => x.DataInt === 0||x.DataInt === -1).length;
            if(type === 'none') return dataTexts.filter(x => x.DataInt === null).length;
            
        },
        CloseNest(){
            this.$emit('CloseNest', null);
        },
        ChangePosition(){
          let SegTemp = [];
            if(this.SegDatas !== null) {
                this.SegDatas.forEach((element,index) => {
                    if(element.Position !== index){
                        element.Position = index;
                        SegTemp.push({ID:element.ID,Position:element.Position});
                    } 
                });
            }
            if(SegTemp.length !== 0) this.UpdatePosition(SegTemp);  
        },
        ChangeDataTextPosition(dataTexts,segDataID){
          let DataText = [];
            if(dataTexts !== null) {
                dataTexts.forEach((element,index) => {
                    if(element.Position !== index || element.SegDataID !== segDataID){
                        element.Position = index;
                        element.SegDataID = segDataID;
                        DataText.push({ID:element.ID,Position:element.Position,SegDataID:segDataID});
                    } 
                });
            }
            console.log("Zmienione lementy: ",DataText)
            if(DataText.length !== 0) this.UpdateDataTextPosition(DataText);  
        },
        ChangeDataObjectPosition(dataObjects,segDataID){
            let DataObjectsTemp = [];
            if(dataObjects !== null) {
                dataObjects.forEach((element,index) => {
                    if(element.Position !== index || element.SegDataID !== segDataID){
                        element.Position = index;
                        element.SegDataID = segDataID;
                        DataObjectsTemp.push({ID:element.ID,Position:element.Position,SegDataID:segDataID});
                    } 
                });
            }
            console.log("Zmienione lementy: ",DataObjectsTemp)
            if(DataObjectsTemp.length !== 0) this.UpdateDataObjectPosition(DataObjectsTemp);
        },
        UpdatePosition(segTemp){
            axios.put('http://localhost:5000/api/SegData/updatePosition',segTemp,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Save DataSegArea: ",res.data);
                        this.ShowToast("Zmiany zostaly zapisane" , "Informacje", 4000,"success" , true , false);
                    }
                }, err =>{
                    console.log("Save DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        UpdateDataTextPosition(segDataText){
            axios.put('http://localhost:5000/api/SegData/updateDataTextPosition',segDataText,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Save DataSegArea: ",res.data);
                        this.ShowToast("Zmiany zostaly zapisane" , "Informacje", 4000,"success" , true , false);
                    }
                }, err =>{
                    console.log("Save DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        UpdateDataObjectPosition(dataObjects){
            axios.put('http://localhost:5000/api/SegData/updateDataObjectPosition',dataObjects,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Save DataSegArea: ",res.data);
                        this.ShowToast("Zmiany zostaly zapisane" , "Informacje", 4000,"success" , true , false);
                    }
                }, err =>{
                    console.log("Save DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        UpdateNestWidth(nestObject){
            axios.put('http://localhost:5000/api/SegNested/Width',nestObject,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Save DataSegArea: ",res.data);
                        this.ShowToast("Zmiany zostaly zapisane" , "Informacje", 4000,"success" , true , false);
                    }
                }, err =>{
                    console.log("Save DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        GetDataSegments(){
            
            axios.get('http://localhost:5000/api/SegData/ByMainId/'+this.ClickedNest.ID,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("All SegData: ",res.data);
                        this.SegDatas = res.data.SegDatas;
                        
                    }
                }, err =>{
                    console.log("All SegData ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                  
                })
        },
        AddSegData(fieldType){
            let SegData;
            if(fieldType==='Image' || fieldType==='Character'){
                 SegData = {
                    SegNestedID: this.ClickedNest.ID,
                    Type : fieldType,
                }
            }else{
                SegData = {
                    SegNestedID: this.ClickedNest.ID,
                    Type : fieldType,
                    DataTexts : [
                        {FieldType:fieldType},
                    ]
                }
            }

            axios.post('http://localhost:5000/api/SegData/',SegData,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Add DataSegArea: ",res.data);
                        this.ShowToast("Dodano element" , "Informacje", 2000,"success" , true , false);
                        console.log("Add Seg Data ",res.data.segData , this.ClickedNest);
                        
                        this.SegDatas.push(res.data.segData);
                    }
                }, err =>{
                    console.log("Add DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        AddDataText(segData,fieldType){
            console.log("asdasd",segData.ID);
            let DataText = {
                    SegDataID:segData.ID,
                    FieldType:fieldType,
                    Height:'4',
                }
            axios.post('http://localhost:5000/api/SegData/dataText/',DataText,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Add DataSegArea: ",res.data);
                        this.ShowToast("Dodano element" , "Informacje", 2000,"success" , true , false);
                        if(segData.DataTexts != null)segData.DataTexts.push(res.data.dataText);
                        else segData.DataText = [res.data.dataText];
                    }
                }, err =>{
                    console.log("Add DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        AddDataObject(segData,fieldType){
            
            let DataObject = {
                    SegDataID:segData.ID,
                    FieldType:fieldType,
                }
            axios.post('http://localhost:5000/api/SegData/dataObject/',DataObject,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Add DataSegArea: ",res.data);
                        this.ShowToast("Dodano element" , "Informacje", 2000,"success" , true , false);
                        // this.GetDataSegments();
                        if(segData.DataObjects != null)segData.DataObjects.push(res.data.dataObject);
                        else segData.DataObjects = [res.data.dataObject];
                    }
                }, err =>{
                    console.log("Add DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        AddCoppyDataObject(dataObject,segData){
            
            axios.put('http://localhost:5000/api/SegData/dataObjectCoopy/',dataObject,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Add DataSegArea: ",res.data);
                        this.ShowToast("Dodano element" , "Informacje", 2000,"success" , true , false);
                        segData.DataObjects.push(res.data.dataObject);
                    }
                }, err =>{
                    console.log("Add DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        AddDataField(DataObject,fieldType){
            
            let DataField = {
                    DataObjectID:DataObject.ID,
                    FieldType:fieldType,
                }
            axios.post('http://localhost:5000/api/SegData/dataField/',DataField,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Add DataSegArea: ",res.data);
                        this.ShowToast("Dodano element" , "Informacje", 2000,"success" , true , false);
                        if(DataObject.DataFields != null) DataObject.DataFields.push(res.data.dataField);
                        else DataObject.DataFields = [res.data.dataField];
                    }
                }, err =>{
                    console.log("Add DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        SaveSegData(element){
            axios.put('http://localhost:5000/api/SegData/update',element,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Save DataSegArea: ",res.data);
                        this.ShowToast("Zmiany zostaly zapisane" , "Informacje", 2000,"success" , true , false);
                        this.SegEdit = null;
                    }
                }, err =>{
                    console.log("Save DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        SaveDataText(dataText){
            axios.put('http://localhost:5000/api/SegData/updateDataText',dataText,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Save DataSegArea: ",res.data);
                        this.ShowToast("Zmiany zostaly zapisane" , "Informacje", 2000,"success" , true , false);
                        this.SegEdit = null;
                    }
                }, err =>{
                    console.log("Save DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        SaveDataObject(dataObject){
            axios.put('http://localhost:5000/api/SegData/updateDataObject',dataObject,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Save DataSegArea: ",res.data);
                        this.ShowToast("Obiekt został zapisany" , "Informacje", 2000,"success" , true , false);
                        
                    }
                }, err =>{
                    console.log("Save DataSegArea ERROR: ",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
        },
        RemoveSegData(segData,segDataIndex){
             this.ShowModal("Czy na pewno chcesz usunąć element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
                if(value){
                    axios.post('http://localhost:5000/api/SegData/remove',segData,{
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    })
                        .then(res=>{
                            if(res.status === 200){
                                console.log("Remove DataSegArea: ",res.data);
                                this.ShowToast("Zmiany zostaly zapisane" , "Informacje", 2000,"info" , true , false);
                                this.SegEdit = null;
                                this.SegDatas.splice(segDataIndex, 1);
                            }
                        }, err =>{
                            console.log("Remove DataSegArea ERROR: ",err)
                            this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                        })
                }
             })
        },
        RemoveDataText(dataText,textIndex,segData){
             this.ShowModal("Czy na pewno chcesz usunąć ten element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
                if(value){
                    axios.post('http://localhost:5000/api/SegData/removeDataText',dataText,{
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    })
                        .then(res=>{
                            if(res.status === 200){
                                console.log("Remove DataText: ",res.data);
                                this.ShowToast("Element ususnięto poprawnie" , "Informacje", 2000,"info" , true , false);
                                segData.DataTexts.splice(textIndex, 1);
                            }
                        }, err =>{
                            console.log("Remove DataText ERROR: ",err)
                            this.$store.commit('UseAlert', ['danger ','Błąd operacji serwera', 5])
                        })
                }
             })
        },
        RemoveDataImage(element){
             this.ShowModal("Czy na pewno chcesz usunąć ten element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
                if(value){
                    axios.post('http://localhost:5000/api/SegData/removeDataImage',element,{
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    })
                        .then(res=>{
                            if(res.status === 200){
                                console.log("Remove DataSegArea: ",res.data);
                                this.ShowToast("Element ususnięto poprawnie" , "Informacje", 2000,"info" , true , false);
                                this.GetDataSegments();
                            }
                        }, err =>{
                            console.log("Remove DataSegArea ERROR: ",err)
                            this.$store.commit('UseAlert', ['danger ','Błąd operacji serwera', 5])
                        })
                }
             })
        },
        RemoveDataObject(dataObject,dataObjectIndex,segData){
             this.ShowModal("Czy na pewno chcesz usunąć ten element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
                if(value){
                let dataObjectTemp = {
                    ID:dataObject.ID,
                }
                axios.post('http://localhost:5000/api/SegData/removeDataObject',dataObjectTemp,{
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                    .then(res=>{
                        if(res.status === 200){
                            console.log("Remove DataSegArea: ",res.data);
                            this.ShowToast("Element ususnięto poprawnie" , "Informacje", 2000,"info" , true , false);
                            // this.GetDataSegments();
                            segData.DataObjects.splice(dataObjectIndex, 1);
                        }
                    }, err =>{
                        console.log("Remove DataSegArea ERROR: ",err)
                        this.$store.commit('UseAlert', ['danger ','Błąd operacji serwera', 5])
                    })
                }
             })
        },
        RemoveDataField(dataField){
             this.ShowModal("Czy na pewno chcesz usunąć ten element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
                if(value){
                    let dataFieldTemp = {
                        ID:dataField.ID,
                    }
                    axios.post('http://localhost:5000/api/SegData/removeDataField',dataFieldTemp,{
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    })
                        .then(res=>{
                            if(res.status === 200){
                                console.log("Remove DataSegArea: ",res.data);
                                this.ShowToast("Element ususnięto poprawnie" , "Informacje", 2000,"info" , true , false);
                                this.GetDataSegments();
                            }
                        }, err =>{
                            console.log("Remove DataSegArea ERROR: ",err)
                            this.$store.commit('UseAlert', ['danger ','Błąd operacji serwera', 5])
                        })
                }
             })
        },
    }
}
</script>

<style scoped>



     .NDBackground{
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: grey;
        opacity: 0.2;
         z-index: 1;
    }

    .NDContainer{
        position: absolute;
        min-width: 900px;
        max-width: 1500px;
        left: 0; 
        right: 0; 
        margin-left: auto; 
        margin-right: auto; 
        top: 10px;
        height: calc(100% - 20px);
        border-radius: 2px;
        background-color: rgb(238, 238, 238);
        box-shadow: 0px 5px 10px 1px rgba(0,0,0,0.34);
        z-index: 2;
        overflow-y: auto;
        padding: 20px;
        padding-bottom: 400px;
        
    }

    .NDContainer::-webkit-scrollbar {
      height: 0px;
      width: 3px;
    }
  
    .NDContainer::-webkit-scrollbar-thumb{
        background: rgb(255, 255, 255);
    }

    .NDTitle{
        font-size: 20px;
        font-family:Arial, Helvetica, sans-serif;
        font-weight: 550;
        text-align: left;
        width: 100%;
        height: 30px;
       
    }

    .NDCard{
        position: relative;
        background-color: rgb(255, 255, 255);
        border-radius: 3px;
        width: 100%;
        height: auto;
        min-height: 50px;
        margin-top: 10px;
    }

    .NDToolBar{
        padding: 4px;
        height: 30px;
        font-size: 22px;
        background-color: #70787e77;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    
    .NDCustomToolbar{
        margin-right: 20px;
        float: right;
    }

    .EditSegData{
        position: absolute;
        right: -19px;
        font-size: 18px;
        z-index: 5;
    }

    .NDToolBar svg{
        margin-left: 10px;
    }

    .NDToolBar svg:hover ,
    .EditSegData svg:hover{
        margin-left: 10px;
        border-radius: 100%;
        box-shadow: 2px 2px 8px 0px rgb(122, 119, 126);
        cursor: pointer;
    }

    .NDToolBar .IconLeft{
        float: left;
    }

    .NDToolBar .IconRight{
        float: right;
    }

    .IconRight{
        float: right;
    }

    .NDHandle:hover{
        cursor: grab !important;
    }

    


    .TaskHandle{
        cursor: grab;
    }

    .TaskTitle{
        font-size: 15px;
        height: 35px;
    }
    
    .NDTasks{
        padding: 10px;
        border-radius: 5px;
    }

    .NDTasks .row{
        margin: 0;
        
    }

    .NDTaskRow{
        margin-top: 10px;
    }

    .IconTask{
        font-size: 20px;
        margin-left: 5px;
    }

    .IconTask:hover{
        border-radius: 5px;
        box-shadow: 2px 2px 8px 0px rgb(122, 119, 126);
        cursor: pointer;
    }



    .NDImage{
        width: 100%;
        /* max-height: 700px; */
        background: #1c1c1c;
    }

    .ImageConfig{
        width: 100%;
        position:absolute;
        top: 30;
        z-index: 3;
    }


    .wrap{
        margin: 0;
    }

    .NDObject{
        position: relative;
        background-color: rgb(230, 233, 233);
    }

    .NDObject .row{
        margin: 0px;
    }

    .NDObject .form-control-sm{
        height: 25px;
    }

    .NDObject .AddNewStat{
        width: 100%;
    }

    .Stat{
        margin-bottom: 5px;
        margin-right: 5px;
        padding: 0 !important;
    }

    .ObjectAvatar{
        position: relative;
        cursor: pointer;
        width: 225px;
        height: 190px;
        margin: 5px;
        background-color: rgb(168, 166, 173);
        box-shadow: 2px 2px 8px 0px rgb(122, 119, 126);
        border-radius: 4px;
        overflow: hidden;
        transition: 0.5s;
    }

    .ObjectAvatar:hover{
        border-radius: 15px;
    }

    .ObjectAvatar img{
        width: 225px;
        height: 190px;
    }

    .AvatarList{
        width: 125px !important;
        height: 100px !important;
    }

    .AvatarList img{
        width: 125px !important;
        height: 100px !important;
    }

    .ObjectTitle{
        position: absolute;
        bottom: 0;
        width: 100%;
        min-height: 20px;
        max-height: 60px;
        padding: 5px;
        font-size: 12px;
        color: rgb(212, 212, 212);
        background-color: rgba(94, 94, 94, 0.527);
        cursor:grab;
        z-index: 3;
    }

    .item3{
        position: relative;
    }

    .ObjectContainer{
        border-radius: 10px;
        width: 100%;
        min-height: 100px;
        padding: 5px;
        margin-top: 10px;
        margin-bottom: 10px;
        box-shadow: 2px 2px 8px 0px rgb(95, 93, 97);
        position: relative;
    }

    
    .StatRemoveIcon svg:hover{
        border-radius: 5px;
        box-shadow: 2px 2px 9px 0px rgb(122, 119, 126);
        cursor: pointer;
    }

    .ObjectCloseIcon{
        font-size: 25px;
        position: absolute;
        right: 5px;
        top: 2px;
        z-index: 3;
    }

    .ObjectCloseIcon svg:hover{
        border-radius: 5px;
        box-shadow: 2px 2px 9px 0px rgb(122, 119, 126);
        cursor: pointer;
    }

    .ObjectCloseIcon svg{
        margin-bottom: 5px;
    }

    .AddImageObjectIcon{
        position: absolute;
        bottom: calc(50% - 30px);
        left: calc(50% - 30px);
        vertical-align: auto;
        justify-self: auto;
        z-index: 2;
        font-size: 60px;
        transition: 0.3s;
    }

    .ObjectAvatar svg:hover{
        border-radius: 50px;
        box-shadow: 2px 2px 9px 0px rgb(249, 248, 250);
        font-size: 65px;
    }


    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

/*colors*/

    .IconPencil{
        color: rgb(51, 69, 151) ;
    }
    .IconMove{
        color: rgb(51, 69, 151) ;
    }
    .IconSave{
        color: rgb(18, 202, 18) ;
    }
    .IconRemove{
        color: rgb(218, 14, 14) ;
    }
    .IconBack{
        color: rgb(17, 209, 161) ;
    }
    .IconCoppy{
        color: rgb(250, 119, 71);
    }



/* Transition */


    .fade-enter-active, .fade-leave-active {
        transition: all .15s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(-10px);
    }



    .fade-object-enter-active, .fade-object-leave-active {
        transition: all .5s;
    }
    .fade-object-enter, .fade-object-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(-50px);
    }


    
/* SegDaat elements add/remove */
.AddRemove-item {
  display: inline-block;
  margin-right: 10px;
}
.AddRemove-enter-active, .AddRemove-leave-active {
  transition: all 1s;
}
.AddRemove-leave-to,.AddRemove-enter  /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(50px);
}

</style>