import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    AlertData: null,
    LoadingWheel: {
      set: null,
      name: "main"
    },
    ActiveScenerio: null,
    ToastData: null,
    Role:null,
    Witaj:"jestok"
  },
  mutations: {
    UseAlert(state , nv){
      var data = { 
                 variant: nv[0],
                 message: nv[1],
                 dismissSecs: nv[2],
             }
      this.state.AlertData = data;
    },
    ClearAlert(){
      this.state.AlertData = null;
    },
    UseToast(state , nv){
      var data = { 
                 variant: nv[0],
                 message: nv[1],
                 title: nv[2],
                 time: nv[3],
                 hide: nv[4],
             }
      this.state.ToastData = data;
    },
    SetLoadingWheel(state , WheelValue){
      // console.log("wheel" , WheelValue.name)
      this.state.LoadingWheel = WheelValue
    },
    SetActiveScenerio(state , scenerio){
      this.state.ActiveScenerio = scenerio
    },
    SetRole(state , roleT){
      this.state.Role = roleT;
    }
    
  },
  actions: {
  },
  modules: {
  },
  getters: {
    GetActiveScenerio(){
      return this.state.ActiveScenerio
    },
  }

})
