<template>
    <main>
        <NavBar />
        <section class="introduction-container">
            <div class="text-container">
                <h1>Aiden Derksen</h1>
                <p></p>
            </div>
            <div class="introduction-image">
                <img src="../assets/img/aidenPF.jpg" alt="">
            </div>
        </section>
        <section class="about-me-container">
            <img src="../assets/img/camera.png" alt="">
            <div class="about-me-text">
                <h2 id="about">About Me</h2>
                <p></p>
            </div>
        </section>
        <section class="projects">
            <div v-for="project in projects" :key="project.id" class="border p-4 mb-4 rounded">
                <h2 class="text-xl">{{ project.title }}</h2>
                <p>{{ project.description }}</p>
                <div class="flex gap-2 mt-2 flex-wrap">
                    <img v-for="img in project.images" :src="img" :key="img" class="w-32 h-32 object-cover" />
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import '../css/navbar.css';
import '../css/homepage.css';
import { supabase } from '../supabase/supabase.js'
import { ref, onMounted } from 'vue'

// Reactive variable
const projects = ref([])

// Fetch projects
const fetchProjects = async () => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false })

    if (error) {
        console.log(error.message)
        return
    }

    projects.value = data.map(p => ({
        ...p,
        images: p.images || []
    }))
}

// Run on component mount
onMounted(() => {
    fetchProjects()
})
</script>
