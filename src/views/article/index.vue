<template>
    <Toast />
    <div class="wrapper">
        <div class="content">
            <h1 id="title">{{ article.title }}</h1>
            <p id="date">Last Updated On: {{ article.date }}</p> 
        </div>
        <div class="content" v-html="article.body"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { client } from '@/contentfulClient.js'
import { useToast } from "primevue/usetoast"

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
            newArticle.body += `<p>${data.content[0].value}</p>`
            article.value.body = newArticle.body
            article.value.date = newArticle.date
        }else if(data.nodeType === 'embedded-asset-block'){
            const assetId = data.data.target.sys.id
            await client.getAsset(assetId)
                .then((res) => {
                    newArticle.body += `<div style="display: flex;justify-content:center;"><img style="width:60%;" src="${res.fields.file.url}" alt="${res.fields.file.title}"></div>`
                    article.value.body = newArticle.body
                    article.value.date = newArticle.date
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }
}

onMounted(() => {
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
    margin-top: 5em;
    margin-bottom: 5em;
}

.content{
    display: flex;
    flex-direction: column;
    width: 60%;

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
        width: 90%;
    }
}
</style>