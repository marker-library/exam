<template>
  <div>
    <el-dialog width="50%" title="排名详情" :visible.sync="show" :before-close="handleClick">
      <h1 class="dialogTitle">基本信息</h1>
      <el-row class="dialogContent">
        <el-col class="dialogContentItem" :span="12">
          <img src="../assets/logo.png" class="avater" alt="">
          <div>{{ baseInfo.nickName }}</div>
        </el-col>
        <el-col :span="12">
          历史最佳排名:&nbsp;{{ detailInfo.bestRank }}
        </el-col>
      </el-row>
      <h1>排名变化曲线</h1>
      <div id="rankCavasWrap" style="width:100%;height:400px"></div>
      <h1>成就徽章展示</h1>
      <div class="awardWrap">
        <div class="awardWrapItem" v-for="(it, idx) in imageList" :key="idx">
          <img src="../assets/logo.png" alt="" srcset="">
        </div>
      </div>
      <el-row class="dialogContent">
        <el-col class="dialogContentItem" :span="12">
          历史得分统计;&nbsp;
        </el-col>
        <el-col :span="12">
          参与时长统计:&nbsp;
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClick">取 消</el-button>
        <el-button type="primary" @click="handleClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { userRankDetail } from '@/api/index';
import * as echarts from 'echarts';
export default {
  name: 'dialogWrap',
  data() {
    return {
      show: false,
      detailInfo: {
        bestRank: 1
      },
      imageList: [
        {
          url: '../assets/logo.png'
        }, {
          url: '../assets/logo.png'
        }, {
          url: '../assets/logo.png'
        }, {
          url: '../assets/logo.png'
        },
        {
          url: '../assets/logo.png'
        },
      ]
    }
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => {
        return {
          userId: 'XXXX',
          avater: '../assets/logo.png',
          nickName: "游戏小王子",
        }
      }
    },
    type: {
      type: String,
      default: 'dailay'
    },
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show: {
      handler(n, o) {
        if (n === 'false') {
          this.handleClick()
        }
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit('listen')
    },
    initCavas() {
      var chartDom = document.getElementById('rankCavasWrap');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        xAxis: {
          type: 'category',
          data: ['2020-10-06', '2020-10-07', '2020-10-08', '2020-10-09', '2020-10-10', '2020-10-11', '2020-10-12']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [50, 30, 24, 18, 35, 47, 90],
            type: 'line'
          }
        ]
      };
      option && myChart.setOption(option);
    },
    async queryUserDetail() {
      const param = {
        type: this.type,
        userId: this.baseInfo.userId
      }
      const { data } = await userRankDetail(param)
      data = {
        success: true,
        resultInfo: {

        }
      }
      if (data.success) {
        if (data.resultInfo) {
          this.detailInfo = data.resultInfo
        }
      } else {
        this.$message.warning('detail请求失败')
      }
    },
  },
  created() {
    this.show = this.dialogShow
    // this.queryUserDetail()
  },
  mounted() {
    setTimeout(() => {
      this.initCavas()

    }, 1000);

  }
}
</script>
<style lang="less">
.dialogTitle {
  padding: 15px 0;
}

.dialogContent {
  padding: 15px 20px;
  line-height: 36px;

  .dialogContentItem {
    display: flex;
    align-items: center;

    .avater {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 30px;
      background-color: #aaa;
    }
  }

}

.awardWrap {
  .awardWrapItem {
    display: inline-block;
    width: 25%;
    text-align: center;

    img {
      width: 90%;
      height: 100%;
    }
  }
}




.rankCavasWrap {
  width: 100%;
  height: 200px;
}
</style>