<template>
    <header>
        <Menubar class="wrapper" :class="solidBg ? 'scrolled' : ''" :model="menuItems">
            <template #end>
                <RouterLink to="/">
                    <img src="../../public/logo.svg" alt="logo" style="width: 5em;">
                </RouterLink>
            </template>
            <template #item="{ item }">
                <RouterLink :to="item.path" class="link">{{ item.label }}</RouterLink>
            </template>
        </Menubar>
    </header>
</template>

<script setup>
import { onMounted, ref, nextTick} from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const solidBg = ref(false)
const menuItems = ref([
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
])

const scroll = () => {
    const wrapper = document.querySelector('.wrapper')

    if (route.path.includes('article')){
        solidBg.value = true
        return
    }

    if (window.scrollY > 0) {
        wrapper.classList.add('scrolled')
    } else {
        wrapper.classList.remove('scrolled')
    }
}

onMounted(() => {
    setTimeout(() => {
        scroll()
    }, 500)
    window.addEventListener('scroll', scroll)
})
</script>

<style scoped>
.scrolled{
    transition: all 0.3s ease-in-out;
    background-color: #181a1b !important;
    --p-menubar-submenu-background: #181a1b !important;
}

header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    transition: all 0.3s ease-in-out;
    background-color: #181a1b00;
}

.wrapper{
    --p-menubar-gap: 2em;
    --p-menubar-padding: 1em 2em;
    --p-icon-size: 3em;
    --p-menubar-submenu-padding: 1em 2em;
    --p-menubar-submenu-gap: 1em;
    --p-menubar-submenu-background: #181a1b00;
    transition: all 0.3s ease-in-out;
}

.link{
    font-size: 1em;
    color: white;
    text-decoration: none;
    transition: all 0.1s ease-in;
}

.link:hover{
    color: rgb(126, 126, 126);
}

@media (max-width: 960px){
    .link{
        font-size: 2em;
    }
}
</style>

<style>
.p-menubar-root-list{
    transition: all 0.3s ease-in-out;
}
</style>