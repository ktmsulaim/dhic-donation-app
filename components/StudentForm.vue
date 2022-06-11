<template>
  <div>
    <el-row :gutter="10">
      <el-col :lg="12" :md="12" :sm="24" :xs="24" :class="{ 'order-2': $device.isMobileOrTablet }">
        <el-card>
          <el-form ref="form" :rules="rules" :model="form" label-position="top">
            <el-form-item label="Name" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="Place" prop="place">
              <el-input v-model="form.place"></el-input>
            </el-form-item>
            <el-form-item label="DOB" prop="dob">
              <el-date-picker
                v-model="form.dob"
                type="date"
                placeholder="Pick a day"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="Admission Number" prop="adno">
              <el-input v-model.number="form.adno" :disabled="isEditing"></el-input>
            </el-form-item>
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
            <el-form-item>
              <el-button :loading="loading" type="primary" @click="submit"
                >Submit</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="12" :sm="24" :xs="24" :class="{ 'order-1': $device.isMobileOrTablet }">
        <el-card class="text-center">
          <el-avatar :size="150" :src="photo.preview ? photo.preview : photo.default"></el-avatar>

          <div class="uploader">
            <el-button @click="$refs.photo.click()" type="info">Choose photo</el-button>
            <input type="file" ref="photo" @change="handleFile" accept="image/*" id="photo-uploader">
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'StudentForm',
  props: {
    student: {
      type: Object,
      default: () => ({ id: undefined }),
    },
  },
  data() {
    return {
      loading: false,
      form: {
        name: null,
        place: null,
        dob: null,
        adno: null,
        class: null,
      },
      rules: {
        name: [
          { required: true, message: 'Please enter name', trigger: 'blur' },
        ],
        place: [
          { required: true, message: 'Please enter place', trigger: 'blur' },
        ],
        dob: [
          { required: true, message: 'Please enter dob', trigger: 'blur' },
        ],
        adno: [
          {
            required: true,
            message: 'Please enter admission number',
            trigger: 'blur',
          },
          {
            type: 'number',
            required: true,
            message: 'Please enter a number',
            trigger: 'blur',
          },
        ],
        class: [
          { required: true, message: 'Please enter class', trigger: 'blur' },
        ],
      },
      photo: {
        file: null,
        preview: null,
        default: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      }
    }
  },
  computed: {
    isEditing() {
      return this.student.id !== undefined
    },
  },
  methods: {
    submit() {
      try {
        this.loading = true
        const form = new FormData()
        form.append('_method', this.isEditing ? 'PUT' : 'POST')
        form.append('name', this.form.name)
        form.append('place', this.form.place)
        form.append(
          'dob',
          this.form.dob && moment(this.form.dob, true).isValid()
            ? moment(this.form.dob).format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD')
        )
        
        form.append('class', this.form.class)

        if (this.photo.file) {
          form.append('photo', this.photo.file)
        }

        if(!this.isEditing) {
          form.append('adno', this.form.adno);
        }

        let url = `/students`;

        if (this.isEditing) {
          url = `/students/${this.student.id}`;
        }

        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$axios.$post(url, form)
            .then((resp) => {
              this.$toast.success('Student saved successfully')
              this.$emit('success')
            })
            .catch(error => {
              this.$toast.error(error.response?.data?.message || "Unable to update the student")
            })
          } else {
            this.$toast.error('Please fill all the required fields')
          }
        })
      } catch (error) {
        console.log(error);
        let errorMessage = error.message

        this.$toast.error(errorMessage)
      } finally {
        this.loading = false
      }
    },
    handleFile() {
      const file = this.$refs.photo.files[0]
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        this.photo.file = file
        this.photo.preview = reader.result
      })

      reader.readAsDataURL(file)
    }
  },
  created() {
    if (this.isEditing) {
      Object.keys(this.form).forEach((key) => {
        if(key != 'photo') {
          this.form[key] = this.student[key]
        } else if (key == 'dob') {
          this.form[key] = moment(this.student[key]).toDate();
        }
      })

      if(this.student.photo) {
        this.photo.preview = this.student.photo.thumbnail
      }

    }
  },
}
</script>

<style scoped>
#photo-uploader {
  display: none;
}
</style>