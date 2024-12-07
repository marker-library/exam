<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <router-link to="/">榜单</router-link>
      </el-aside>
      <el-main><router-view /></el-main>
    </el-container>

  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  methods: {

  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>