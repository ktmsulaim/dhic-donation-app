<template>
  <div id="subscription-form">
    <el-button @click="modal = !modal" size="small">
      <span v-if="isEditing">Edit subscription</span>
      <span v-else>Add subsription</span>
    </el-button>

    <el-dialog
      @close="reset"
      @open="setForm"
      :title="modalTitle"
      :visible.sync="modal"
      :width="modalWidth"
    >
      <el-alert
        v-if="isEditing"
        title="Attention!"
        type="warning"
        description="You are about to edit the subscription of this student. The previous payments may cleared and this action cannot be undone."
        show-icon
      >
      </el-alert>
      <el-form ref="form" v-model="form" label-position="top">
        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="24">
            <el-form-item label="Amount">
              <el-input-number
                class="w-100"
                size="large"
                v-model="form.amount"
                :min="0"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24">
            <el-form-item label="Interval">
              <el-select v-model="form.interval">
                <el-option :value="0" label="Monthly">Monthly</el-option>
                <el-option :value="1" label="Quarterly">Quarterly</el-option>
                <el-option :value="2" label="Half yearly"
                  >Half yearly</el-option
                >
                <el-option :value="3" label="yearly">Yearly</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="24">
            <el-form-item label="Start date">
              <el-date-picker
                v-model="form.start_date"
                type="date"
                placeholder="Pick a date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="24">
            <el-form-item label="End date">
              <el-date-picker
                v-model="form.end_date"
                type="date"
                placeholder="Pick a date"
                format="dd-MM-yyyy"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="loading">
            Submit
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SubscriptionForm',
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    student: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      modal: false,
      form: {
        amount: 0,
        start_date: '',
        end_date: '',
        interval: 0,
      },
      loading: false,
    }
  },
  computed: {
    modalWidth() {
      return this.$device.isMobile ? '90%' : '35%'
    },
    modalTitle() {
      return this.isEditing ? 'Edit subscription' : 'Add subscription'
    },
  },
  methods: {
    reset() {
      this.form = {
        amount: 0,
        start_date: '',
        end_date: '',
        interval: 0,
      }
    },
    async submit() {
      try {
        this.loading = true
        const form = this.form

        if (!this.isEditing) {
          form.student_id = this.student.id
        }

        const response = (await this.isEditing)
          ? this.$axios.$put(
              `subscription/${this.student.subscription.id}`,
              this.form
            )
          : this.$axios.$post('subscribe', this.form)

        this.$toast.success(response.data)
        this.modal = false
        this.reset()
        this.$emit('refresh')
      } catch (error) {
        this.$toast.error(
          error.response?.data.message ||
            error.message ||
            'Unable to fetch payments'
        )
      } finally {
        this.loading = false
      }
    },
    setForm() {
      if (this.isEditing) {
        this.form = {
          amount: this.student.subscription.amount.total,
          start_date: this.student.subscription.start_date,
          end_date: this.student.subscription.end_date,
          interval: this.student.subscription.interval,
        }
      }
    },
  },
}
</script>

<style>
</style>