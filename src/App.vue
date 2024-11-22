<template>
  <div class="mainContainer">
    <bannerMenu />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import '@/main.css';
import 'primeicons/primeicons.css'
import bannerMenu from '@/components/bannerMenu.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const year = new Date().getFullYear()
const footerVisible = ref(true)
const solidBg = ref(false)

const scroll = () =>{
  const footer = document.querySelector('.footer')
  
  if (!footer) return

  if (window.scrollY > 0 || solidBg.value){
    footer.style.backgroundColor = '#181a1b'
  }else{
    footer.style.backgroundColor = 'transparent'
  }
}

watch(() => route.path, () => {
  solidBg.value = route.path.includes('article')
  scroll()
});

onMounted(() => {
  window.addEventListener('scroll', scroll)
})
</script>

<style scoped>
.mainContainer{
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  background-image: url('/assets/background.png');
  position: relative;
  background-attachment: fixed;
}

.menuContainer::after{
  content: '';
  height: 80%;
  width: 100%;
  background-color: rgb(16, 18, 18);
  position: absolute;
  bottom: 0;
  z-index: 0;
}

.footer{
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  transition: background-color 0.3s;
  padding: 0.7em;
  width: 100%;

  p{
    margin: 0;
  }

  #closeFooter{
    position: absolute;
    right: 1%;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
  }
}

@media (max-width: 350px){
  .footer{
    p{
      width: 80%;
    }
  }
}
</style>
