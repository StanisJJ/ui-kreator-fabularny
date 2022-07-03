
import axios from 'axios';
export const NestElements = {
    data(){
        return {
            
        }
    },
    computed: {
    },
    methods:{
        UpdateNest(nest){
            let DataImagesTemp
            if(nest.DataImages === null){
                DataImagesTemp = {
                    SegNestedID : nest.ID,
                }
            }else{
                DataImagesTemp = nest.DataImages;
            }

            if(this.file !== null){
                if(nest.DataImages === null){
                    this.AddNewFile(DataImagesTemp,this.file).then(() => {
                        console.log("Zdjęcie dodano")
                        this.file=null;
                        });
                }else{
                    this.UpdateFile(DataImagesTemp,this.file).then(() => {
                        console.log("Zdjęcie Zmieniono")
                        this.file=null;
                        });
                }
            }
            
            axios.put('http://localhost:5000/api/SegNested',nest,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res=>{
                        console.log("Update nest",res.data);
                        this.NestEdit = false;
                        this.ShowToast("Zmiany zostały zapisane" , "Sukces", 3000,"success" , true , false)
                        this.GetMainByID(nest.SegMainID);
                    }, err =>{
                        console.log("Update Error",err);
                        this.NestEdit = false;
                    })
                
        },
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
            console.log("Nest Elements:" , nestTemp , "AllMains:" , this.Scenerio.Mains);
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
                    if(main.SegNesteds != null) main.SegNesteds.push(res.data.nest);
                    else main.SegNesteds = [res.data.nest];
                    this.ShowToast("Element dodany" , "Sukces", 2000,"success" , true , false)
                }, err =>{
                    console.log("AddNest",err);
                })
        },
        RemoveNest(nest){

            this.ShowModal("Czy na pewno chcesz usunąć ten element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
                if(value === true){
                    console.log(nest)
                    let segNest = {
                        ID: nest.ID,
                    };

                    axios.delete('http://localhost:5000/api/SegNested/',{
                        headers:{'Authorization': localStorage.getItem('token')} ,
                        data:  segNest  })
                            .then(res=>{
                                console.log("Delete",res.data);
                                this.ShowToast("Element podrzędny został usunięty" , "info", 2000,"danger" , true , false);
                                this.GetMainByID(nest.SegMainID);
                            }, err =>{
                                console.log("Delete",err);
                            })
                }
            })
        },
    }
}

