<template>
  <div class="refresh-payments-wrapper">
      <el-button size="small" type="info" :loading="loading" @click="refresh" icon="el-icon-refresh-left">Refresh</el-button>
  </div>
</template>

<script>
export default {
    name: 'RefreshPayments',
    props: {
        student: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        async refresh() {
            try {
                this.loading = true;
                await this.$axios.$post(`subscription/${this.student.subscription.id}/history`);
                this.$toast.success('Payments refreshed successfully');
                this.$emit('refresh');
            } catch (error) {
                this.$toast.error(error.response.data.data || error.message || 'Unable to refresh payments');
            } finally {
                this.loading = false   
            }
        }
    }
}
</script>

<style>

</style>