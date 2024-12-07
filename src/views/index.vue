<template>
  <div class="mainView">
    <div class="btnWrap">
      <el-radio-group v-model="type" size="medium">
        <el-radio-button label="daily">日榜</el-radio-button>
        <el-radio-button label="weekly">周榜</el-radio-button>
        <el-radio-button label="mouthly">月榜</el-radio-button>
      </el-radio-group>
      <div class="userRankWrap">自己排名：{{ userRank }}</div><el-button @click="handleClick">定位排名</el-button>
    </div>
    <div class="tableWrap">
      <el-table row-class-name="markSelf" :height="300" :loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="rank" label="排名">
        </el-table-column>
        <el-table-column prop="userId" label="userId">
        </el-table-column>
        <el-table-column prop="nickName" label="昵称">
        </el-table-column>
        <el-table-column prop="avater" label="头像">
          <template slot-scope="scope">
            <img src="../assets//logo.png" class="avaterClass" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="score" label="分数">
        </el-table-column>
        <el-table-column prop="rankChange" label="排名变化趋势">
          <template slot-scope="scope">
            <div v-show="scope.row.rankChange > 0">
              上升
            </div>
            <div v-show="scope.row.rankChange < 0">
              下降
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rankChange" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pageClass" @size-change="handleSizeChange" @current-change="handlePageChange"
        :current-page="page" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="listTotal">
      </el-pagination>
    </div>
    <detail-dialog-wrap @listen="handledetail" class="detailDialogWrap" v-if="detailShow" :dialogShow="detailShow"
      :type="type">
      <!-- :baseInfo="detailInfo" -->
    </detail-dialog-wrap>
  </div>
</template>
<script>

import { queryBankList, userRankDetail } from '@/api/index';
import detailDialogWrap from '../components/dialogWrap.vue'
export default {

  components: {
    'detail-dialog-wrap': detailDialogWrap
  },
  data() {
    return {
      tableData: [{
        rank: 1,
        userId: 1,
        nickname: '@name',
        avatar: '../assets/logo.png',
        score: 60,
        rankChange: 10
      }],
      type: 'daily',
      page: 1,
      userId: 'XX',
      pageSize: 20,
      listTotal: 50,
      timer: null,
      count: 15,
      loading: false,
      userRank: 0,
      detailShow: true,
      detailInfo: {}
    };
  },
  watch: {
    type: {
      handler(n, o) {
        this.page = 1
        this.pageSize = 1
        this.queryList()
        this.queryUserDetail()
      }
    },
    count: {
      handler(n, o) {
        if (n === 0) {
          this.page = 1
          this.pageSize = 20
          this.queryList()
        }
      }
    }
  },
  methods: {
    handledetail() {
      this.detailShow = false
    },
    async queryList() {
      this.intervalFun()
      const param = {
        type: this.type,
        page: this.page,
        pageSize: this.pageSize
      }
      this.loading = true
      const data = await queryBankList(param)
      console.log(data)
      this.loading = false
      if (data.success) {
        if (data.resultInfo) {
          this.listTotal = data.resultInfo.total
          this.tableData = data.resultInfo.list
        }
      } else {
        this.$message.warning('list请求失败')
      }
    },
    async queryUserDetail() {
      const param = {
        type: this.type,
        userId: this.userId
      }
      const { data } = await userRankDetail(param)
      if (data.success) {
        if (data.resultInfo) {
          this.userRank = data.resultInfo.currentRank
        }
      } else {
        this.$message.warning('detail请求失败')
      }
    },
    handleDetail(row) {
      this.detailShow = true
      this.detailInfo = row
    },
    handleClick() {
      this.page = Math.floor(this.userRank / this.pageSize)
      this.queryList()
    },
    intervalFun() {
      if (this.timer) {
        clearInterval(this.timer),
          this.count = 15
      }
      this.timer = setInterval(() => {
        this.count -= 1
      }, 1000)
    },
    handlePageChange(m) {
      this.page = m
      this.queryList()
    },
    handleSizeChange(m, n) {
      this.pageSize = m
      this.page = 1
      this.queryList()
    }
  },
  created() {
    // this.queryList()
  }
};
</script>
<style lang="less">
.mainView {
  width: 100%;
  height: 100%;
  position: relative;

  .btnWrap {
    height: 36px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .userRankWrap {
      padding-right: 20px;
      flex: 1;
      text-align: right;
    }
  }

  .tableWrap {
    height: calc(100vh-56px);
    width: 100%;

    .avaterClass {
      width: 30px;
      height: 30px;
    }

    .markSelf {
      color: red;
    }

    .pageClass {
      text-align: right;
      padding-top: 20px;
    }
  }

  .detailDialogWrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: rgba(0, 0, 0, .7);
  }
}
</style>