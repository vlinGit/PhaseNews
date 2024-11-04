<template>
  <div class="banner">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
        </nav>
      </div>
    </header>

    <transition name="fade" appear>
      <div id="bannerText" v-if="showBannerText">
        <h1>Phase News</h1>
        <p>Your one stop shop for totally trustworthy and unbiased news on phase connect</p>
      </div>
    </transition>

    <div id="bannerContainer">
      <img src="../public/sakanaRocket.gif" id="bgBanner" alt="Banner background">
    </div>
  </div>

  <RouterView />

  <div class="footer">
    <div class="wrapper">
      <p>&copy; {{ year }} Phase News</p>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import '@/main.css';

const showBannerText = ref(false)
const year = new Date().getFullYear()

onMounted(() => {
  setTimeout(() => {
    showBannerText.value = true
  }, 200)
})
</script>

<style scoped>
.banner{
  width: 100%;
  height: 100vh;
  position: relative;
}

header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

#bannerContainer{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

#bgBanner{
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5px) brightness(0.5);
  transform: scale(1.1);
  z-index: 0;
  position: relative;
}

#bannerText{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;

  h1{
    font-size: 8em;
    margin: 0;
  }

  p{
    font-size: 1.3em;
    margin: 0;
  }
}
</style>
