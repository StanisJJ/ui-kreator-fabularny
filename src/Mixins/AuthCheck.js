import axios from 'axios'
export const AuthCheck = {
    data(){
        return {
            Role:null,
        }
    },
    computed: {
    },
    methods:{
        Authorize(){
            axios.post('http://localhost:5000/api/user/GetRole',"",{
                   headers: {
                       Authorization: localStorage.getItem('token')
                   }
               })
                   .then(res=>{
                       if(res.data.Role === localStorage.getItem('role')){
                         console.log("Auth checked");
                         this.$store.commit('SetRole', res.data.Role);
                       }else{
                         this.$store.commit('SetRole', null);
                         this.$router.push('/Login');
                       }
                       
                   }, err =>{
                       console.log(err);
                   })
           },
    }
}

