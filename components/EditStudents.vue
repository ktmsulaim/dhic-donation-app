<template>
  <div v-if="students.length">
      <el-button size="small" type="info">Edit</el-button>
  </div>
</template>

<script>
export default {
    name: 'EditStudents',
    props: {
        students: Array,
        default: []
    },
}
</script>

<style>

</style>