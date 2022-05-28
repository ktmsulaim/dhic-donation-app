<template>
  <div v-if="selected.length">
    <el-button size="small" type="info" @click="modal = !modal">Edit</el-button>
    <el-dialog :width="modalWidth" title="Edit students" :visible.sync="modal">
      <p>
        <b>{{ selected.length }} </b> students are selected.
      </p>

      <div>
        <el-form ref="form" :model="form" label-position="top">
          <el-row :gutter="10">
            <el-col :lg="12" :md="12" :sm="24" :xs="24">
              <el-form-item label="Class" prop="class">
                <el-select v-model="form.class" placeholder="Select class">
                  <el-option
                    v-for="(cls, i) in 10"
                    :key="i"
                    :label="'Class ' + cls"
                    :value="cls"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="12" :sm="24" :xs="24">
              <el-form-item label="Status" prop="active">
                <el-select
                  v-model="form.active"
                  placeholder="Select the status"
                >
                  <el-option :value="1" label="Active">Active</el-option>
                  <el-option :value="0" label="Inactive">Inactive</el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="edit-students-actions">
          <div>
            <el-button :loading="loading" :disabled="deleteLoading" type="primary" @click="submit"
              >Submit</el-button
            >
          </div>
          <div>
            <el-popconfirm
              confirm-button-text="Confirm"
              cancel-button-text="Cancel"
              icon="el-icon-info"
              icon-color="red"
              title="Are you sure to delete the students?"
              @confirm="deleteStudents"
            >
              <el-button slot="reference" type="danger" :loading="deleteLoading" :disabled="loading">Delete</el-button>
            </el-popconfirm>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EditStudents',
  props: {
    students: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      modal: false,
      loading: false,
      selected: this.students,
      form: {
        class: null,
        active: null,
      },
      deleteLoading: false
    }
  },
  computed: {
    hasSelectedStudents() {
      return this.students.length > 0
    },
    modalWidth() {
      return this.$device.isMobile ? '100%' : '35%'
    },
  },
  methods: {
    reset() {
      this.selected = []
      this.form = {
        class: null,
        active: null,
      }
    },
    async submit() {
      try {
        this.loading = true

        if (this.form.class === null && this.form.active === null) {
          throw new Error('Please select either class or status')
        }

        const form = this.form
        form.students = this.students.length
          ? this.students.map((s) => s.id)
          : []
        const response = await this.$axios.$put('students', form)

        this.$toast.success(response.data.data || 'Successfully updated')
        this.modal = false
        this.reset()
        this.$emit('refresh')
      } catch (error) {
        this.$toast.error(error.message || 'Something went wrong')
      } finally {
        this.loading = false
      }
    },
    async deleteStudents() {
      try {
        this.deleteLoading = true
        const students = this.students.length
          ? this.students.map((s) => s.id)
          : []
        const response = await this.$axios.$post('students/delete-many', { students })
        this.$toast.success(response.data?.data || 'Successfully deleted')
        this.modal = false
        this.reset()
        this.$emit('refresh')
      } catch (error) {
        this.$toast.error(error.message || 'Unable to delete students')
      } finally {
        this.deleteLoading = false
      }
    }
  },
  watch: {
    students(newVal) {
      this.selected = newVal
    },
  },
}
</script>

<style>
</style>