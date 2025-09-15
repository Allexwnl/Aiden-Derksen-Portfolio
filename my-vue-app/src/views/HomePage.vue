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
        <p>Hallo! Mijn naam is Aiden Derksen en ben een jonge fotograaf. Mijn grootste interesse ligt in documentaire en
          portret fotografie maar heb ook genoeg ervaring met product fotografie. Mensen fotograferen terwijl ze aan
          iets werken is mijn passie. Het moment vastleggen terwijl ze gepassioneerd zijn en in focus, is zo gaaf om te
          zien.
          Ik ben een harde werker beide in een team of zelfstandig. Ik kan goed een studio opzetten en stijlen om een de
          juiste sfeer over te brengen. Mijn foto’s zijn altijd in warme en kleurrijke tinten waardoor je je altijd
          comfortabel bent en meevoelt met het beeld. Als je interesse hebt neem dan vooral contact met mij op!</p>
      </div>
    </section>
    <section class="projects">
      <div v-for="project in projects" :key="project.id" class="--projectCard">
        <h2 class="text-xl">{{ project.title }}</h2>
        <p>{{ project.description }}</p>

        <div v-if="project.images.length" class="relative w-64 h-64 mt-2">
          <img :src="project.images[project.currentImage]" class="project-images" />

          <button v-if="project.images.length > 1" @click="prevImage(project)"
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded">
            ‹
          </button>

          <button v-if="project.images.length > 1" @click="nextImage(project)"
            class="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded">
            ›
          </button>
        </div>
      </div>
    </section>
    <div class="projects">
      <div class="project">Project 1</div>
      <div class="project">Project 2</div>
      <div class="project">Project 3</div>
      <div class="project">Project 4</div>
      <div class="project">Project 5</div>
      <div class="project">Project 6</div>
    </div>

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

const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.log('Fetch projects error:', error.message)
    return
  }

  projects.value = data.map(p => ({
    ...p,
    images: p.images || [],
    currentImage: 0 // start altijd bij eerste foto
  }))
}

const nextImage = (project) => {
  if (!project.images.length) return
  project.currentImage = (project.currentImage + 1) % project.images.length
}

const prevImage = (project) => {
  if (!project.images.length) return
  project.currentImage =
    (project.currentImage - 1 + project.images.length) % project.images.length
}

onMounted(() => {
  fetchProjects()
})
</script>
