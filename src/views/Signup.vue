<template>
    
        <div class="SignUpContainer">
        <div class="loginBox">
            <div>
                <router-link to="/signup"><div class="LogOrRegButtonForm" >Rejestracja</div></router-link>
                <router-link to="/login"><div class="LogOrRegButtonForm DisabledDiv" >Logowanie</div></router-link>
            </div>
            <div class="FormBox">
            <b-form @submit="signup" >

                <b-form-group id="input-group-1" label="Login:" label-for="input-1" >
                    <b-form-input  id="input-1" :state="LoginValidation" v-model="login" type="text" placeholder="Podaj login" required></b-form-input>
                    <b-form-invalid-feedback class="RegErrorBox" :state="LoginValidation" >
                        <li v-for="(item,index) in LoginErrorsArray" v-bind:key="index" >
                            <span>{{item.mes}}</span>
                        </li>
                    </b-form-invalid-feedback>
                </b-form-group>
                

                <b-form-group class="FormLabel" id="input-group-2" label="Addres Email:" label-for="input-1" >
                    <b-form-input id="input-2" v-model="email"  type="email" :state="EmailValidation" placeholder="Podaj email" required></b-form-input>
                    <b-form-invalid-feedback class="RegErrorBox" :state="EmailValidation" >
                        <li v-for="(item,index) in EmailErrorsArray" v-bind:key="index" >
                            <span>{{item.mes}}</span>
                        </li>
                    </b-form-invalid-feedback>
                </b-form-group>
                

                <b-form-group class="FormLabel" id="input-group-4" label="Hasło:" label-for="input-1" >
                    <b-form-input id="input-3" v-model="password" :state="PasswordValidation" type="password" placeholder="Podaj hasło"  required></b-form-input>
                </b-form-group>

                <b-form-group class="FormLabel" id="input-group-3" label="Hasło potwierdzające:" label-for="input-1" >
                    <b-form-input id="input-4" v-model="confirmpassword" type="password" :state="PasswordValidation" placeholder="podaj potwierdzenie hasła" autocomplete="off" required></b-form-input>
                    <b-form-invalid-feedback class="RegErrorBox" :state="PasswordValidation" >
                        <li v-for="(item,index) in PasswordErrorsArray" v-bind:key="index" >
                            <span>{{item.mes}}</span>
                        </li>
                    </b-form-invalid-feedback>
                    
                    <b-form-invalid-feedback class="RegErrorBox" :state="ErrorValidation" >
                        <li>
                            <span>{{error}}</span>
                        </li>
                    </b-form-invalid-feedback>

                </b-form-group>
                

                <b-button class="submitButton" type="submit" variant="primary">Dołącz</b-button>

            </b-form>
            </div>
        </div>
        </div>
    
</template>
<script>
import axios from 'axios';


export default {
    name: 'Signup',
    data(){
        return{
            login: '',
            email: '',
            confirmpassword: '',
            password: '',

            error: null,

            LoginErrors: {block:null,tab:[
                        {status:false , mes:"login jest zbyt krótki" , server:false},
                        {status:false , mes:"login jest zbyt długi" , server:false},
                        {status:false , mes:"login zajęty" , server:true},
                        ]},

            PasswordErrors: {block:null,tab:[
                        {status:false , mes:"Hasła nie są takie same" , server:false},
                        {status:false , mes:"Co najmniej 6 znaków" , server:false},
                        ]},

            EmailErrors: {block:null,tab:[
                        {status:false , mes:"Email zajęty" , server:true},
                        ]},
            
        }
    },
    created(){
        // if(localStorage.getItem('role') !== null) this.$router.push("/");
    },
    watch: {
        login: function (value) {
            this.LoginErrors.tab[0].status = (value.length < 3) ;
            this.LoginErrors.tab[1].status = (value.length > 40) ;
            if(this.LoginErrors.block==null) this.LoginErrors.block=false;
        },
        pass: function (value) {
            var pass = value.split('|');
            this.PasswordErrors.tab[0].status = (pass[0] !== pass[1]) ;
            this.PasswordErrors.tab[1].status = (pass[0].length < 6) ;
            if(this.PasswordErrors.block==null) this.PasswordErrors.block=false;
        },
        email: function () {
            if(this.EmailErrors.block==null) this.EmailErrors.block=false;
        }
    },
    computed: {
        pass() {return `${this.password}|${this.confirmpassword}`},
        ErrorValidation() {return (this.error === null) ? null : false},

        LoginErrorsArray() {return this.LoginErrors.tab.filter(x => x.status == true)},
        LoginValidation()  {return (this.LoginErrors.block==null) ? null : !this.LoginErrors.tab.some(x=>x.status == true)},

        PasswordErrorsArray() {return this.PasswordErrors.tab.filter(x => x.status == true)},
        PasswordValidation()  {return (this.PasswordErrors.block==null) ? null : !this.PasswordErrors.tab.some(x=>x.status == true)},

        EmailErrorsArray() {return this.EmailErrors.tab.filter(x => x.status == true)},
        EmailValidation()  {return (this.EmailErrors.block==null) ? null : !this.EmailErrors.tab.some(x=>x.status == true)},

        CheckValidation(){
            return this.EmailErrors.block!=null && !this.EmailErrors.tab.some(x=>x.status == true && x.server == false) &&
                this.PasswordErrors.block!=null && !this.PasswordErrors.tab.some(x=>x.status == true && x.server == false) &&
                this.LoginErrors.block!=null && !this.LoginErrors.tab.some(x=>x.status == true && x.server == false) ;
        },
    },
    methods: {
        
        signup(event){
            event.preventDefault()
            
            if(this.CheckValidation){
                this.$store.commit('SetLoadingWheel', {set:true , name:"main"});

                let newUser = {
                Login: this.login,
                Email: this.email,
                ConfirmPassword: this.confirmpassword,
                Password: this.password
                }

                axios.post('http://localhost:5000/api/auth/register',newUser)
                    .then(res => {
                        console.log("------Response-------",res);
                        this.$store.commit('UseAlert', ['success','Twojek konto zostąło utworzone , możesz się zalogować',8])
                        this.$router.push('/login');
                        this.$store.commit('SetLoadingWheel', {set:false , name:"main"});
                    }, err => {
                        console.log("------Error------",err.response)
                        if (!err.response) {
                            // network error
                            this.error = 'Błąd połączenia z serwerem';
                        } else {
                            this.LoginErrors.tab[2].status = (err.response.data.Login !== null);
                            this.EmailErrors.tab[0].status = (err.response.data.Email !== null);
                        }
                        this.$store.commit('SetLoadingWheel', {set:false , name:"main"});
                    })
            }else this.$store.commit('UseAlert', ['warning','Popraw błęd w formularzu',8]);
        },
    }

}
</script>
<style scoped>

.SignUpContainer{
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
    box-shadow: 0 5px 30px 5px rgba(0,0,0,0.5);
    text-align: left;
  }

</style>