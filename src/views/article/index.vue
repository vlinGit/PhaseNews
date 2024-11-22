<template>
    <Toast />
    <div class="wrapper">
        <div class="article">
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
                    <p>© 2024 Phase News | Satire LLC | No Rights Reserved</p>
                </div>
            </div>

            <div class="content">
                <h1 id="title">{{ article.title }}</h1>
                <p id="date">Last Updated On: {{ article.date }}</p> 
            </div>
            <div class="content" v-html="article.body"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { client } from '@/contentfulClient.js'
import { useToast } from "primevue/usetoast"
import axios from 'axios'

const toast = useToast()
const showError = (error) => {
    toast.add({ severity: 'error', summary: 'An error occured', detail: error, life: 2000 })
}

const route = useRoute();
const articleId  = ref(route.path.split('/')[2])
const article = ref({
    title: "",
    body: "",
    date: ""
})
const tempF = ref("-"),
    tempC = ref("-"),
    weather = ref("N/A");

const parseText = (text) => {
    if (text.includes('iframe')){
        return '<div style="display: flex;justify-content:center;">' + text + '</div>'
    }

    return text
}

async function parseArticle (articleData){
    const fields = articleData.fields
    var newArticle = {
        title: fields.entryName,
        body: "",
        date: articleData.sys.updatedAt.split('T')[0],
    }

    article.value.title = newArticle.title
    for (var i = 0; i < fields.article.content.length; i++){
        const data = fields.article.content[i]
        if (data.nodeType === 'heading-1'){
            newArticle.body += `<h2>${data.content[0].value}</h2>`
            article.value.body = newArticle.body
            article.value.date = newArticle.date
        }else if(data.nodeType === 'paragraph'){
            const contents = data.content

            var tempBody = ""
            for (var j = 0; j < contents.length; j++){
                if (contents[j].nodeType === 'text'){
                    tempBody += parseText(contents[j].value)
                }else if (contents[j].nodeType === 'hyperlink'){
                    tempBody += "<a style='color: #3f9bfc' target='_blank' href='" + content.data.uri + "'>" + content.content[0].value + "</a>"
                }
            }
            
            newArticle.body += `<p>${tempBody}</p>`
            article.value.body = newArticle.body
            article.value.date = newArticle.date
        }else if(data.nodeType === 'embedded-asset-block'){
            const assetId = data.data.target.sys.id
            await client.getAsset(assetId)
                .then((res) => {
                    newArticle.body += `<div style="display: flex;justify-content:center;"><img style="width:60%;min-width: 230px" src="${res.fields.file.url}" alt="${res.fields.file.title}"></div>`
                    article.value.body = newArticle.body
                    article.value.date = newArticle.date
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }
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

onMounted(() => {
    getWeather()

    client.getEntry(articleId.value)
        .then((res) => {
            parseArticle(res)
        })
        .catch((error) => {
            console.error(error)
            showError(error)
        })
})
</script>

<style scoped>
.wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 5em;
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
}

.article{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3em 4em;
    background-color: #323233;
    border-radius: 10px 48px 48px 10px;
    width: 80%;
    max-width: 1460px;
    position: relative;
}

.article::before{
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    background-color: #414143;
    margin-left: 20px;
    position: absolute;
    z-index: -1;
    border-radius: 10px 48px 48px 10px;
}

.article::after{
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    background-color: #4d4d4f;
    position: absolute;
    z-index: -2;
    border-radius: 10px 48px 48px 10px;
    margin-left: 37px;
}

.content{
    display: flex;
    flex-direction: column;

    #title{
        font-size: 3em;
    }

    #date{
        font-style: italic;
        opacity: 0.8;
    }
}


@media (max-width: 600px){
    .content{
        width: 100%;

        #title{
            font-size: 2em;
        }
    }

    .article{
        border-radius: 10px 30px 30px 10px;
        padding: 2em 2em;
        width: 90%;
    }

    .article::before, .article::after{
        border-radius: 10px 30px 30px 10px;
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