<template>
  <div>
    <el-row :gutter="10" v-if="loading">
      <el-col :lg="6" :md="12" :sm="18" :xs="24">
        <el-skeleton :rows="3" animated />
      </el-col>
      <el-col :lg="6" :md="12" :sm="18" :xs="24">
        <el-skeleton :rows="3" animated />
      </el-col>
      <el-col :lg="6" :md="12" :sm="18" :xs="24">
        <el-skeleton :rows="3" animated />
      </el-col>
      <el-col :lg="6" :md="12" :sm="18" :xs="24">
        <el-skeleton :rows="3" animated />
      </el-col>
    </el-row>
    
    <section class="summary-count">
      <el-row v-if="hasReport" :gutter="10">
        <el-col :lg="6" :md="12" :sm="18" :xs="24">
          <el-card>
            <div class="title">Total students</div>
            <div class="count">{{ reports.students }}</div>
          </el-card>
        </el-col>
        <el-col :lg="6" :md="12" :sm="18" :xs="24">
          <el-card>
            <div class="title">Sponsored</div>
            <div class="count">
              {{ reports.amount_of_the_month.sponsored.formatted }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="6" :md="12" :sm="18" :xs="24">
          <el-card>
            <div class="title">Paid</div>
            <div class="count">
              {{ reports.amount_of_the_month.amount_paid.formatted }}
            </div>
          </el-card>
        </el-col>
        <el-col :lg="6" :md="12" :sm="18" :xs="24">
          <el-card>
            <div class="title">Due</div>
            <div class="count">
              {{ reports.amount_of_the_month.amount_due.formatted }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
    <section v-if="hasReport" class="charts">
      <el-row :gutter="10">
        <el-col :lg="12" :md="12" :sm="24">
          <el-card>
            <bar-chart
              :chart-options="chartOptions"
              :chart-data="paidData"
              :height="100"
              :width="300"
            ></bar-chart>
          </el-card>
        </el-col>
        <el-col :lg="12" :md="12" :sm="24">
          <el-card>
            <bar-chart
              :chart-options="chartOptions"
              :chart-data="dueData"
              :height="100"
              :width="300"
            ></bar-chart>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'Dashboard',
  head() {
    return {
      title: 'Dashboard',
    }
  },
  data() {
    return {
      loading: false,
      reports: {},
      paidData: {
        labels: [],
        datasets: [
          {
            label: 'Paid',
            backgroundColor: '#4fc08d',
            borderColor: '#4fc08d',
            data: [],
          },
        ],
      },
      dueData: {
        labels: [],
        datasets: [
          {
            label: 'Due',
            backgroundColor: '#f8c5c5',
            borderColor: '#f8c5c5',
            data: [],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
            },
          },
          y: {
            display: false,
            title: 'Amount',
            ticks: {
              // Include a inr sign in the ticks
              callback: function (value, index, ticks) {
                return '₹' + value
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || ''

                  console.log(context);

                  if (label) {
                    label += ': '
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y.toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                      style: 'currency',
                      currency: 'INR',
                    })
                  }
                  return label
                },
              },
            },
          },
        },
      },
    }
  },
  computed: {
    hasReport() {
      return Object.keys(this.reports).length;
    }
  },
  methods: {
    async getReports() {
      try {
        this.loading = true;
        const response = await this.$axios.get('reports/summary')
        this.reports = response.data.data
        this.dueData.labels =
          this.reports.amount_last_six_months.amount_due.amount.map(
            (item) => item.label
          )
        this.dueData.datasets[0].data =
          this.reports.amount_last_six_months.amount_due.amount.map(
            (item) => item.amount
          )
        this.paidData.labels =
          this.reports.amount_last_six_months.amount_paid.amount.map(
            (item) => item.label
          )
        this.paidData.datasets[0].data =
          this.reports.amount_last_six_months.amount_paid.amount.map(
            (item) => item.amount
          )
      } catch (error) {
        this.$toast.error("Couldn't fetch reports")
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.$store.commit('setPageTitle', 'Dashboard');
    this.getReports()
  },
}
</script>