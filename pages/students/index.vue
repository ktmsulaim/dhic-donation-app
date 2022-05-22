<template>
  <div>
    <div class="toolbar">
      <div class="left">
        <el-button size="small" type="secondary" @click="$router.push('/students/create')">Create new</el-button>
        <import-students @refresh="fetchStudents"></import-students>
      </div>
      <div class="right">
        <edit-students :students="selectedStudents"></edit-students>
      </div>
    </div>
    <el-skeleton v-if="loading" :rows="4" animated />
    <div v-else-if="students.data.length">
      <el-table
        ref="table"
        :data="students.data"
        style="width: 100%"
        @selection-change="selectStudents"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column property="name" label="Name" width="250">
        </el-table-column>
        <el-table-column property="adno" label="AD.NO" width="120">
        </el-table-column>
        <el-table-column property="dob" label="DOB" width="120">
        </el-table-column>
        <el-table-column property="class" label="Class" width="100">
        </el-table-column>
        <el-table-column property="place" label="Place" width="180">
        </el-table-column>
        <el-table-column property="status" label="Status" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">Active</el-tag>
            <el-tag v-else type="danger">Inactive</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="subscription" label="Donation" width="200">
          <template slot-scope="scope">
            {{ scope.row.subscription }}
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="edit(scope.row.id)">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="students.pagination.total"
          :current-page.sync="students.pagination.current_page"
          :page-size="students.pagination.per_page"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
    <el-empty v-else description="No students found"></el-empty>
  </div>
</template>

<script>
export default {
  name: 'StudentsIndexPage',
  layout: 'Dashboard',
  head() {
    return {
      title: 'Students',
    }
  },
  data() {
    return {
      loading: false,
      students: {
        data: [],
        pagination: {},
      },
      selectedStudents : [],
    }
  },
  methods: {
    async fetchStudents(link = '/students') {
      try {
        this.loading = true
        const response = await this.$axios.get(link)
        this.students = response.data
      } catch (error) {
          console.error(error);
        this.$toast.error(
          error.response?.data.message || 'Failed to load students'
        )
      } finally {
        this.loading = false
      }
    },
    selectStudents(students) {
      this.selectedStudents = students;
    },
    edit(id) {
      this.$router.push(`/students/edit/${id}`);
    },
    changePage(page) {
      this.fetchStudents(`/students?page=${page}`)
    },
  },
  created() {
    this.$store.commit('setPageTitle', 'Students')
    this.fetchStudents()
  },
}
</script>

<style>
</style>