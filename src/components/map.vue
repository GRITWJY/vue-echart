<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import {getProvinceMapInfo} from "@/utils/map_utils";

export default {
  data(){
    return{
      chartInstance:null,
      allData:null,
      mapData:{}//所获取的省份地图矢量数据
    }
  },
  created() {
    //组件创建完成后,进行回调函数注册
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action:'getData',
      socketType:'mapData',
      chartName:'map',
      value:''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
    this.$socket.unRegisterCallBack('trendData')
  },
  methods:{
    //双击回到中国地图
    revertMap(){
      const revertOption = {
        geo:{
          map:'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    },

    //屏幕适配
    screenAdapter(){
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        legend:{
          itemWidht: titleFontSize,
          itemHeight: titleFontSize,
          itemGap: titleFontSize/2,
          textStyle:{
            fontSize: titleFontSize/2
          }
        }
      }
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
      this.chartInstance.on('click',async arg=>{
        //中文转换成pinyin
        const provinceInfo = getProvinceMapInfo(arg.name)
        //获取这个省份的地图矢量数据
        //判断是否已经缓存
        if (!this.mapData[provinceInfo.key]){
          const ret = await axios.get('http://localhost:8009' + provinceInfo.path)
          this.mapData[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key,ret.data)
        }

        const changeOption = {
          geo:{
            map:provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    //获取数据
   getData(ret){
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
