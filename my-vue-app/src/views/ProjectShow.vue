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
        <transition name="fade" mode="out-in">
          <img
            :key="project.images[currentImage]"
            :src="project.images[currentImage]"
            class="carouselImage"
            alt="Project afbeelding"
          />
        </transition>

        <button @click="prevImage" class="carouselBtn prev">‹</button>
        <button @click="nextImage" class="carouselBtn next">›</button>
      </div>
    </div>

    <p v-else>Laden...</p>
  </div>
  <FooTer />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase/supabase.js'
import NavBar from '../components/NavBar.vue'
import FooTer from '../components/FooTer.vue'
import '../css/projectShow.css'
import '../css/projectShowMobileFirst.css'

const route = useRoute()
const project = ref(null)
const currentImage = ref(0)

// Functie om afbeeldingen vooraf te laden
function preloadImages(images) {
  images.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

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

// Zodra project is geladen, preload alle afbeeldingen
watch(project, (newVal) => {
  if (newVal && newVal.images) {
    preloadImages(newVal.images)
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

<style scoped>
/* ====== FADE ANIMATIE ====== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ====== BASIS STIJLEN ====== */

.imageCarousel {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carouselImage {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0);
}

.carouselBtn:hover {
  background: #c300ff;
}
</style>
