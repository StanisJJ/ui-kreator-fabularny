<template>
    <div class="ProfileContainer">
        <div class="ProfileBox">

                <div class="FormBox" v-if="Profile !==null">
                    <b-row>
                        <b-col><b-icon icon="person-square" class="mt-1 ml-3" scale="3"></b-icon></b-col>
                        <b-col> Typ konta:{{Profile.Role}}</b-col>
                    </b-row>
                <hr>
            
                <b-form-group id="input-group-1" label="Login:" label-for="input-1" >
                    <b-form-input  id="input-1" v-model="Profile.Login" type="text" placeholder="Podaj login" required></b-form-input>
                </b-form-group>
     
                <b-form-group id="input-group-1" label="Email:" label-for="input-1" >
                    <b-form-input  id="input-1" v-model="Profile.Email" type="email" placeholder="Podaj email" required></b-form-input>
                </b-form-group>
 
                <b-form-group id="input-group-1" label="Imie:" label-for="input-1" >
                    <b-form-input  id="input-1" v-model="Profile.Fname" type="text" placeholder="Imie" required></b-form-input>
                </b-form-group>
     
                <b-form-group id="input-group-1" label="Nazwisko:" label-for="input-1" >
                    <b-form-input  id="input-1" v-model="Profile.Lname" type="text" placeholder="Nazwisko" required></b-form-input>
                </b-form-group>

                <b-button @click="SaveProfile()" type="submit" variant="primary">Zapisz zmiany</b-button>

                <div class="Errors mt-3" v-if="ErrorMes != null"> 
                    <li  v-for="mes in ErrorMes" :key="mes">
                        {{mes}}
                    </li>
                </div>

                </div>

                <div v-else class="m-3 Errors">
                    Błąd Danych
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
            Profile:null,
            ErrorMes:null,
        }
    },
    created(){
        this.GetProfile();
    },
    computed:{
    },
    methods: {
        GetProfile() {
            axios.post('http://localhost:5000/api/User/Profile','',{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res => {
                        this.Profile = res.data.UserProfile;
                        console.log(res.data);
                    }, err => {
                        console.log("------Error------",err.response)
                    })
        },
        SaveProfile() {
            axios.post('http://localhost:5000/api/User/SaveProfile',this.Profile,{
                headers: {
                    Authorization: localStorage.getItem('token')
                }})
                    .then(res => {
                        if(res.data.Item1 == true) this.$store.commit('UseAlert', ['success','Profil zaktualizowany',4]);
                        else this.ErrorMes = res.data.Item2;
                    }, err => {
                        console.log("------Error------",err.response)
                    })
        }
        
    }
}
</script>

<style scoped>

    .ProfileContainer{
        width: 100%;
        height: auto;
        padding: 0;
        justify-content: center;
        display: flex;
        align-items: center;
        background-position: center center;
        background-size: cover;

    }

    .ProfileBox{
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        width: 400px;
        background: rgb(255, 255, 255);
        border-radius: 6px;
        box-shadow: 0 5px 30px rgba(0,0,0,0.5);
        text-align: left;
    }

    .FormBox{
        margin: 35px; 
    }

    .Errors{
        color: rgb(218, 14, 14) ;
    }

</style>