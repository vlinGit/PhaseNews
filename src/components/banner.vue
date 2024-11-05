<template>
    <div class="banner">
        <transition name="fade" appear>
            <div id="bannerText" v-if="showBannerText">
                <h1>{{ props.title }}</h1>
                <p>{{ props.description }}</p>
            </div>
        </transition>

        <div id="bannerContainer">
            <img src="/sakanaRocket.gif" id="bgBanner" alt="Banner background">
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const showBannerText = ref(false)
const props = defineProps({
  title: {
    type: String,
    default: 'Phase News'
  },
  description: {
    type: String,
    default: 'Your one stop shop for totally trustworthy and unbiased news on phase connect'
  }
})

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
  z-index: 1;

  h1{
    font-size: 7em;
    margin: 0;
  }

  p{
    font-size: 1.3em;
    margin: 0;
  }
}

</style>