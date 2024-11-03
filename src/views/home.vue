<template>
    <p>hello</p>
</template>

<script setup>
import { onMounted } from 'vue'
import { client } from '@/contentfulClient.js'

onMounted(() => {
    client.getEntries()
        .then((response) => {
            console.log(response.items)
        }).catch(console.error)
})
</script>

<style scoped>

</style>