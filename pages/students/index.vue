<template>
  <div>
    <div class="toolbar">
      <div class="left">
        <el-button
          size="small"
          type="secondary"
          @click="$router.push('/students/create')"
          >Create new</el-button
        >
        <import-students @refresh="refresh"></import-students>
        <el-input
          size="small"
          placeholder="Type something"
          prefix-icon="el-icon-search"
          v-model="search"
          :clearable="true"
          @clear="refresh"
        >
        </el-input>
      </div>
      <div class="right">
        <edit-students
          @refresh="refresh"
          :students="selectedStudents"
        ></edit-students>
      </div>
    </div>
    <el-skeleton v-if="loading" :rows="4" animated />
    <div v-else-if="students.data.length">
      <el-table
        ref="table"
        :data="students.data"
        style="width: 100%"
        @selection-change="selectStudents"
        v-if="$device.isDesktop"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column property="name" label="Name" width="250">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="click"
            >
              <div class="student-summary">
                <el-avatar :size="100" :src="getProfilePhoto(scope.row)"></el-avatar>
              </div>
              <p slot="reference">{{ scope.row.name }}</p>
            </el-popover>
          </template>
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
            {{ scope.row.subscription_summary }}
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="view(scope.row.id)">View</el-button>
            <el-button size="small" @click="edit(scope.row.id)"
              >Edit</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-else>
        <el-row :gutter="10">
          <el-col v-for="student in students.data" :key="student.id" :xs="24" :sm="12" :md="6" :lg="6">
            <el-card>
              <div class="student-summary">
                <el-avatar :size="100" :src="getProfilePhoto(student)"></el-avatar>
                <h3 @click.once="view(student.id)">{{ student.name }}</h3>
                <p>{{ student.adno }}</p>
                <p>{{ student.subscription_summary }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
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
import _ from 'lodash'

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
      currentPage: 1,
      selectedStudents: [],
      search: null,
    }
  },
  methods: {
    async fetchStudents(link = '/students') {
      try {
        this.loading = true
        const response = await this.$axios.get(link)
        this.students = response.data
      } catch (error) {
        console.error(error)
        this.$toast.error(
          error.response?.data.message || 'Failed to load students'
        )
      } finally {
        this.loading = false
      }
    },
    selectStudents(students) {
      this.selectedStudents = students
    },
    edit(id) {
      this.$router.push(`/students/edit/${id}`)
    },
    view(id) {
      this.$router.push(`/students/${id}`)
    },
    changePage(page) {
      this.currentPage = page
      let url = `/students?page=${page}`

      if (this.search) {
        url += `&q=${this.search}`
      }

      this.fetchStudents(url)
    },
    refresh() {
      let page = this.currentPage ? `?page=${this.currentPage}` : ''

      if (this.search) {
        page.includes('?')
          ? (page += `&q=${this.search}`)
          : (page += `?q=${this.search}`)
      }

      this.fetchStudents(`/students${page}`)
    },
    searchForStudents(value) {
      if (value) {
        this.fetchStudents(`/students?q=${value}`)
      } else {
        this.fetchStudents()
      }
    },
    getProfilePhoto(student) {
      if (student.photo) {
        return student.photo.thumbnail
      } else {
        return "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
      }
    },
  },
  watch: {
    search: _.debounce(function (value) {
      this.searchForStudents(value)
    }, 500),
  },
  created() {
    this.$store.commit('setPageTitle', 'Students')
    this.fetchStudents()
  },
}
</script>

<style>
</style>