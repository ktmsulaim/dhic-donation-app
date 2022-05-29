<template>
  <div>
    <el-row :gutter="10">
      <el-col :lg="12" :md="12" :sm="18" :xs="24">
        <el-card>
          <el-table v-if="students && students.length" :data="students" style="width: 100%">
            <el-table-column prop="id" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="name" label="Name">
            </el-table-column>
            <el-table-column prop="history" label="Amount" width="150">
              <template slot-scope="scope">
                {{ filters.status == 'paid' ? scope.row.history.amount_paid : scope.row.history.amount_due }}
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="No data"></el-empty>
        </el-card>
      </el-col>
      <el-col :lg="6" :md="6" :sm="12" :xs="24">
        <el-card>
          <p>Filters</p>
          <el-divider></el-divider>
          <div>
            <el-form label-position="top">
              <el-form-item label="Month">
                <el-date-picker
                  v-model="filters.date"
                  type="month"
                  placeholder="Pick a month"
                  value-format="yyyy-MM"
                  format="MMMM yyyy"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="Class">
                <el-select v-model="filters.class" placeholder="Select class">
                  <el-option
                    v-for="(cls, i) in 10"
                    :key="i"
                    :label="'Class ' + cls"
                    :value="cls"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="Status">
                <el-select v-model="filters.status">
                  <el-option value="paid">Amount paid</el-option>
                  <el-option value="due">Amount due</el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button :loading="loading" type="primary" @click="getData">
                  Go
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ClassWiseReport',
  layout: 'Dashboard',
  head() {
    return {
      title: 'Class wise report',
    }
  },
  data() {
    return {
      loading: false,
      students: [],
      filters: {
        date: null,
        status: null,
        class: null,
      },
    }
  },
  methods: {
    async getData() {
      try {
        this.loading = true
        const params = {}

        if (!this.filters.date) {
          throw new Error('Please select a month')
        }

        if (!this.filters.class) {
          throw new Error('Please select a class')
        }

        if (this.filters.date) {
          params.year = this.filters.date.split('-')[0]
          params.month = this.filters.date.split('-')[1]
        }

        if (this.filters.status) {
          params.status = this.filters.status
        }

        if (this.filters.class) {
          params.class = this.filters.class
        }

        const response = await this.$axios.$get('report/class-wise', {
          params,
        })

        this.students = response.data
      } catch (error) {
        this.$toast.error(error.message || 'Unable to generate the report')
      } finally {
        this.loading = false
      }
    },
  },
  created() {
    this.$store.commit('setPageTitle', 'Class wise report')
  },
}
</script>

<style>
</style>