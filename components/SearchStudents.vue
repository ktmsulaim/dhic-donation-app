<template>
  <div class="search-students-wrapper">
    <el-input
      type="number"
      min="0"
      size="small"
      placeholder="ADNO"
      v-model="adno"
      :disabled="loading"
      ref="adno"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'SearchStudents',
  data() {
    return {
      adno: null,
      loading: false,
    }
  },
  methods: {
      async search() {
          try {
            this.loading = true;

            if(!this.adno) {
                return;
            }

            const response = await this.$axios.$get('students?q=' + this.adno);

            if(response.data.length) {
                this.$router.push('/students/' + response.data[0].id);
            }
          } catch (error) {
           this.$toast.error("Failed to search students");   
          } finally {
              this.loading = false;
              this.$nextTick(() => {
                  this.$refs['adno']?.focus();
              })
          }
      },
      clear() {
          this.adno = null;
          this.loading = false;
      }
  },
  watch: {
    adno: _.debounce(function (value) {
      this.search();
    }, 500),
  },
}
</script>

<style>
</style>