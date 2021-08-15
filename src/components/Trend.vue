<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{'▎'+shwoTitle}}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="comStyle">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
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
      showChoice:false,//是否显示可选项
      choiceType:'map',//显示的数据类型
      titleFontSize:0
    }
  },
  created() {
    //组件创建完成后,进行回调函数注册
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted() {
    this.initChart()
    //this.getData()
    //发送数据给服务器,告诉服务器,我现在需要数据
    this.$socket.send({
      action:'getData',
      socketType:'trendData',
      chartName:'trend',
      value:''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
    //组件销毁,进行回调函数取消
    this.$socket.unRegisterCallBack('trendData')
  },
  computed:{
    selectTypes(){
      if (!this.allData){
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    shwoTitle(){
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    comStyle(){//设置给标题的样式
      return {
        fontSize:this.titleFontSize+'px'
      }
    },
    marginStyle(){
      return{
        marginLeft:this.titleFontSize + 'px'
      }
    }
  },
  methods:{
    handleSelect(currentType){
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    },

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

    },
    //获取数据
    //ret服务端发送给客户端的图标数据
    getData(ret){
      // const {data:ret} = this.$axios.get('trend')
      this.allData = ret
      this.updateChart()
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
      const valueArr = this.allData[this.choiceType].data//y轴
      const seriesArr = valueArr.map((item,index) => {
        return {
          name: item.name,
          type:'line',
          data: item.data,
          stack:this.choiceType,
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
    screenAdapter(){
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend:{
          itemWidth:this.titleFontSize,
          itemHeight:this.titleFontSize,
          itemGap:this.titleFontSize,
          textStyle:{
            fontSize:this.titleFontSize/2
          }
        }
      }
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
  .select-con{
    background-color: #222733;
  }
}

</style>
