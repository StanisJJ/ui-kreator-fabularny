<template>
  <div>
    <div class='drop-zone' @drop='onDrop($event, 1)' @dragover.prevent
      @dragenter.prevent>
      <div 
        class='drag-el' 
        v-for='item in listOne' 
        :key='item.title' 
        draggable
        @dragstart='startDrag($event, item)'
        >
                {{ item.title }}
        </div>
    </div>
    <hr>
    <div class='drop-zone' @drop='onDrop($event, 2)' @dragover.prevent
      @dragenter.prevent>
      <div 
        class='drag-el' 
        v-for='item in listTwo' 
        :key='item.title' 
        draggable
        @dragstart='startDrag($event, item)'
      >
              {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
      {
        id: 0,
        title: 'Item A',
        list: 1
      },
      {
        id: 1,
        title: 'Item B',
        list: 1
      },
      {
        id: 2,
        title: 'Item C',
        list: 2
      }]

      }
    },
    computed: {
      validation() {
        return this.userId.length > 4 && this.userId.length < 13
      },
      listOne () {
      return this.items.filter(item => item.list === 1)
      },
      listTwo () {
        return this.items.filter(item => item.list === 2)
      }
    },
    methods:{
      startDrag: (evt, item) => {
        evt.dataTransfer.dropEffect = 'move'
        evt.dataTransfer.effectAllowed = 'move'
        evt.dataTransfer.setData('itemID', item.id)
        console.log("hello");
      },
      onDrop (evt, list) {
        const itemID = evt.dataTransfer.getData('itemID')
        const item = this.items.find(item => item.id == itemID)
        item.list = list
      },
    }
  }
</script>

<style lang="scss">
  .drop-zone {
    background-color: #eee;
    margin-bottom: 10px;
    padding: 10px;
  }

  .drag-el {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 5px;
  }
  
</style>