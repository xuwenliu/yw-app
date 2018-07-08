<template>
  <div class="application-sidebar">
    <transition name="sidebar">
      <div class="sidebar-container" @click="returnShow" v-show="show">
        <div class="sidebar-overlay" @touchmove.self.prevent>
          <transition name="leftNav">
            <nav v-show="show">
              <div class="slideContent">
                <div class="slideBar-item-slideTitle-layout">
                  <div class="slideBar-item-slideTitle">品牌筛选</div>
                  <div class="slideBarItem-item-item" :class="{'slideBarItem-item-item-selected':inow==-1} "
                       @click="itemClick(0,0,-1)">全部选中
                  </div>
                </div>
                <ul>
                  <li v-for="(item,index) in brandTypes" class="slideBar-item">
                    <div class="slideBarItem-item-subTitle">{{item.parentName}}</div>
                    <ul class="slideBarItem-item-list-layout">
                      <li v-for="(itemItem,index) in item.childTypeVos" class="slideBarItem-item-item"
                          :class="{'slideBarItem-item-item-selected':inow==itemItem.childId}"
                          @click="itemClick(item.parentId,itemItem.childId,itemItem.childId)">
                        {{itemItem.childName}} {{itemItem.count}}
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </nav>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import '../../../assets/css/material-slidebar.css'
  export default {
    name: 'materialList',
    components: {},
    props: ["show", "brandTypes", "choosePosition"],
    data(){
      return {
        inow: -1,
        inowForMaterial: this.choosePosition
      }
    },
    methods: {
      returnShow(){
        this.$emit('returnShow');
      },
      itemClick(parentId, childId, index){
//        console.log("index" + this.inowForMaterial);
        this.inow = index;
        this.$emit("brandId", childId);
      }
    },
    updated(){
//      this.inow = this.inowForMaterial;

      if (this.choosePosition * 1 == 1) {
        this.inow = -1
      }
      console.log("sssss" + this.inowForMaterial)
    }
  }
</script>

<style scoped lang="less">
  .sidebar-enter-active, .sidebar-leave-active {
    transition: all ease .4s;
    -webkit-transition: all ease .4s;
  }

  .sidebar-enter, .sidebar-leave-active {
    opacity: 0;
  }

  .sidebar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: #9a9a9a;
    z-index: 501;

  .sidebar-overlay {
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

  .leftNav-enter-active, .leftNav-leave-active {
    transition: all ease .4s;
    -webkit-transition: all ease .4s;
  }

  .leftNav-enter, .leftNav-leave-active {
    transform: translate3d(100%, 0, 0);
  }

  nav {
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    bottom: 0;
    left: 2.5rem;
    transform: translateX(0px);
    overflow-y: auto;
    -moz-box-shadow: -6px 10px 18px #282828;
    -webkit-box-shadow: -6px 10px 18px #282828;
    box-shadow: -6px 10px 18px #282828;

  }

  }
  }

</style>
