  <template></template>

<script>


export default {
  created() {
    this.$store.user.mgr.signinRedirectCallback()
  .then(function() {
    window.location = '/'
  })
  .catch(function(e) {})
  }
}
</script>
