<template>
    <banner title="Contact Us" description="Got something to say?"/>
    <div class="content">
        <p>Have information you'd like to direct to the team? Perhaps a juicy scandal you'd like us to report on? Feel free to reach to us using the following methods:</p>
        <p id="twitter">Send us a DM through <a href="https://x.com/thephasenews" target="_blank">X (Twitter)</a></p>
        <div class="form">
            <h1>Fill out a form:</h1>
            <form name="Contact" netlify netlify-honeypot="bot-field" id="contactForm">
                <p>
                    <label><p>Title</p> <input type="text" name="title" required/></label>
                </p>
                <p>
                    <label><p>Email</p> <input type="email" name="email" required/></label>
                </p>
                <p>
                    <label><p>Message</p> <textarea id="message" required/></label>
                </p>
                <p>
                    <button type="submit">Submit</button>
                </p>
            </form>
        </div>
    </div>
</template>

<script setup>
import banner from '@/components/banner.vue'
import { onMounted } from 'vue';

const submitForm = (event) => {
    event.preventDefault();

    const myForm = event.target;
    const formData = new FormData(myForm);

    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
    })
        .then(() => console.log("Form successfully submitted"))
        .catch(error => alert(error));
}

onMounted(() => {
    document.querySelector("#contactForm").addEventListener("submit", submitForm);
})
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