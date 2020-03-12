<template>
  <div id="qr">
    <img v-if="qr" ref="img" :src="qr" />
  </div>
</template>

<script>
import QRious from "qrious"
export default {
  props: ["url", "size"],
  data() {
    return {
      qr: null
    }
  },
  created() {
    this.qr = new QRious({
      value: this.url,
      size: this.size || 120,
    }).toDataURL()
  }
}
</script>
