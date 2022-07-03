<template>
  <b-container class="AdminPanelContainer" fluid>
    <!-- User Interface controls -->
    <b-row>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Szukaj"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Wyszukaj"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = null">Wyczyść</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filtruj po"
          description="Pozostaw puste by szukać po wszystkich"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
          v-slot="{ ariaDescribedby }"
        >
          <b-form-checkbox-group
            v-model="filterOn"
            :aria-describedby="ariaDescribedby"
            class="mt-1"
          >
            <b-form-checkbox value="ID">ID</b-form-checkbox>
            <b-form-checkbox value="Title">Tytuł</b-form-checkbox>
            <b-form-checkbox value="Description">Opis</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>

    </b-row>

    <!-- Main table element -->
    <transition-group name="list" tag="p">
    <b-table
      :items="Scenerios"
      :fields="fields"
      :filter="filter"
      :filter-included-fields="filterOn"
      stacked="md"
      show-empty
      :key="Scenerios"
      small
      @filtered="onFiltered"
    >
    
      <template #cell(Title)="row">
        {{ row.value }}
      </template>

      <template #cell(More)="row" class="text-right">
        <div class="EditButtons"> 
          <b-button-group>
            <b-button size="sm" @click="row.toggleDetails">
              {{ row.detailsShowing ? 'Mniej' : 'Więcej' }}
            </b-button>
            <b-button variant="danger" @click="removeElement({ID:row.item.ID,Title:row.item.Title})" size="sm">
              Usuń
            </b-button>
          </b-button-group>
        </div>
      </template>

      <template #row-details="row">
        <b-card>
          <b-list-group class="text-left">
            <b-row>
              <b-col class="Avatar text-center" cols="3" > 
                <b-img :src="row.item.DataImages == null ? 'http://localhost:5000/' : 'http://localhost:5000/'+row.item.DataImages[0].Path+'?random='+imgRand" fluid alt="Responsive image">
                </b-img>
              </b-col>
              <b-col>
                <div v-for="(value, key) in row.item" :key="key">
                <b-list-group-item button v-show="key!=='_showDetails'" >
                  
                  <b-row >
                    <b-col cols="3"> {{ key }}:  </b-col>
                    <b-col v-if="key === 'DataImages'"> {{ value[0].Path}} </b-col>
                    <b-col v-else >{{ value }} </b-col>
                  </b-row>
                  
                </b-list-group-item>
                </div>
              </b-col>
            </b-row>
          </b-list-group>
        </b-card>
      </template> 
    

    </b-table>
    </transition-group>
  </b-container>
</template>

<script>
import {FileUpload} from '../Mixins/FileUpload.js'
import {UserMessage} from '../Mixins/UserMessage.js'
import {ScenerioElement} from '../Mixins/ScenerioElement.js'

  export default {
    mixins: [FileUpload , UserMessage , ScenerioElement],
    data() {
      return {

        Scenerios:null,
        items:[
            {fname:'clark',lname:'cent',height:'5'},
            {fname:'lakoj',lname:'cent',height:'4'},
            {fname:'malwoj',lname:'cent',height:'345'},
            {fname:'asd',lname:'cent',height:'345'},
        ],

        fields: [
          { key: 'ID', label: 'ID', sortable: true, sortDirection: 'desc' },
          { key: 'Title', label: 'Tytuł', sortable: true, class: 'text-center' , sortDirection: 'desc' },
          { key: 'Description', label: 'Opis', sortable: true, class: 'text-center' },
          { key: 'More', label: 'Więcej' , sortable: false, class: 'text-center'  }
        ],
        totalRows: 1,
        sortBy: '',
        filter: null,
        filterOn: [],
      }
    },
    computed: {
    },
    mounted() {
      // Set the initial number of items
      this.getallAdm();
      if(this.Scenerios !== null)this.totalRows = this.Scenerios.length;
    },
    methods: {
      info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      }
    }
  }
</script>

<style scoped>
  .Avatar img{
    max-height: 500px;
    width: 100%;
  }
  .EditButtons{
    width: 150px;
    float: right;
  }

  .AdminPanelContainer{
    padding: 50px;
  }

  .list-item {
  display: inline-block;
  margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }


</style>