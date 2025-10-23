<template>
    <Toast />
    <div class="wrapper" ref="wrapper">
        <div class="initial" ref="initial" data-flip-id="news" @click="handleInitialClick">
            <div class="container">
                <div class="header anim">
                    <div class="top">
                        <div class="date">
                            <p>{{ new Date().toLocaleString('default', { weekday: 'long' }) }}</p>
                            <p>{{ new Date().toLocaleString('default', {month: 'long'}) }} {{ new Date().getDate() }}, {{ new Date().getFullYear() }}</p>
                        </div>
                        <div class="seperator"></div>
                        <img src="/smallLogo.png" alt="logo">
                        <div class="seperator"></div>
                        <div class="weather">
                            <p>{{ tempF }} °F</p>
                            <p><b>{{ weather }}</b> {{ tempC }} °C</p>
                        </div>
                    </div>
                    <div class="mainTitle">
                        <h1>The Phase News Paper</h1>
                        <p>Your one stop shop for totally trustworthy and unbiased news on phase connect</p>
                    </div>
                    <div class="tripleDivider">
                        <div class="divider"></div>
                        <div class="divider"></div>
                        <div class="divider"></div>
                    </div>
                    <div class="disclaimer">
                        <p>© 2024 Phase News | Satire LLC | No Rights Reserved</p>
                    </div>
                    <div v-for="article in articles.slice(0,1)" :key="article.title" class="recentArticle anim">
                        <h1 class="title">{{ article.title }}</h1>
                        <div class="thumbnail" :style="{ backgroundImage: 'url(' + article.thumbnailUrl + ')' }" alt="thumbnail"></div>
                        <div class="content">
                            <p class="date">{{ article.date }}</p>
                            <div class="body" v-html="article.body"></div>
                        </div>
                    </div>
                </div>

                <div class="fold1"></div>
                <div class="fold2"></div>
            </div>
        </div>
        <div class="final" ref="final" data-flip-id="news">
            <div class="container">
                <div class="header anim">
                    <div class="top">
                        <div class="date">
                            <p>{{ new Date().toLocaleString('default', { weekday: 'long' }) }}</p>
                            <p>{{ new Date().toLocaleString('default', {month: 'long'}) }} {{ new Date().getDate() }}, {{ new Date().getFullYear() }}</p>
                        </div>
                        <div class="seperator"></div>
                        <img src="/smallLogo.png" alt="logo">
                        <div class="seperator"></div>
                        <div class="weather">
                            <p>{{ tempF }} °F</p>
                            <p><b>{{ weather }}</b> {{ tempC }} °C</p>
                        </div>
                    </div>
                    <div class="mainTitle">
                        <h1>The Phase News Paper</h1>
                        <p>Your one stop shop for totally trustworthy and unbiased news on phase connect</p>
                    </div>
                    <div class="tripleDivider">
                        <div class="divider"></div>
                        <div class="divider"></div>
                        <div class="divider"></div>
                    </div>
                    <div class="disclaimer">
                        <p>© 2024 Phase News | Satire LLC | No Rights Reserved</p>
                    </div>
                    <div v-for="article in articles.slice(0,1)" :key="article.title" class="recentArticle" @click="redirect(article.id)">
                        <h1 class="title">{{ article.title }}</h1>
                        <div class="thumbnail" :style="{ backgroundImage: 'url(' + article.thumbnailUrl + ')' }" alt="thumbnail"></div>
                        <div class="content">
                            <p class="date">{{ article.date }}</p>
                            <div class="body" v-html="article.body"></div>
                        </div>
                    </div>
                </div>
                <div class="articles anim">
                    <div v-for="article in articles.slice(1, articles.length)" :key="article.title" class="article" @click="redirect(article.id)">
                        <div class="thumbnail" :style="{ backgroundImage: 'url(' + article.thumbnailUrl + ')' }" alt="thumbnail"></div>
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
        <div class="end"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { client } from '@/contentfulClient.js'
import { useToast } from "primevue/usetoast"
import axios from 'axios'
import { gsap } from 'gsap'
import Flip from "gsap/Flip"
import Draggable from "gsap/Draggable"
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useCookies } from 'vue3-cookies';

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
const stopRequest = ref(false)
const tempF = ref("-"),
    tempC = ref("-"),
    weather = ref("N/A");

const showError = (error) => {
    toast.add({ severity: 'error', summary: 'An error occured', detail: error, life: 2000 })
}

const redirect = (id) => {
    router.push({path: `/article/${id}`})
}

const parseArticle = (articleData, assets) => {
    const fields = articleData.fields
    var newArticle = {
        id: articleData.sys.id,
        thumbnailUrl: "",   
        title: fields.entryName,
        body: "",
        date: articleData.sys.updatedAt.split('T')[0],
    }

    for (var i = 0; i < fields.article.content.length; i++){
        const data = fields.article.content[i]
        if(data.nodeType === 'paragraph'){
            const contents = data.content

            var tempBody = ""
            for (var j = 0; j < contents.length; j++){
                if (contents[j].nodeType === 'text'){
                    if (contents[j].value.includes('iframe')) continue;
                    tempBody += `${contents[j].value}`
                }else if (contents[j].nodeType === 'hyperlink'){
                    tempBody += contents[j].content[0].value
                }
            }
            newArticle.body += `<p>${tempBody}</p>`
        }

        try{
            newArticle.thumbnailUrl = assets[fields.thumbnail.sys.id].url
        }catch(error){
            console.log("No thumbnail found")
        }
    }
    
    articles.value.push(newArticle)
}

