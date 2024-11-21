<template>
    <Toast />
    <div class="wrapper">
        <div class="container">
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
                        <p>68°F</p>
                        <p><b>Cloudy</b> 20°C</p>
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
            <div class="articles">
                <div v-for="article in articles.slice(1, articles.length)" :key="article.title" class="article" @click="redirect(article.id)">
                    <div class="thumbnail" :style="{ backgroundImage: 'url(' + article.thumbnailUrl + ')' }" alt="thumbnail"></div>
                    <div class="content">
                        <h1 class="title">{{ article.title }}</h1>
                        <p class="date">{{ article.date }}</p>
                        <div class="body" v-html="article.body"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="end"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { client } from '@/contentfulClient.js'
import { useToast } from "primevue/usetoast"
import banner from '@/components/banner.vue'

const toast = useToast()
const articles = ref([])
const noArticles = ref(0)
const limit = 6
const stopRequest = ref(false)

const showError = (error) => {
    toast.add({ severity: 'error', summary: 'An error occured', detail: error, life: 2000 })
}

const redirect = (id) => {
    window.location.href = `/article/${id}`
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

const handleScroll = () => {
    window.onscroll = (event) => {
        const scrolledTo = window.scrollY + window.innerHeight;
        const isReachBottom = (document.body.scrollHeight - 100) <= scrolledTo;
        if (isReachBottom) getArticles();
    }
}

onMounted(() => {
    getArticles()

    window.addEventListener('scroll', () => {
        handleScroll()
    })
})
</script>

<style scoped>
.wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
}

.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3em 4em;
    gap: 30px;
    background-color: #323233;
    border-radius: 10px 48px 48px 10px;
    width: 80%;
    max-width: 1460px;
}

.articles{
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5em;
    width: 100%;
}

.article{
    display: flex;
    height: fit-content;
    transition: box-shadow 0.2s;

    .content{
        width: 80%;
    }

    .thumbnail{
        width: 60%;
        height: 200px;
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
        font-size: 1.5em;
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
            -webkit-line-clamp: 2;
                    line-clamp: 2;
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

@media (max-width: 1000px){
    .container{
        width: 90%;
    }
}

@media (max-width: 600px){
    .article{
        flex-direction: column;

        .thumbnail{
            width: 100%;
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
</style>