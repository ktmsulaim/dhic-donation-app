<template>
  <div class="payment-actions">
    <el-button size="small" @click="modal = !modal">Bulk payment</el-button>

    <el-dialog
      title="Bulk payment"
      :visible.sync="modal"
      :width="modalWidth"
      :before-close="reset"
      :close-on-click-modal="false"
    >
      <el-form ref="form" v-model="form" label-position="top">
        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="24">
            <el-form-item label="Start date">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                placeholder="Start date"
                size="large"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24">
            <el-form-item label="End date">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                placeholder="End date"
                size="large"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-skeleton v-if="loading" :rows="3" animated />
        <div v-else-if="history.history && history.history.length">
            <p><span>Total: </span> {{ history.total_amount }}</p>
          <p><span>Amount paid: </span> {{ history.total_paid }}</p>
          <p class="payable">
            <span>Amount payable: </span><span>{{ history.total }}</span> x
            {{ student.subscription.amount.formatted }}
            <span class="amount"> = {{ history.total_due }}</span>
          </p>
          <div style="text-align: center; margin-top: 10px">
            <el-button :disabled="!history.total_due" :loading="payLoading" @click="pay" type="primary"
              >Pay {{ history.total_due }}</el-button
            >
          </div>
        </div>
        <div v-else>
          <p class="text-center">No data!</p>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BulkPayment',
  props: {
    student: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      modal: false,
      form: {
        startDate: '',
        endDate: '',
      },
      history: {
          history: [],
      },
      payLoading: false,
    }
  },
  computed: {
    modalWidth() {
      return this.$device.isMobile ? '90%' : '30%'
    },
  },
  methods: {
    reset() {
      this.history = {
          history: []
      }
      this.form.startDate = null
      this.form.endDate = null
      this.modal = false
    },
    async fetchHistory() {
      if (this.form.startDate && this.form.endDate) {
        try {
          this.loading = true
          const response = await this.$axios.$get(
            `subscription/${this.student.subscription.id}/history/between-date`,
            {
              params: {
                start_date: this.form.startDate,
                end_date: this.form.endDate,
              },
            }
          )
          this.history = response.data
        } catch (error) {
          this.$toast.error(
            error.response.data.data ||
              error.message ||
              'Unable to fetch payments'
          )
        } finally {
          this.loading = false
        }
      }
    },
    async pay() {
      try {
        this.payLoading = true

        const data = this.history.history?.map((h) => ({
            id: h.id,
            amount: h.amount_due
        }))

        await this.$axios.$put(`subscription/${this.student.subscription.id}/history`, { payments: data})
        this.reset();
        this.$toast.success('Payment successful')
        this.$emit('refresh');
      } catch (error) {
        this.$toast.error(
          error.response.data.data ||
            error.message ||
            'Unable to make payment'
        )
      } finally {
        this.payLoading = false
      }
    },
  },
  watch: {
    form: {
      handler: function (val, oldVal) {
        if (val.startDate && val.endDate) {
          this.fetchHistory()
        }
      },
      deep: true,
    },
  },
}
</script>

<style>
</style>