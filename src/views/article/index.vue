<template>
    <Toast />
    <div class="wrapper">
        <h1 id="title">{{ article.title }}</h1>
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
    body: ""
})

const parseArticle = (articleData) => {
    const fields = articleData.fields
    var newArticle = {
        title: articleData.entryName,
        body: ""
    }

    article.value.title = newArticle.title
    for (var i = 0; i < fields.article.content.length; i++){
        const data = fields.article.content[i]
        if (data.nodeType === 'heading-1'){
            newArticle.body += `<h2>${data.content[0].value}</h2>`
        }else if(data.nodeType === 'paragraph'){
            newArticle.body += `<p>${data.content[0].value}</p>`
        }else if(data.nodeType === 'embedded-asset-block'){
            const assetId = data.data.target.sys.id
            client.getAsset(assetId)
                .then((res) => {
                    newArticle.body += `<img src="${res.fields.file.url}" alt="${res.fields.file.title}">`
                    article.value.body = newArticle.body
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

</style>