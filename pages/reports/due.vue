<template>
  <div>
    <div class="toolbar">
      <div class="left">
        <el-date-picker
          class="toolbar-item"
          v-model="form.date"
          type="month"
          placeholder="Pick a month"
          value-format="yyyy-MM"
          format="MMMM yyyy"
          :loading="loading"
          :disabled="loading"
        >
        </el-date-picker>

        <el-select
          v-model="form.class"
          placeholder="Select class"
          class="toolbar-item"
        >
          <el-option
            v-for="(cls, i) in 10"
            :key="i"
            :label="'Class ' + cls"
            :value="cls"
          ></el-option>
        </el-select>

        <el-button
          type="primary"
          class="toolbar-item"
          @click="getData"
          :loading="loading"
          >Generate</el-button
        >
      </div>
      <div class="right">
        <el-button
          v-if="students && students.length"
          type="secondary"
          @click="exportData"
          :loading="exportLoading"
          :disabled="exportLoading"
          >Export</el-button
        >
      </div>
    </div>
    <div>
      <el-row>
        <el-col>
          <el-card>
            <el-table
              v-if="students && students.length"
              :data="students"
              :border="true"
              :row-class-name="totalRowClass"
            >
              <el-table-column prop="name" label="Name"> </el-table-column>
              <el-table-column prop="adno" label="Ad.No" width="100">
              </el-table-column>
              <el-table-column prop="donation" label="Donation">
              </el-table-column>
              <el-table-column prop="amount_due_formatted" label="Amount Due">
              </el-table-column>
            </el-table>

            <el-empty v-else description="No data"></el-empty>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { FLOWBASEANNOTATION_TYPES } from '@babel/types'

export default {
  name: 'DueReport',
  layout: 'Dashboard',
  head() {
    return {
      title: 'Class wise due report',
    }
  },
  data() {
    return {
      loading: false,
      students: [],
      form: {
        date: null,
        class: null,
      },
      exportLoading: false,
    }
  },
  methods: {
    async getData() {
      try {
        this.loading = true
        const params = {
          year: this.form.date?.split('-')[0],
          month: this.form.date?.split('-')[1],
          class: this.form.class,
        }
        const response = await this.$axios.$get('report/due', { params })
        this.students = response.data
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || 'Failed to load data'
        )
      } finally {
        this.loading = false
      }
    },
    totalRowClass({ row, rowIndex }) {
      if (row?.name === 'Total') {
        return 'total-row'
      }
      return ''
    },
    async exportData() {
      if (this.form.date && this.form.class) {
        try {
          const params = {
            year: this.form.date?.split('-')[0],
            month: this.form.date?.split('-')[1],
            class: this.form.class,
          }

          const response = await this.$axios.$post('report/due', params, {
            responseType: 'blob'
          })

          const date = new Date()
          const filename = `Due - Class ${this.form.class} ${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}.xlsx`
          const url = window.URL.createObjectURL(new Blob([response]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
        } catch (error) {
          this.$toast.error(
            error.response?.data?.message || 'Failed to export data'
          )
        } finally {
            this.exportLoading = false
        }
      }
    },
  },
  created() {
    this.$store.commit('setPageTitle', 'Class wise due report')
  },
}
</script>

<style>
.el-table .total-row {
  background-color: #444;
  color: #fff;
}

.el-table .total-row:hover {
  background-color: #666;
  color: #393434;
}

.export {
  margin-top: 15px;
}
</style>