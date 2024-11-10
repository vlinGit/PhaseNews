<template>
    <Toast />
    <banner />
    <div class="container">
        <div class="articles">
            <div v-for="article in articles" :key="article.title" class="article" @click="redirect(article.id)">
                <div id="thumbnail" :style="{ backgroundImage: 'url(' + article.thumbnailUrl + ')' }" alt="thumbnail"></div>
                <h1 id="title">{{ article.title }}</h1>
                <p id="date">{{ article.date }}</p>
                <div id="body" v-html="article.body"></div>
            </div>
        </div>
    </div>
    <div class="end"></div>
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
            if (res.total == 0){
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
    const isReachBottom = document.body.scrollHeight === scrolledTo;
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
.container{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3em;
}

.articles{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5em;
    width: 80%;
}

.article{
    height: 400px;
    transition: box-shadow 0.2s;

    #thumbnail{
        height: 200px;
        background-size: cover;
        background-position: center;
        border: 2px solid white;
    }

    #title{
        padding: 0 0.5em;
        display: -webkit-box;
        -webkit-line-clamp: 2;
                line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 1.5em;
    }

    #body{
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
                line-clamp: 4; 
        -webkit-box-orient: vertical;
        padding: 0 1em;
    }

    #date{
        margin: 0;
        font-style: italic;
        font-size: 0.8em;
        padding: 0 1em;
    }
}

.article:hover{
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.627);
}

header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

@media (max-width: 800px){
    .articles{
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px){
    .articles{
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>