<template>
    <banner title="Contact Us" description="Got something to say?"/>
    <div class="content">
        <p>Have information you'd like to direct to the team? Perhaps a juicy scandal you'd like us to report on? Feel free to reach to us using the following methods:</p>
        <p id="twitter">Send us a DM through <a href="https://x.com/thephasenews" target="_blank">X (Twitter)</a></p>
        <p id="twitter" >Fill out a <a href="/form.html">form</a></p>
    </div>
</template>

<script setup>
import banner from '@/components/banner.vue'
import netlifyForm from '/form.html?url&raw'
</script>

<style scoped>
.content{
    padding: 4em;
}

#twitter{
    font-size: 2em;

    a{
        text-decoration: underline;
        color: rgb(226, 246, 255);
    }
}

.form{
    border: 0.6em solid white;
    padding: 1em;
    
    input[type=email]{
        width: 100%;
        padding: 1em;
    }

    #message{
        height: 10em;
        width: 100%;
        padding: 1em;
    }

    button{
        border: none;
        background-color: white;
        padding: 1em;
        font-weight: bold;
        transition: background-color 0.1s ease-in;
        cursor: pointer;
    }

    button:hover{
        background-color: rgb(200, 200, 200);
    }
}
</style>