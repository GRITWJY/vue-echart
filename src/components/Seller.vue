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
      this.updateChart()
    },
    //更新图表
    updateChart(){
      const sellerNames = this.allData.map((item)=>{ return item.name })
      const sellerValues = this.allData.map((item)=>{ return item.value })
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
