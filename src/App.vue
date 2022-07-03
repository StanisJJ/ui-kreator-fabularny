<template>
  <div id="app">
  <div>
  <b-navbar class="LogedNavbar" toggleable="lg" type="dark" variant="info">
    

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-navbar-brand href="/" :active="$route.fullPath === '/'" ><b-icon icon="house" scale="2"></b-icon></b-navbar-brand>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item v-if="Role==='Admin'" href="/adminPanelScenerio" :active="$route.matched.some(({ name }) => name === 'adminPanelScenerio')">ADM scenarjusze</b-nav-item>
        <b-nav-item v-if="Role==='Admin'" href="/adminPanelMain" :active="$route.matched.some(({ name }) => name === 'adminPanelMain')">ADM Bloki Główne</b-nav-item>
        <b-nav-item href="/test" :active="$route.matched.some(({ name }) => name === 'admin')">Test</b-nav-item>
        <b-nav-item href="/scenerio" :active="$route.matched.some(({ name }) => name === 'scenerio')">Scenariusze</b-nav-item>
        <!-- <b-nav-item v-if="Role==='Admin'" href="/test2" :active="$route.matched.some(({ name }) => name === 'test2')">Test</b-nav-item> -->
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-form v-if="Role !== null">
          <b-button-group>
          <b-form-input v-model="search" size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" @click="search = null">Clear</b-button>
          </b-button-group>
        </b-nav-form>

        <b-nav-item-dropdown v-if="Role !== null" right>
          <template #button-content>
              <b-icon icon="person-circle" aria-hidden="true"></b-icon> Profil
          </template>
          <b-dropdown-item href="/profile">Profil</b-dropdown-item>
          <b-dropdown-item @click="LogOut">Wyloguj</b-dropdown-item>
        </b-nav-item-dropdown>

      

        <div class="NavButtons" v-else>
          <b-button-group>
            <b-button size="sm" variant="primary" href="/login">Zaloguj</b-button>
            <b-button size="sm" variant="primary" href="/signup">Zarejestruj</b-button>
          </b-button-group>
        </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>

    

    <Alert/>
    <LoadingWheel MyName="main"/>
    <Toast/>

      <router-view :search="search"/>
  </div>
</template>

<script>
import Alert from './components/Alert.vue';
import LoadingWheel from './components/LoadingWheel.vue';
import Toast from './components/Toast.vue';
import {AuthCheck} from './Mixins/AuthCheck.js'


export default{
  components: { Alert, LoadingWheel, Toast},
  mixins: [AuthCheck],
    name : 'App',
    data(){
        return{
          search: null,
        }
    },
    created(){
      
    },
    mounted(){
      this.Authorize();
    },
    watch: {
      "$store.state.Role"(variable) {
        this.Role = variable;
      }
    },
    methods:{
      test(){
        console.log(this.$router);
      },
      LogOut(){
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        this.$store.commit('SetRole', null);
        this.$router.push('/Login');
      },
    }

}
</script>

<style lang="scss">
  @import 'assets/styles.css';


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  height: 100%;
}


#nav {
  padding: 30px;


  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

}

.NavButtons{
  margin-left: 10px;
}

.NavButtons button{
  margin-left: 10px;
}


</style>
