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
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {}
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
    },

    //获取数据
    async getData(){
      const {data:ret} = await this.$axios.get('rank')
      this.allData = ret
      this.allData.sort((a,b)=>{
        return b.value - a.value
      })
      this.updateChart()
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
               } else if(arg.value > 200){
                 targetArr = colorArr[1]
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
               } else {
                 targetArr = colorArr[2]
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
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
  }
}
</script>

<style scoped>

</style>
