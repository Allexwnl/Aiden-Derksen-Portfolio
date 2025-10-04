<template>
    <NavBar />
    <div class="projectShow">
        <button class="backBtn" @click="$router.back()">← Terug</button>

        <div v-if="project" class="projectDetails">
            <div class="projectInfo">
                <h1 class="projectTitle">{{ project.title }}</h1>
                <p class="projectDescription">{{ project.description }}</p>
            </div>
            <div v-if="project.images && project.images.length" class="imageCarousel">
                <img :src="project.images[currentImage]" class="carouselImage" alt="Project afbeelding" />

                <button @click="prevImage" class="carouselBtn prev">‹</button>
                <button @click="nextImage" class="carouselBtn next">›</button>
            </div>
        </div>

        <p v-else>Laden...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase/supabase.js'
import NavBar from '../components/NavBar.vue'
import '../css/projectShow.css';
import '../css/projectShowMobileFirst.css';

const route = useRoute()
const project = ref(null)
const currentImage = ref(0)

onMounted(async () => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', route.params.id)
        .single()

    if (error) {
        console.error('❌ Fout bij ophalen project:', error.message)
    } else {
        project.value = data
    }
})

const nextImage = () => {
    if (!project.value || !project.value.images.length) return
    currentImage.value = (currentImage.value + 1) % project.value.images.length
}

const prevImage = () => {
    if (!project.value || !project.value.images.length) return
    currentImage.value =
        (currentImage.value - 1 + project.value.images.length) %
        project.value.images.length
}
</script>