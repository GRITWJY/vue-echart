<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      chartInstance:null,
      allData:null,
      startVallue:0,
      endValue:9,
      timerId:null,//定时器标识
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
  methods:{
    //屏幕适配
    screenAdapter(){
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        series:[
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius:[titleFontSize/2, titleFontSize/2, 0,0],
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },

    //初始化
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref,'chalk')

      //图表初始化配置的控制
      const initOption = {
        title:{
          text:'▎地区销售排行',
          left:20,
          top:20
        },
        grid:{
          left:'5%',
          top:'40%',
          right:'5%',
          bottom:'5%',
          containLabel:true
        },
        tooltip:{
          show:true
        },
        xAxis: {
          type:'category'
        },
        yAxis:{
          type:'value'
        },
        series:[{
          type:'bar'
        }]
      }
      this.chartInstance.setOption(initOption)

      this.chartInstance.on('mouseover',()=>{
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', ()=>{
        this.startInterval()
      })
    },

    //获取数据
    async getData(){
      const {data:ret} = await this.$axios.get('rank')
      this.allData = ret
      this.allData.sort((a,b)=>{
        return b.value - a.value
      })
      this.updateChart()
      this.startInterval()
    },

    //更新图表
    updateChart(){
      const colorArr = [
        ['#0BA82C','#4FF778'],
        ['#2E72BF','#23E5E5'],
        ['#5052EE','#AB6EE5']
      ]
      const provinceArr = this.allData.map(item=>{
        return item.name
      })
      const valueArr = this.allData.map(item=>{
        return item.value
      })
      const dataOption = {
        xAxis:{
          data:provinceArr
        },
        series:[
          {
            data:valueArr,
            itemStyle:{
              color: arg => {
                let targetArr = null
                if (arg.value > 300) {
                 targetArr = colorArr[0]
               } else if(arg.value > 200){
                 targetArr = colorArr[1]
               } else {
                 targetArr = colorArr[2]
               }
                return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                  {
                    offset:0,
                    color:targetArr[0]
                  },
                  {
                    offset:1,
                    color:targetArr[1]
                  }
                ])
              }
            }
          }
        ],
        dataZoom:{
          show:false,
          startValue:this.startVallue,
          endValue:this.endValue
        },
      }
      this.chartInstance.setOption(dataOption)
    },

    startInterval(){
      if (this.timerId){
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(()=>{
        this.startVallue++
        this.endValue++
        if (this.endValue > this.allData.length - 1){
          this.startVallue = 0
          this.endValue = 9
        }
        this.updateChart()
      },2000)
    }
  }
}
</script>

<style scoped>

</style>
