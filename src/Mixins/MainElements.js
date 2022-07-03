
import axios from 'axios';
export const MainElements = {
    data(){
        return {
            
        }
    },
    computed: {
    },
    methods:{
        Search(element){
            if(this.search!==null&&this.search!==''){
                if(element.Title === null) return false;
                if(element.Title.toLowerCase().includes(this.search.toLowerCase())) return true;
                return false;
            }else return true;
        },
        ClickNest(element){
            this.ClickedNest = element;
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
       async UpdateMain(main){
            await axios.put('http://localhost:5000/api/SegMain/',main,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res=>{
                        console.log("Position change",res.data);
                        this.Edit = false;
                        this.ShowToast("Zmiany zostały zapisane" , "Sukces", 3000,"success" , true , false)
                    }, err =>{
                        console.log("Position Error",err);
                        this.Edit = false;
                    })
        },
        async UpdateMainStatus(main){
            let mainTemp = {
                ID:main.ID,
                Status:main.Status,
            }
            console.log("main: ",main);
            await axios.put('http://localhost:5000/api/SegMain/Status',mainTemp,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res=>{
                        console.log("Position change",res.data);
                        this.Edit = false;
                        this.ShowToast("Zmiany zostały zapisane" , "Sukces", 3000,"success" , true , false)
                    }, err =>{
                        console.log("Position Error",err);
                        this.Edit = false;
                    })
        },
        async UdataAllMain(MainsTable){
             await axios.put('http://localhost:5000/api/SegMain/all',MainsTable,{
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
        async GetMainByID(mainID){
            await axios.get('http://localhost:5000/api/SegMain/ByMainId/'+mainID,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("Main updated",res.data.main)
                        this.Scenerio.SegMains.forEach((el, index) => {
                            if (el.ID === res.data.main.ID) this.Scenerio.SegMains.splice(index, 1, res.data.main);
                        })
                        this.imgRdn();
                    }
                }, err =>{
                    console.log("Main update ERROR",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało Wprowadzić niektórych zmian', 5])
                })
        },
        async GetMainAdm(){
            await axios.get('http://localhost:5000/api/SegMain/all/',{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    console.log("MainAdm all: ",res);
                    this.Mains = res.data;
                }, err =>{
                    console.log("Main update ERROR",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało Wprowadzić niektórych zmian', 5])
                })
        },
        async GetScenerio(){
            await axios.get('http://localhost:5000/api/SegMain/ByScenId/'+this.ActiveScenerioID,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("getOne",res.data)
                        console.log("only mains",res.data.scenerio.SegMains)
                        this.Scenerio = res.data.scenerio;
                    }
                }, err =>{
                    console.log("getOne",err)
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariusza , błąd servera', 5])
                })
        },
        async AddMain(scenerio){
            let segMain = {
                SegScenerioID: scenerio.ID,
                Color: '#36bdf7'
            };

            await axios.post('http://localhost:5000/api/SegMain/',segMain,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
                })
                .then(res=>{
                    console.log("AddMain",res.data);
                    scenerio.SegMains.push(res.data.main);
                    this.ShowToast("Element dodany" , "Sukces", 4000,"success" , true , false)
                }, err =>{
                    console.log("AddMain",err);
                })
        },
        async DeleteMain(main,mainIndex){
            await this.ShowModal("Czy na pewno chcesz usunąć ten element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
                if(value){
                    let segMain = {
                        ID: main.ID,
                        SegScenerioID: main.SegScenerioID 
                    };

                    axios.delete('http://localhost:5000/api/SegMain/',{
                        headers:{'Authorization': localStorage.getItem('token')} ,
                        data:  segMain  })
                            .then(res=>{
                                console.log("Delete",res.data);
                                this.Scenerio.SegMains.splice(mainIndex, 1);
                                this.ShowToast("Element usunięty" , "Sukces", 4000,"info" , true , false)
                            }, err =>{
                                console.log("Delete",err);
                                this.ShowToast("Wystapił błąd poczas jednej z operacji" , "Błąd", 4000,"danger" , true , false)
                            })
                }
            })
        },
        async DeleteMainAdm(main,row){
            await this.ShowModal("Czy na pewno chcesz usunąć ten element","Potwierdź działanie","Tak","Nie","danger").then(value => { 
                if(value){
                    let segMain = {
                        ID: main.ID,
                        SegScenerioID: main.SegScenerioID 
                    };

                    axios.delete('http://localhost:5000/api/SegMain/',{
                        headers:{'Authorization': localStorage.getItem('token')} ,
                        data:  segMain  })
                            .then(res=>{
                                console.log("Delete",res.data);
                                this.Mains.splice(row.index, 1);
                                this.ShowToast("Element usunięty" , "Sukces", 4000,"info" , true , false)
                            }, err =>{
                                console.log("Delete",err);
                                this.ShowToast("Wystapił błąd poczas jednej z operacji" , "Błąd", 4000,"danger" , true , false)
                            })
                }
            })
        }
    }
}

