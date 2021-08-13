<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data(){
    return{
      chartInstance:null,
      allData:null,
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
  },
  methods:{
    //屏幕适配
    screenAdapter(){
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    //初始化
    async initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.map_ref,'chalk')
      //获取中国地图矢量数据
      const ret = await axios.get('http://localhost:8009/static/map/china.json')
      this.$echarts.registerMap('china',ret.data)
      //图表初始化配置的控制
      const initOption = {
        title:{
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo:{
          type:'map',
          map:'china',
          top:'5%',
          bottom:'5%',
          itemStyle:{
            areaColor:'#2E72BF',
            borderColor:'#333'
          }
        },
        legend:{
          left:'5%',
          bottom:'5%',
          orient:'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    //获取数据
    async getData(){
      const {data:ret} = await this.$axios.get('map')
      this.allData = ret
      this.updateChart()
    },
    //更新图表
    updateChart(){
      //图例的数据
      const legendArr = this.allData.map(item=>{
        return item.name
      })

      const seriesArr = this.allData.map(item=>{
        return {
          //一个类别的多个散点
          //散点需要配置
          type:'effectScatter',
          rippleEffect:{
            scale:5,
            brushType:'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem:'geo'
        }
      })
      const dataOption = {
        legend:{
          data:legendArr
        },
        series:seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
  }
}
</script>

<style scoped>

</style>
