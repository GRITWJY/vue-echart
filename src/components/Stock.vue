<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
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
  computed:{
  },
  methods:{
    //屏幕适配
    screenAdapter(){
      this.titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title:{
          textStyle:{
            fontSize:this.titleFontSize
          }
        },
        legend:{
          itemWidht: this.titleFontSize/2,
          itemHeight: this.titleFontSize/2,
          itemGap:this.titleFontSize/2,
          textStyle: {
            fontSize: this.titleFontSize/2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    //初始化
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref,'chalk')

      //图表初始化配置的控制
      const initOption = {

      }
      this.chartInstance.setOption(initOption)


    },
    //获取数据
    async getData(){
      const {data:ret} = await this.$axios.get('stock')
      this.allData = ret
      this.updateChart()
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

      const showData = this.allData.slice(0,5)
      const seriesArr = showData.map((item,index) => {
        return {
          type: 'pie',
          radius: [110,100],
          center: centerArr[index],
          data: [
            {
              value:item.sales
            },
            {
              value:item.stock
            }
          ]
        }
      })
      const dataOption = {
        series:seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },

  }
}
</script>

<style scoped>

</style>
