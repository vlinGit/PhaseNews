<template>
    <Toast />
    <div class="banner">
        <header>
            <div class="wrapper">
                <nav>
                <RouterLink to="/">Home</RouterLink>
                </nav>
            </div>
        </header>

        <transition name="fade" appear>
            <div id="bannerText" v-if="showBannerText">
                <h1>Phase News</h1>
                <p>Your one stop shop for totally trustworthy and unbiased news on phase connect</p>
            </div>
        </transition>

        <div id="bannerContainer">
            <img src="../../../public/sakanaRocket.gif" id="bgBanner" alt="Banner background">
        </div>
    </div>

    <div class="container">
        <div class="articles">
            <div v-for="article in articles" :key="article.title" class="article" @click="redirect(article.id)">
                <div id="thumbnail" :style="{ backgroundImage: 'url(' + article.thumbnailUrl + ')' }" alt="thumbnail"></div>
                <h1 id="title">{{ article.title }}</h1>
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
import { RouterLink } from 'vue-router';

const showBannerText = ref(false)
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
        body: ""
    }

    for (var i = 0; i < fields.article.content.length; i++){
        const data = fields.article.content[i]
        if(data.nodeType === 'paragraph'){
            newArticle.body += `<p>${data.content[0].value}</p>`
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

const isScrolledIntoView = (el) => {
  let rect = el.getBoundingClientRect()
  let elemTop = rect.top
  let elemBottom = rect.bottom

  let isVisible = elemTop < window.innerHeight && elemBottom >= 0
  return isVisible
}

const handleScroll = () => {
  window.onscroll = (event) => {
    let scrolledTo = document.querySelector('.end')

    if (scrolledTo && isScrolledIntoView(scrolledTo)) {
        getArticles()
    }
  }
}

onMounted(() => {
    getArticles()

    window.addEventListener('scroll', () => {
        handleScroll()
    })

    setTimeout(() => {
        showBannerText.value = true
    }, 200)
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

    #thumbnail{
        height: 200px;
        background-size: cover;
        background-position: center;
    }

    #body{
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4; /* number of lines to show */
                line-clamp: 4; 
        -webkit-box-orient: vertical;
    }
}

header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

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
    font-size: 8em;
    margin: 0;
  }

  p{
    font-size: 1.3em;
    margin: 0;
  }
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