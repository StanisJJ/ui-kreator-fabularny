
import axios from 'axios';
export const ScenerioElement = {
    data(){
        return {
            
        }
    },
    computed: {
    },
    methods:{
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
    async  AddNew(event){
            event.preventDefault();
           await axios.post('http://localhost:5000/api/Segment',this.NewScenerio,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        let DataImage = {
                          SegScenerioID : res.data.ScenID
                        }
                        this.AddNewFile(DataImage,this.file).then(() => this.getall());
                        this.$store.commit('UseToast', ['success','Właśnie dodałeś nowy scenariusz', 'Dodano scenariusz' ,4000])
                        Object.keys(this.NewScenerio).forEach(k => this.NewScenerio[k] = null);
                        this.file = null;
                    }
                }, err =>{
                    console.log(err)
                })
    },
    async EditScene(Scen){
      await axios.put('http://localhost:5000/api/Segment',Scen,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log(res.data)
                        this.edit = null;
                        this.UpdateFile(Scen.DataImages[0],this.updateFile).then(() => this.getall());
                    }
                }, err =>{
                    console.log(err)
                    this.$store.commit('UseAlert', ['danger','Niestety zapis nie powiódł sie',6])
                })
    },
    async UpdateScen(Scen){
        await axios.put('http://localhost:5000/api/Segment/All',Scen,{
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
    async removeElement(element) {

        await this.$bvModal.msgBoxConfirm('Czy usunąć elemnt: '+element.Title, {
          title: 'Potwierdź działanie',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Tak',
          cancelTitle: 'Nie',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => { 
            if(value === true){
            axios.delete('http://localhost:5000/api/Segment',{
              headers:{'Authorization': localStorage.getItem('token')} ,
              data:  element  }).then(res=>{
                              if(res.status === 200){
                                  console.log(res.data)
                                  this.getall();
                                  this.$store.commit('UseToast', ['danger','Element: "'+element.Title+'" został usunięty!', 'Usunięto element' ,5000])
                              }
                          }, err =>{
                              console.log(err)
                          })
            }
          })
          .catch(err => {
            console.log("remove Error: ",err)
          })

        
    },
    async getall(){
            this.$store.commit('SetLoadingWheel', {set:true,name:"scenerio"});

           await axios.get('http://localhost:5000/api/Segment',{
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res=>{
                    if(res.status === 200){
                        console.log("getAll",res.data)
                        this.imgRdn()
                        this.Scenerios = res.data.list;
                        this.$store.commit('SetLoadingWheel', {set:false , name:"scenerio"});
                        
                    }
                }, err =>{
                    console.log("getAll",err)
                    this.$store.commit('SetLoadingWheel', {set:false , name:"scenerio"});
                    this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
                })
    },
    async getallAdm(){
        this.$store.commit('SetLoadingWheel', {set:true,name:"scenerio"});

        await axios.get('http://localhost:5000/api/Segment/adm',{
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
            .then(res=>{
                if(res.status === 200){
                    console.log("getAll",res.data)
                    this.imgRdn()
                    this.Scenerios = res.data.list;
                    this.$store.commit('SetLoadingWheel', {set:false , name:"scenerio"});
                    
                }
            }, err =>{
                console.log("getAll",err)
                this.$store.commit('SetLoadingWheel', {set:false , name:"scenerio"});
                this.$store.commit('UseAlert', ['danger ','Nie udało się załadować scenariuszy , błąd servera', 5])
            })
    },
    }
}

