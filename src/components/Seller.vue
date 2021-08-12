<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      chartInstance:null,
      allData:null,
      currentPage:1,//当前显示的页数
      totalPage:0,
    }
  },
  mounted() {
    this.initChart()
    this.getData()
  },
  methods:{
    //初始化
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
    },
    //获取数据
    async getData(){
      const {data:ret} = await this.$axios.get('seller')
      this.allData = ret
      this.allData.sort((a,b)=>{
        return a.value - b.value //从小到大
      })
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateChart()
    },
    //更新图表
    updateChart(){
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item)=>{
        return item.name
      })
      const sellerValues = showData.map((item)=>{
        return item.value
      })
      const option = {
        xAxis:{
          type:'value'
        },
        yAxis:{
          type:'category',
          data:sellerNames
        },
        series:[
          {
            type:'bar',
            data:sellerValues
          }
        ]
      }
      this.chartInstance.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
