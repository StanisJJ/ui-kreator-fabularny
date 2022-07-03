<template>
    <div class="loginContainer">
        <div class="loginBox">
            <div>
                <router-link to="/signup"><div class="LogOrRegButtonForm DisabledDiv" >Rejestracja</div></router-link>
                <router-link to="/login"><div class="LogOrRegButtonForm " >Logowanie</div></router-link>
            </div>
            <div class="FormBox">

            <b-form-group id="input-group-1" label="Email address:" label-for="input-1" >
                <b-form-input id="input-1" v-model="email" type="email" :state="ErrorValidation" placeholder="Enter email" required></b-form-input>
            </b-form-group>

            <b-form-group class="FormLabel" id="input-group-1" label="Password:" label-for="input-1" >
                <b-form-input id="input-1" v-model="password" :state="ErrorValidation" type="password" placeholder="Enter password" required></b-form-input>
                <b-form-invalid-feedback class="RegErrorBox" :state="ErrorValidation" >
                    <li>
                        <span>{{error}}</span>
                    </li>
                </b-form-invalid-feedback>
            </b-form-group>

            <b-button class="submitButton" variant="primary" @click="login">Login</b-button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'Login',
    data(){
        return{
            email: '',
            password: '',
            error: null,
        }
    },
    created(){
        // if(localStorage.getItem('role') !== null) this.$router.push("/");
    },
    computed:{
        ErrorValidation() {return (this.error === null) ? null : false},
    },
    methods: {
        login(){
            this.$store.commit('SetLoadingWheel', {set:true , name:"main"});
            let user = {
                email: this.email,
                password: this.password
            }
            axios.post('http://localhost:5000/api/auth/authenticate',user)
                .then(res=>{
                    if(res.status === 200){
                        console.log(res)
                        localStorage.setItem('token',res.data.Token);
                        localStorage.setItem('role',res.data.Role);
                        this.$store.commit('SetRole', res.data.Role);
                        this.$store.commit('UseAlert', ['success','Witaj w Kreatorze Fabularnym', 5])
                        this.$router.push('/');
                        this.$store.commit('SetLoadingWheel', {set:false , name:"main"});
                    }
                }, err =>{

                    if (!err.response) {
                        // network error
                        this.error = 'Błąd połączenia z serwerem';
                    } else {
                        this.error = err.response.data.message
                    }
                    this.$store.commit('SetLoadingWheel', {set:false , name:"main"});
                    
                })
            // this.$store.commit('SetLoadingWheel');
            
        },
    }
}
</script>

<style scoped>

.loginContainer{
    width: 100%;
    height: calc(100% - 60px);
    padding: 0;
    justify-content: center;
    display: flex;
    align-items: center;
    background-position: center center;
    background-size: cover;
    background-image: linear-gradient(rgba(116, 113, 113, 0.322), rgba(92, 91, 91, 0.308)) , url("../assets/img/groundDice.jpg");
  }

  .loginBox{
    display: flex;
    flex-direction: column;
    width: 350px;
    background: rgb(255, 255, 255);
    border-radius: 6px;
    box-shadow: 0 5px 30px rgba(0,0,0,0.5);
    text-align: left;
  }

</style>