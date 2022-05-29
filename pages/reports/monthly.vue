<template>
  <div>
      <div class="toolbar">
          <div class="left">
              <el-date-picker
                  v-model="date"
                  type="month"
                  placeholder="Pick a month"
                  value-format="yyyy-MM"
                  format="MMMM yyyy"
                  :loading="loading"
                  :disabled="loading"
                >
                </el-date-picker>
          </div>
      </div>
      <div>
          <el-row>
              <el-col>
                  <el-card>
                      <el-table
                       v-if="classes && classes.length"
                       :data="tableData"
                       :border="true"
                       :row-class-name="totalRowClass"
                       >
                      <el-table-column
                            prop="class"
                            label="Class">
                        </el-table-column>
                      <el-table-column
                            prop="amount_due"
                            label="Amount Due">
                        </el-table-column>
                      <el-table-column
                            prop="amount_paid"
                            label="Amount Paid">
                        </el-table-column>
                      <el-table-column
                            prop="sponsored"
                            label="Sponsored">
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
export default {
  name: 'MonthlyReport',
  layout: 'Dashboard',
  head() {
    return {
      title: 'Monthly report',
    }
  },
  data() {
    return {
      loading: false,
      classes: [],
      date: null,
    }
  },
  computed: {
      tableData() {
          return this.classes.map(cls => {
              const name = Object.keys(cls)[0];

                return {
                    class: name,
                    sponsored: cls[name].sponsored,
                    amount_due: cls[name].amount_due,
                    amount_paid: cls[name].amount_paid,
                }
          })
      }
  },
  methods: {
     async getData() {
          try {
              this.loading = true
              const params = {
                  year: this.date?.split('-')[0],
                month: this.date?.split('-')[1],
              }
            const response = await this.$axios.$get('report/monthly', { params })
            this.classes = response.data
          } catch (error) {
              this.$toast.error(error.message || 'Failed to load data')
          } finally {
              this.loading = false
          }
      },
      totalRowClass({ row, rowIndex }) {
          if(row?.class === 'Total') {
                return 'total-row';
          }
          return '';
      },
  },
  watch: {
      date(newVal, oldVal) {
          if(newVal) {
              this.getData()
          }
      }
  },
  created() {
    this.$store.commit('setPageTitle', 'Monthly report')
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
</style>