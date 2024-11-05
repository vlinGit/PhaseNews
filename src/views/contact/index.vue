<template>
    <banner title="Contact Us" description="Got something to say?"/>
    <div class="content">
        <p>Have information you'd like to direct to the team? Perhaps a juicy scandal you'd like us to report on? Feel free to reach to us using the following methods:</p>
        <p id="twitter">Send us a DM through <a href="https://x.com/thephasenews" target="_blank">X (Twitter)</a></p>
        <div class="form">
            <h1 v-if="showForm">Fill out a form:</h1>
            <form id="contactForm" v-if="showForm">
                <p><input type="hidden" name="form-name" value="contact"/></p>
                <p>
                    <label><p>Title</p> <input type="text" name="title" required/></label>
                </p>
                <p>
                    <label><p>Email</p> <input type="email" name="email" required/></label>
                </p>
                <p>
                    <label><p>Message</p> <textarea name="message" id="message" required/></label>
                </p>
                <p>
                    <button type="submit">Submit</button>
                </p>
            </form>
            <div class="confirmBox" v-else>
                <h1>Thank you for your submission!</h1>
                <p>We'll get back to you as soon as possible.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import banner from '@/components/banner.vue'
import { onMounted, ref } from 'vue';

const showForm = ref(true)
const handleSubmit = event => {
  event.preventDefault();

  const myForm = event.target;
  const formData = new FormData(myForm);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  })
    .then(() => showForm.value = false)
    .catch(error => alert(error));
};

onMounted(() => {
    // document.querySelector("form").addEventListener("submit", handleSubmit);
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

    input[type=text]{
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