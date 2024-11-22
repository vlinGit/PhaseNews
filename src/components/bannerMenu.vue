<template>
    <div class="menuContainer">
        <div class="subMenuContainer">
            <RouterLink to="/">
                <img src="/logo.svg" alt="logo">
            </RouterLink>
            <div class="menu">
                <RouterLink v-for="item in menuItems" :to="item.path" class="link">{{ item.label }}</RouterLink>
            </div>
        </div>
    </div>
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
.menuContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .subMenuContainer{
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 3%;
        gap: 20px;
    }

    .menu{
        display: flex;
        gap: 20px;
        overflow: hidden;
        position: relative;
    }
    
    .menu > :not(:last-child)::after {
        content: "";
        margin-left: 9px;
        margin-right: 0;
        position: absolute;
        width: 4px;
        height: 2em;
        background-color: white;
    }

}

.link{
    font-size: 2em;
    color: white;
    text-decoration: none;
    transition: all 0.1s ease-in;
}

.link:hover{
    color: rgb(126, 126, 126);
}

@media (max-width: 600px){
    .menuContainer{
        img{
            width: 50vw;
            min-width: 280px;
        }
    }
}
</style>

<style>
.p-menubar-root-list{
    transition: all 0.3s ease-in-out;
}
</style>