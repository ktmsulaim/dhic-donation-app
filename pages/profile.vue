<template>
  <div>
      <h1>Profile page</h1>
  </div>
</template>

<script>
export default {
    name: 'ProfilePage',
    layout: 'Dashboard',
    head() {
        return {
            title: 'Profile',
        }
    },
    created() {
        this.$store.commit('setPageTitle', 'Profile')
    }
}
</script>

<style>

</style>