const parseAssets = (includes) => {
    var assets = {}

    for (var i = 0; i < includes.Asset.length; i++){
        const asset = includes.Asset[i]
        assets[asset.sys.id] = {
            url: asset.fields.file.url,
            contentType: asset.fields.file.contentType
        }
    }

    return assets
}

const getArticles = () => {
    if (stopRequest.value){
        return
    }

    client.getEntries({limit: limit, skip: noArticles.value})
        .then((res) => {
            if (noArticles.value >= res.total){
                stopRequest.value = true
                return
            }

            const assets = parseAssets(res.includes)

            for (var i = 0; i < res.items.length; i++){
                const item = res.items[i]
                parseArticle(item, assets)
            }

            noArticles.value += limit
        })
        .catch((error) => {
            console.error(error)
            showError(error)
        })
}

const getWeather = () => {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=${import.meta.env.VITE_OPENWEATHER_API_TOKEN}`)
                .then((res) => {
                    const data = res.data.list[0]
                    tempF.value = (data.main.temp).toFixed(1)
                    tempC.value = ((data.main.temp - 32) * 5/9).toFixed(1)
                    weather.value = data.weather[0].main
                }).catch((err) => {
                    console.error(err)
                    tempF.value = "-"
                    tempC.value = "-"
                    weather.value = "N/A"
                })
        })
    }
}

const handleScroll = () => {
    window.onscroll = (event) => {
        const scrolledTo = window.scrollY + window.innerHeight;
        const isReachBottom = (document.body.scrollHeight - 100) <= scrolledTo;
        if (isReachBottom) getArticles();
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
    Draggable.create(initial.value, {bounds: ".wrapper"})

    gsap.fromTo(initial.value, {
        rotation: -220,
        y: 800,
        opacity: 0
    },{
        rotation: -10,
        y: 0,
        opacity: 1,
        ease: "power3.out",
        duration: 1.2
    })
}

onMounted(() => {
    const visitedCookie = cookies.get("Visited");
    getWeather()
    getArticles()
    window.addEventListener('scroll', () => {
        handleScroll()
    })

    if (visitedCookie != "1"){
        firstAnim()
    }else{
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

    gsap.from(".article", {
        scrollTrigger: ".article",
        y: -50,
        opacity: 0
    })
})
</script>

<style scoped>
.wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.initial{
    display: block;
    transform: scale(0.4);
    height: calc(100vh - 179px);
}

.initial.active{
    display: none;
    height: 100%
}

.final,
.final.flipping{
    display: none;
}


.final.active{
    display: block;
    transform: scale(1);
    height: calc(100vh - 179px);
}

.final.full{
    height: 100%;
}

.container{
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

.container .fold1{
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

.container .fold2{
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

.articles{
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 4em;
    width: 100%;
}

.article{
    display: flex;
    align-items: center;
    transition: box-shadow 0.2s;

    .content{
        width: 80%;
    }

    .thumbnail{
        width: 60%;
        height: 300px;
        background-size: cover;
        background-position: center;
        border: 2px solid white;
    }

    .title{
        padding: 0 0.5em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
                line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 2em;
    }

    .body{
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
                line-clamp: 4; 
        -webkit-box-orient: vertical;
        padding: 0 1em;
    }

    .date{
        margin: 0;
        font-style: italic;
        font-size: 0.8em;
        padding: 0 1em;
    }
}

.article:nth-child(even){
    flex-direction: row-reverse;
}

.article:hover{
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.627);
}

.header{
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    .top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        
        img{
            width: 60px;
            height: 40px;
        }

        .date, .weather{
            p{
                margin: 0;
                font-size: 1em;
                white-space: nowrap;
            }
        }

        .weather{
            text-align: right;
        }

        .seperator{
            height: 2px;
            background-color: white;
            width: 30%;
        }
    }

    .mainTitle{
        display: flex;
        flex-direction: column;
        align-items: center;

        p, h1{
            margin: 0;
        }

        h1{
            font-size: 4em;
            margin-bottom: 5px;
        }

        p{
            font-size: 1.5em;
        }
    }

    .tripleDivider{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;

        .divider{
            height: 1px;
            background-color: white;
            width: 95%;
        }

        .divider:nth-child(2){
            width: 100%;
        }
    }

    .disclaimer{
        p{
            margin: 0;
            font-size: 1em;
            font-style: italic;
            font-weight: bold;
        }
    }

}
.recentArticle{
    display: flex;
    flex-direction: column;
    gap: 1em;
    width: 100%;

    h1, p{
        margin: 0;
        padding: 0;
    }

    .title{
        display: -webkit-box;
        -webkit-line-clamp: 4;
            -line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 3.5em;
    }

    .thumbnail{
        width: 100%;
        height: 500px;
        background-size: cover;
        background-position: center;
        border: 2px solid white;
    }

    .body{
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
                line-clamp: 4; 
        -webkit-box-orient: vertical;
    }
}

.recentArticle:hover{
    cursor: pointer;
}

@media (max-width: 1500px){
    .final{
        width: 90%;
    }
}

@media (max-width: 1000px){

    .article{
        flex-direction: column;

        .thumbnail{
            width: 100%;
            height: 250px;
        }

        .content{
            width: 100%;
        }
    }

    .article:nth-child(even){
        flex-direction: column;
    }

    .articles{
        grid-template-columns: repeat(1, 1fr);
    }
}

@media (max-width: 600px){
    .container{
        padding: 2em 2em;
        width: 100%;
    }

    .header{
        .top{
            img{
                width: 10vw;
                height: 5vw;
                min-width: 30px;
                min-height: 20px;
            }
        }

        .mainTitle{
            h1{
                font-size: 3em;
            }
        }

        .recentArticle{
            .title{
                font-size: 2em;
            }

            .thumbnail{
                height: 400px;
            }
        }
    }
}
</style>