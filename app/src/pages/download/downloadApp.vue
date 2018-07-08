
<template>
  <div>
    <title>注册成功</title>
    <div class="download-background">
      <div class="logo-image">
        <img src="../../assets/img/share/register_ywmj_logo@2x.png"/>
      </div>
      <div class="invite-download-desc">
        <img src="../../assets/img/share/zc_download_txt@2x.png"/>
      </div>
      <div class="download-submit" @click="downloadAction">立即下载</div>
    </div>

  </div>
</template>

<script>

  import '../../assets/css/download.css'

  export default {
    name: 'download',
    components:{

    },
    data () {
      return {
      }
    },
    methods: {
        downloadAction() {
          window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.yingwumeijia.android.ywmj.client";
        }
    },
    created(){

    }
  }
</script>
