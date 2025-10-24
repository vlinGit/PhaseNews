<template>
    <Toast />
    <div class="wrapper" ref="wrapper">
        <div class="initial" ref="initial" data-flip-id="news" @click="handleInitialClick">
            <div class="container">
                <Header :show-article="true"></Header>

                <div class="fold1"></div>
                <div class="fold2"></div>
            </div>
        </div>
        <div class="final" ref="final" data-flip-id="news">
            <div class="container">
                <Header :show-article="true"></Header>

                <div class="articles anim">
                    <div v-for="article in articles.slice(1, articles.length)" :key="article.title"
                        :class="['article', 'article' + article.id]" @click="redirect(article.id)">
                        <div class="thumbnail" :style="{ backgroundImage: 'url(' + article.thumbnailUrl + ')' }"
                            alt="thumbnail"></div>
                        <div class="content">
                            <h1 class="title">{{ article.title }}</h1>
                            <p class="date">{{ article.date }}</p>
                            <div class="body" v-html="article.body"></div>
                        </div>
                    </div>
                </div>

                <div class="fold1"></div>
                <div class="fold2"></div>
            </div>
        </div>
        <svg ref="loading" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="loading" aria-hidden="true" data-pc-section="loadingicon">
            <path
                d="M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z"
                fill="currentColor"></path>
        </svg>
        <div class="end"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { client } from '@/contentfulClient.js'
import { useToast } from "primevue/usetoast"
import { gsap } from 'gsap'
import Flip from "gsap/Flip"
import Draggable from "gsap/Draggable"
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useCookies } from 'vue3-cookies';
import Header from '@/components/header.vue';
import { getArticles } from '@/helpers/common';

gsap.registerPlugin(Flip, Draggable, ScrollTrigger)

const { cookies } = useCookies()
const router = useRouter()
const wrapper = ref()
const initial = ref()
const final = ref()
const toast = useToast()
const articles = ref([])
const noArticles = ref(0)
const limit = 6
const loading = ref()

const showError = (error) => {
    toast.add({ severity: 'error', summary: 'An error occured', detail: error, life: 2000 })
}

const redirect = (id) => {
    router.push({ path: `/article/${id}` })
}


const handleScroll = async () => {
    const scrolledTo = window.scrollY + window.innerHeight;
    const isReachBottom = (document.body.scrollHeight) == scrolledTo;
    if (isReachBottom) {
        window.removeEventListener("scroll", handleScroll)
        loading.value.classList.add("active")

        let articleResult = []
        getArticles(client, limit, noArticles.value).then((result: any) => {
            articleResult = result
            articles.value = articles.value.concat(result)
            noArticles.value += articles.value.length
        }).finally(() => {
            for (let article of articleResult) {
                let articleClass = ".article" + article.id
                gsap.fromTo(articleClass, {
                    y: 100,
                    opacity: 0,
                    duration: 2
                }, {
                    y: 0,
                    opacity: 1
                }).delay(0.2)
            }
            window.addEventListener("scroll", handleScroll)
            loading.value.classList.toggle("active")
        })
    }
}

const handleInitialClick = () => {
    const state = Flip.getState([initial.value, final.value])

    initial.value.classList.toggle("active")
    final.value.classList.toggle("active")

    Flip.from(state, {
        duration: 0.6,
        ease: "power1.in",
        scale: true,
        absolute: true,
        toggleClass: "flipping",
        onComplete: () => {
            final.value.classList.toggle("full")
        }
    })
}

const firstAnim = () => {
    Draggable.create(initial.value, { bounds: ".wrapper" })

    gsap.fromTo(initial.value, {
        rotation: -220,
        y: 800,
        opacity: 0
    }, {
        rotation: -10,
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1.2
    })
}

onMounted(() => {
    const visitedCookie = cookies.get("Visited");
    window.addEventListener('scroll', handleScroll)

    if (visitedCookie != "1") {
        firstAnim()
    } else {
        initial.value.classList.toggle("active")
        final.value.classList.toggle("active")
        final.value.classList.toggle("full")
    }

    gsap.from(".anim", {
        opacity: 0,
        y: 50,
        delay: 0.2,
        stagger: 0.1
    })

    gsap.to(".loading", {
        rotation: "+=360",
        repeat: -1,
        duration: 2,
        ease: "none"
    })
})
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.initial {
    display: block;
    transform: scale(0.4);
    height: calc(100vh - 179px);
}

.initial.active {
    display: none;
    height: 100%
}

.final,
.final.flipping {
    display: none;
}


.final.active {
    display: block;
    transform: scale(1);
    height: calc(100vh - 179px);
}

.final.full {
    height: 100%;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3em 4em;
    gap: 4em;
    background-color: #323233;
    border-radius: 10px 48px 48px 10px;
    width: 100%;
    max-width: 1400px;
    position: relative;
}

.container .fold1 {
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
    background-color: #414143;
    margin-left: 20px;
    position: absolute;
    z-index: -1;
    border-radius: 10px 48px 48px 10px;
}

.container .fold2 {
    top: 0;
    width: 100%;
    height: 100%;
    display: block;
    background-color: #4d4d4f;
    position: absolute;
    z-index: -2;
    border-radius: 10px 48px 48px 10px;
    margin-left: 37px;
}

.articles {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 4em;
    width: 100%;
}

.article {
    display: flex;
    align-items: center;
    transition: box-shadow 0.2s;

    .content {
        width: 80%;
    }

    .thumbnail {
        width: 60%;
        height: 300px;
        background-size: cover;
        background-position: center;
        border: 2px solid white;
    }

    .title {
        padding: 0 0.5em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 2em;
    }

    .body {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        -webkit-box-orient: vertical;
        padding: 0 1em;
    }

    .date {
        margin: 0;
        font-style: italic;
        font-size: 0.8em;
        padding: 0 1em;
    }
}

.article:nth-child(even) {
    flex-direction: row-reverse;
}

.article:hover {
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.627);
}

.loading {
    width: 50px;
    height: 50px;
    display: none;
}

.loading.active {
    display: block;
}

@media (max-width: 1500px) {
    .final {
        width: 90%;
    }
}

@media (max-width: 1000px) {

    .article {
        flex-direction: column;

        .thumbnail {
            width: 100%;
            height: 250px;
        }

        .content {
            width: 100%;
        }
    }

    .article:nth-child(even) {
        flex-direction: column;
    }

    .articles {
        grid-template-columns: repeat(1, 1fr);
    }
}

@media (max-width: 600px) {
    .container {
        padding: 2em 2em;
        width: 100%;
    }

    .header {
        .top {
            img {
                width: 10vw;
                height: 5vw;
                min-width: 30px;
                min-height: 20px;
            }
        }

        .mainTitle {
            h1 {
                font-size: 3em;
            }
        }

        .recentArticle {
            .title {
                font-size: 2em;
            }

            .thumbnail {
                height: 400px;
            }
        }
    }
}
</style>