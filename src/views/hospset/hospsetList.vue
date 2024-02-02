<template>
  <div class="app-container">
    <el-form :model="query.params" ref="searchForm" label-width="120px" :inline="true" size="normal">
      <el-form-item label="医院名称">
        <el-input v-model="query.params.hosname" placeholder="请输入" size="normal" clearable></el-input>
      </el-form-item>
      <el-form-item label="医院编号">
        <el-input v-model="query.params.hoscode" placeholder="请输入" size="normal" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" style="margin-bottpm: 20px">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" @selection-change="handleSelectionChange" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column align="center" label="ID" width="95" prop="id"> </el-table-column>
      <el-table-column label="医院名称" prop="hosname"> </el-table-column>
      <el-table-column label="联系人" width="110" align="center" prop="contactsName" />
      <el-table-column label="联系电话" width="110" align="center" prop="contactsPhone" />
      <el-table-column label="医院代码" width="110" align="center" prop="hoscode" />
      <el-table-column label="密钥" width="110" align="center" prop="signKey" />
      <el-table-column label="apiurl" width="110" align="center" prop="apiurl" />
      <el-table-column label="创建时间" width="110" align="center" prop="createTime" />
      <el-table-column label="更新时间" width="110" align="center" prop="updateTime" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 1">可用</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 0">不可用</el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small">详情</el-button> -->
          <el-button @click="handleDelete(scope.row)" type="danger" icon="el-icon-delete"></el-button>
          <el-button v-if="scope.row.status == 1" @click="handleLock(scope.row)" type="primary" icon="el-icon-lock"></el-button>
          <el-button v-if="scope.row.status == 0" @click="handleUnlock(scope.row)" type="success" icon="el-icon-unlock"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getHospSetListApi, delHospSetApi,lockHospSetApi} from '@/api/hospset';

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      query: {
        pageNum: 1,
        pageSize: 10,
        params: {}
      },
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getHospSetListApi(this.query.pageNum, this.query.pageSize, this.query.params).then((res) => {
        //console.log(response);
        this.listLoading = false;
        this.list = res.data.records;
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除？')
        .then(function () {
          return delHospSetApi(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
    search() {
      this.getList();
    },
    handleAdd() {},
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleLock(row){
      lockHospSetApi(row.id,0).then(res=>{
        this.getList()
        this.$modal.msgSuccess('锁定成功')
      })
    },
    handleUnlock(row){
      lockHospSetApi(row.id,1).then(res=>{
        this.getList()
        this.$modal.msgSuccess('解锁成功');
      })
    }
  }
};
</script>
