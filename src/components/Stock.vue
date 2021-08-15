<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  data(){
    return{
      chartInstance:null,
      allData:null,
      currentIndex:0,
      timerId:null
    }
  },
  created() {
    //组件创建完成后,进行回调函数注册
    this.$socket.registerCallBack("stockData", this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action:'getData',
      socketType:'stockData',
      chartName:'stock',
      value:''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    window.removeEventListener('resize',this.screenAdapter)
    this.$socket.unRegisterCallBack('stockData')
  },
  computed: {
    ...mapState(['theme'])
  },
  watch:{
    theme(){
      this.chartInstance.dispose()//销毁当前图表
      this.initChart()//重新设置主题
      this.screenAdapter()//屏幕是被
      this.updateChart()
    }
  },
  methods:{
    //屏幕适配
    screenAdapter(){
      this.titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = this.titleFontSize * 2.8
      const outterRadius = innerRadius * 1.125
      const adapterOption = {
        title:{
          textStyle:{
            fontSize:this.titleFontSize
          }
        },
        series:[
          {
            type:'pie',
            radius: [innerRadius, outterRadius],
            label:{
              fontSize: this.titleFontSize/2
            }
          },
          {
            type:'pie',
            radius: [innerRadius, outterRadius],
            label:{
              fontSize: this.titleFontSize/2
            }
          },
          {
            type:'pie',
            radius: [innerRadius, outterRadius],
            label:{
              fontSize: this.titleFontSize/2
            }
          },
          {
            type:'pie',
            radius: [innerRadius, outterRadius],
            label:{
              fontSize: this.titleFontSize/2
            }
          },
          {
            type:'pie',
            radius: [innerRadius, outterRadius],
            label:{
              fontSize: this.titleFontSize/2
            }
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    //初始化
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref,this.theme)

      //图表初始化配置的控制
      const initOption = {
          title:{
            text:'▎库存和销量分析',
            left:20,
            top:20
          },

      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover',()=>{
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout',()=>{
        this.startInterval()
      })


    },
    //获取数据
    getData(ret){
      this.allData = ret
      this.updateChart()
      this.startInterval()
    },
    //更新图表
    updateChart(){
      const centerArr = [
        ['18%','40%'],
        ['50%','40%'],
        ['82%','40%'],
        ['34%','75%'],
        ['66%','75%']
      ]

      const colorArr = [
        ['#4FF778','#0BA82C'],
        ['#E5DD45','#E8811C'],
        ['#E8821C','#E55445'],
        ['#5052EE','#AB6EE5'],
        ['#23E5E5','#2E72BF']
      ]

      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1)*5

      const showData = this.allData.slice(start,end)
      const seriesArr = showData.map((item,index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          labelLine:{
            show:false
          },
          label:{
            position: 'center',
            color: colorArr[index][0]
          },
          hoverAnimation:false,
          data: [
            {
              name:item.name + '\n\n' + item.sales,
              value:item.sales,
              itemStyle:{
                color:new this.$echarts.graphic.LinearGradient(0,1,0,0,[
                  {
                    offset:0,
                    color:colorArr[index][0]
                  },
                  {
                    offset:1,
                    color:colorArr[index][1]
                  }
                ])
              }
            },
            {
              value:item.stock,
              itemStyle:{
                color:'#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series:seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },

    startInterval(){
      if (this.timerId){
        clearInterval(this.timerId)
      }

      this.timerId = setInterval(()=>{
        this.currentIndex++
        if(this.currentIndex>1){
          this.currentIndex = 0
        }
        this.updateChart()
      },5000)

    }

  }
}
</script>

<style scoped>

</style>
