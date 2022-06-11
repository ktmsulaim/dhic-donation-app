<template>
  <div>
    <div class="card-header">
      <div class="title">Payments</div>
      <div class="actions">
        <el-select
          size="small"
          v-if="student.subscription"
          v-model="selectedYear"
          placeholder="Select an year"
        >
          <el-option
            v-for="(year, i) in student.subscription.years"
            :key="i"
            :label="year"
            :value="year"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <el-skeleton v-if="loading" :rows="5" animate />
    <div v-else-if="payments && payments.length">
      <el-row :gutter="10" class="payments-wrapper">
        <el-col
          :lg="6"
          :md="12"
          :sm="12"
          :xs="12"
          v-for="payment in payments"
          :key="payment.id"
        >
          <div class="payment" @click="showPaymentModal(payment.id)">
            <div class="amount">{{ payment.amount_paid }}</div>
            <div class="date">{{ getMonth(payment.month) }}</div>
          </div>
        </el-col>
      </el-row>

      <el-dialog
        v-if="selectedPayment"
        :title="getMonth(selectedPayment.month) + ' - ' + selectedPayment.year"
        :visible.sync="paymentModal"
        :width="modalWidth"
        :before-close="clearPaymentModal"
      >
        <el-form ref="form" v-model="form" label-position="top" class="text-center">
          <el-form-item label="Amount">
            <el-input-number
              size="large"
              v-model="form.amount"
              :max="selectedPayment.amount_due"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="form.amount === 0" @click="makePayment" :loading="loading"
              >Pay</el-button
            >
          </el-form-item>
        </el-form>
        <p>Last updated: {{ formatDate(selectedPayment.updated_at) }}</p>
      </el-dialog>
    </div>
    <el-empty v-else description="No payments found!"></el-empty>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Payments',
  props: {
    student: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      selectedYear: null,
      payments: [],
      paymentModal: false,
      selectedPayment: null,
      form: {
        amount: 0,
      },
    }
  },
  computed: {
    modalWidth() {
      return this.$device.isMobile ? '90%' : '20%'
    }
  },
  methods: {
    async fetchPayments() {
      if (this.selectedYear) {
        try {
          this.loading = true
          const response = await this.$axios.$get(
            `subscription/${this.student?.subscription.id}/history/${this.selectedYear}`
          )
          this.payments = response.data
        } catch (error) {
          this.$toast.error(
            error.response.data.message ||
              error.message ||
              'Unable to fetch payments'
          )
        } finally {
          this.loading = false
        }
      }
    },
    getMonth(month) {
      try {
        return moment(month, 'MM').format('MMMM')
      } catch (error) {
        return month
      }
    },
    showPaymentModal(id) {
      if (id) {
        this.paymentModal = true
        this.selectedPayment = this.payments.find(
          (payment) => payment.id === id
        )

        this.form.amount = this.selectedPayment?.amount_due || 0
      }
    },
    clearPaymentModal() {
      this.paymentModal = false
      this.selectedPayment = null
    },
    async makePayment() {
      try {
        this.loading = true
        const form =  {
          payments: [
            {
              id: this.selectedPayment.id,
              amount: this.form.amount,
            }
          ]
        }

        await this.$axios.$put(
          `subscription/${this.student?.subscription.id}/history`,
          form
        )

        this.$toast.success('Payment made successfully!')
        this.clearPaymentModal()
        this.fetchPayments()
        this.$emit('refresh')
      } catch (error) {
        this.$toast.error(
          error.response.data.data ||
            error.message ||
            'Unable to make payment'
        )
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      try {
        return moment(date).format('DD-MM-YYYY hh:mm A')
      } catch (error) {
        return date
      }
    },
  },
  watch: {
    selectedYear(newVal) {
      this.fetchPayments()
    },
  },
  created() {
    if (this.student?.subscription) {
      const currentYear = moment().format('YYYY')
      this.selectedYear = this.student.subscription.years.find(
        (year) => year === parseInt(currentYear)
      )
    }
  },
}
</script>

<style>
</style>