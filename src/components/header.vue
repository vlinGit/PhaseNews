<template>
    <div class="header">
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
            <p>© {{ new Date().getFullYear() }} Phase News | Satire LLC | No Rights Reserved</p>
        </div>
        <div v-if="props.showArticle && article" class="recentArticle" @click="router.push({ path: `/article/${article.id}` })">
            <h1 class="title">{{ article.title }}</h1>
            <div class="thumbnail" :style="{ backgroundImage: 'url(' + article.thumbnailUrl + ')' }" alt="thumbnail"></div>
            <div class="content">
                <p class="date">{{ article.date }}</p>
                <div class="body" v-html="article.body"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { client } from "@/contentfulClient"
import { getArticles } from "@/helpers/common"
import axios from 'axios'

const router = useRouter()
const props = withDefaults(defineProps<{
    showArticle?: boolean
}>(), {
    showArticle: false
})
const article = ref()
const tempF = ref("-"),
    tempC = ref("-"),
    weather = ref("N/A")

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

onMounted(() => {
    getWeather()
     getArticles(client, 1, 0).then((result) => {
        article.value = result[0]
    })
})
</script>

<style scoped>
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
</style>