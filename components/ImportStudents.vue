<template>
  <div class="importer">
    <el-button
      type="primary"
      size="small"
      icon="el-icon-download"
      @click="modal = true"
      >Import</el-button
    >
    <el-dialog
      :width="modalWidth"
      title="Import students"
      :visible.sync="modal"
    >
      <p>Every columns are required.</p>
      <ul>
        <li><b>name:</b> (String) The name of student</li>
        <li><b>place:</b> (String) The place of student</li>
        <li>
          <b>dob:</b> (Date)&lt;YYYY-MM-DD&gt; The date of birth of student
        </li>
        <li>
          <b>adno:</b> (Integer) The unique admission number of student.
          (duplicate entry is not allowed)
        </li>
        <li><b>class:</b> (Integer) The current standard of student</li>
        <li><b>amount:</b> (Decimal) The amount sponsored</li>
        <li>
          <b>interval:</b> (Integer) The donation interval, Choose the
          appropriate value:
          <div class="interval">
            <div class="interval-item">
              <span class="value">0</span> Monthly
            </div>
            <div class="interval-item">
              <span class="value">1</span> 3 Months
            </div>
            <div class="interval-item">
              <span class="value">2</span> 6 Months
            </div>
            <div class="interval-item"><span class="value">3</span> Yearly</div>
          </div>
        </li>
        <li>
          <b>start_date:</b> (Date)&lt;YYYY-MM-DD&gt; The start date of donation
          calculation
        </li>
        <li>
          <b>end_date:</b> (Date)&lt;YYYY-MM-DD&gt; The end date of donation
          calculation
        </li>
      </ul>
    <div class="starter-file">
        <p>Download starter file <a href="/import_students_starter.xls" download>here</a></p>
    </div>
      <div class="file-uploader">
        <input type="file" @change="handleFile($event)" />
        <el-button
          @click="submit"
          class="upload-button"
          type="primary"
          size="small"
          icon="el-icon-upload"
          :disabled="!file"
          :loading="loading"
          >Upload</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImportStudents',
  data() {
    return {
      modal: false,
      file: null,
      loading: false,
    }
  },
  methods: {
    handleFile($event) {
      this.file = $event.target.files[0]
    },
    submit() {
      try {
        this.loading = true
        const formData = new FormData()
        formData.append('file', this.file)

        this.$axios
          .$post('students/import', formData)
          .then((response) => {
            if (!response.success) {
              throw new Error(response.data)
            }

            this.$toast.success(
              response.data || 'Students imported successfully'
            )
            this.modal = false
            this.$emit('refresh')
          })
          .catch((error) => {
            this.$toast.error(error.message || 'Error importing students')
          })
          .finally(() => (this.loading = false))
      } catch (error) {
        this.$toast.error(error.message || 'Unable to import the students')
      }
    },
  },
  computed: {
    modalWidth() {
      return this.$device.isMobile ? '100%' : '35%'
    },
  },
}
</script>

<style>
</style>