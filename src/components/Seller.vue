<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
  created() {
    //组件创建完成后,进行回调函数注册
    this.$socket.registerCallBack("sellerData", this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action:'getData',
      socketType:'sellerData',
      chartName:'seller',
      value:''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    window.removeEventListener('resize',this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
  },
  computed:{
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
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        tooltip:{
          axisPointer:{
            lineStyle: {
              width:titleFontSize,
            }
          }
        },
        series:[
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius:[0, titleFontSize/2, titleFontSize/2, 0],
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    //初始化
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)

      //图表初始化配置的控制
      const initOption = {
        title:{
          text:'▎商家销售统计',
          textStyle:{
            fontSize:66
          },
          left:20,
          top:20
        },
        grid:{
          top:'20%',
          left:'3%',
          right:'6%',
          bottom:'3%',
          containLabel:true
        },
        xAxis:{
          type:'value'
        },
        yAxis:{
          type:'category',
        },
        tooltip:{
          trigger:'axis',
          axisPointer:{
            type:'line',
            z:0,
            lineStyle: {
              width:66,
              color:'#2D3443',
            }
          }
        },
        series:[
          {
            type:'bar',
            barWidth: 66,
            label: {
              show:true,
              position:'right',
              textStyle:{
                color:'white'
              }
            },
            itemStyle: {
              barBorderRadius:[0, 33, 33, 0],
              //指明方向
              //指明不同百分比之下的颜色的值
              color:new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset:0,
                  color:'#5052EE'
                },
                {
                  offset:1,
                  color:'#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)

      //图表对象鼠标事件监听
      this.chartInstance.on('mouseover',()=>{
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', ()=>{
        this.startInterval()
      })
    },
    //获取数据
    getData(ret){
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
      const dataOption = {
        yAxis:{
          data:sellerNames
        },
        series:[
          {
            data:sellerValues,
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
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
