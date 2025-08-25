<template>
    <main>
        <NavBar />
        <section class="introduction-container">
            <h1>Aiden Derksen</h1>
            <div class="text-container">
                <p>Welcome to my portfolio! I'm Aiden Derksen, a passionate full-stack
                    developer with a knack for creating dynamic and responsive web applications. Explore my projects and
                    get in touch!</p>
            </div>
            <div class="introduction-image">
                <img src="" alt="">
            </div>
        </section>
    </main> 
</template>

<script>
import NavBar from './components/NavBar.vue';
import '@/css/navbar.css';
import '@/css/homepage.css';

export default {
    name: 'HomePage',
    components: { NavBar }
}
</script>