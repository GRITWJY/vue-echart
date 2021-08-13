<template>
  <div class="com-container">
    <div class="title">
      <span>我是标题</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice">
        <div class="select-item" v-for="item in selectTypes" :key="item.key">
          {{item.text}}
        </div>

      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      chartInstance:null,
      allData:null,
      timerId:null,//定时器标识
      showChoice:false//是否显示可选项
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    window.removeEventListener('resize',this.screenAdapter)
  },
  computed:{
    selectTypes(){
      if (!this.allData){
        return []
      } else {
        return this.allData.type
      }
    }
  },
  methods:{
    //初始化
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref,'chalk')

      //图表初始化配置的控制
      const initOption = {
        grid:{
          left:'3%',
          top:'35%',
          right:'4%',
          bottom:'1%',
          containLabel:true
        },
        tooltip:{
          trigger:'axis'
        },
        legend:{
          left:20,
          top:'15%',
          icon:'circle'
        },
        xAxis: {
          type:'category',
          boundaryGap:false
        },
        yAxis: {
          type:'value'
        },
      }
      this.chartInstance.setOption(initOption)

      //图表对象鼠标事件监听
      // this.chartInstance.on('mouseover',()=>{
      //   clearInterval(this.timerId)
      // })
      // this.chartInstance.on('mouseout', ()=>{
      //   this.startInterval()
      // })
    },
    //获取数据
    async getData(){
      const {data:ret} = await this.$axios.get('trend')
      this.allData = ret
      this.updateChart()
      this.startInterval()
    },
    //更新图表
    updateChart(){
      const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)',
      ]
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)',
      ]

      //处理数据
      const timeArr = this.allData.common.month//泪目轴
      const valueArr = this.allData.map.data//y轴
      const seriesArr = valueArr.map((item,index) => {
        return {
          name: item.name,
          type:'line',
          data: item.data,
          stack:'map',
          areaStyle:{
            color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[
              {
                color:colorArr1[index],
                offset:0
              },
              {
                color:colorArr2[index],
                offset:1
              },
            ])
          }
        }
      })
      //图例的数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data:timeArr
        },
        legend:{
          data:legendArr
        },
        series:seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    //定时器
    startInterval(){
      if (this.timerId){
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(()=>{
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      },3000)
    },
    screenAdapter(){
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
  }

}
</script>

<style scoped lang="less">
.title{
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}

</style>
