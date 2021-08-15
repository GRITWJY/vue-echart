<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{catName}}</span>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data(){
    return{
      chartInstance:null,
      allData:null,
      currentIndex:0,
      titleFontSize:0
    }
  },
  created() {
    //组件创建完成后,进行回调函数注册
    this.$socket.registerCallBack("hotData", this.getData)
  },
  mounted() {
    this.initChart()
    //this.getData()
    this.$socket.send({
      action:'getData',
      socketType:'hotData',
      chartName:'hotproduct',
      value:''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
  },
  computed: {
    ...mapState(['theme']),
    catName(){
      if (!this.allData){
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    comStyle() {
      return {
        fontSize:this.titleFontSize + 'px'
      };
    }
  },
  methods:{
    //屏幕适配
    screenAdapter(){
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title:{
            textStyle:{
              fontSize:this.titleFontSize
            }
        },
        series:[
          {
            radius:this.titleFontSize * 4.5,
            center:['50%','55%']
          }
        ],
        legend:{
          itemWidht: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap:this.titleFontSize/2,
          textStyle: {
            fontSize: this.titleFontSize
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    //初始化
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)

      //图表初始化配置的控制
      const initOption = {
        title:{
          text:'▎热销商品的占比统计',
          left:20,
          top:20
        },
        series:[
          {
            type:'pie',
            label:{
              show:false
            },
            emphasis:{
              label:{
                show:true
              },
              labelLine:{
                show:false
              }
            }
          }
        ],
        legend:{
          top:'15%',
          icon:'circle'
        },
        tooltip:{
          show:true,
          formatter: arg=>{
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item=>{
              total += item.value
            })
            let retStr = ''
            thirdCategory.forEach(item=>{
              retStr += `
              ${item.name}:${parseInt(item.value / total * 100) + '%'}
              <br/>
              `
            })
            return retStr
          }
        }
      }
      this.chartInstance.setOption(initOption)


    },
    //获取数据
    getData(ret){
      // const {data:ret} = await this.$axios.get('hotproduct')
      this.allData = ret
      this.updateChart()
    },
    //更新图表
    updateChart(){
      const legendData = this.allData[this.currentIndex].children.map(item=>{
        return item.name
      })
      const seriesData = this.allData[this.currentIndex].children.map(item =>{
        return {
          name:item.name,
          value:item.value,
          children:item.children
        }
      })
      const dataOption = {
        series:[
          {
            data:seriesData
          }
        ],
        legend:{
          data:legendData
        }
      }
      this.chartInstance.setOption(dataOption)
    },

    toRight(){
      this.currentIndex--
      if (this.currentIndex < 0){
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toLeft(){
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1){
        this.currentIndex = 0
      }
      this.updateChart()
    },
  },
  watch: {
    theme(){
      console.log("主题切换了")
      this.chartInstance.dispose()//销毁当前图表
      this.initChart()//重新设置主题
      this.screenAdapter()//屏幕是被
      this.updateChart()

    }
  }

}
</script>

<style scoped>
.arr-left{
  z-index: 10;
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right{
  z-index: 10;
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name{
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}

</style>
