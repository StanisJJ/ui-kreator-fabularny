<template>
  <b-container fluid>
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
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>

    </b-row>

    <!-- Main table element -->
    <transition-group name="list" tag="p">
    <b-table
      :items="Mains"
      :fields="fields"
      :filter="filter"
      :filter-included-fields="filterOn"
      stacked="md"
      show-empty
      :key="Mains"
      small
      @filtered="onFiltered"
    >
      <template #cell(Title)="row">
        {{ row.value }}
      </template>

      <template #cell(More)="row" class="float-right">
        <div class="EditButtons"> 
          <b-button-group>
            <b-button size="sm" @click="row.toggleDetails">
              {{ row.detailsShowing ? 'Mniej' : 'Więcej' }}
            </b-button>
            <b-button variant="danger" @click="DeleteMainAdm({ID:row.item.ID,Title:row.item.Title},row)" size="sm">
              Usuń
            </b-button>
          </b-button-group>
        </div>
      </template>

      <template #row-details="row">
        <b-card>
          <b-list-group class="text-left">
            <b-row>
              <b-col>
                <div v-for="(value, key) in row.item" :key="key">
                <b-list-group-item button v-show="key!=='_showDetails'" >
                  
                  
                  <b-row v-if="key==='SegScenerio'">
                     <b-col cols="3"> {{ key }}:  </b-col>
                     <b-col > 
                      <ul>
                        <div v-for="(li, likey) in value" :key="likey"> 
                        <li v-if="likey !== 'DataImages'">
                           <p v-if="likey === 'SegMains'">
                             {{likey}} count : {{li.length}}
                          </p>
                           <p v-else>{{likey}} : {{li}}</p>
                        </li>
                        </div>
                      </ul> 
                    </b-col>
                  </b-row>
                  <b-row v-else-if="key==='SegNesteds'">
                     <b-col cols="3"> {{ key }} Count:  </b-col>
                     <b-col > 
                             {{value.length}} 
                      </b-col>
                  </b-row>
                  <b-row v-else>
                    <b-col cols="3"> {{ key }}:  </b-col>
                    <b-col >{{ value }} </b-col>
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
import {MainElements} from '../Mixins/MainElements.js'

  export default {
    mixins: [FileUpload , UserMessage , MainElements],
    data() {
      return {

        Mains:null,

        fields: [
          { key: 'ID', label: 'ID', sortable: true, sortDirection: 'desc' },
          { key: 'Title', label: 'Tytuł', sortable: true, class: 'text-center' , sortDirection: 'desc' },
          { key: 'More', label: 'Więcej' , sortable: false, class: 'text-right'  }
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
      this.GetMainAdm();
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