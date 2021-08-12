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
      timerId:null,//定时器标识
    }
  },
  mounted() {
    this.initChart()
    this.getData()
  },
  destroyed() {
    clearInterval(this.timerId)
  },
  methods:{
    //初始化
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
      //图表对象鼠标事件监听
      this.chartInstance.on('mouseover',()=>{
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', ()=>{
        this.startInterval()
      })
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
      this.startInterval()
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
    },
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
  }
}
</script>

<style scoped>

</style>
