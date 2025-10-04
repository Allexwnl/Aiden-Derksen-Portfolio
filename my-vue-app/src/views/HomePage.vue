<template>
  <main>
    <NavBar />
    <section class="introduction-container">
      <div class="--textAndButtonContainer">
        <div class="text-container">
          <h1>Aiden Derksen</h1>
          <p>Hallo! Mijn naam is Aiden Derksen en ben een jonge fotograaf. Mijn grootste interesse ligt in documentaire
            en
            portret fotografie maar heb ook genoeg ervaring met product fotografie. Mensen fotograferen terwijl ze aan
            iets werken is mijn passie. Het moment vastleggen terwijl ze gepassioneerd zijn en in focus, is zo gaaf om
            te
            zien.
            Ik ben een harde werker beide in een team of zelfstandig. Ik kan goed een studio opzetten en stijlen om een
            de
            juiste sfeer over te brengen. Mijn foto’s zijn altijd in warme en kleurrijke tinten waardoor je je altijd
            comfortabel bent en meevoelt met het beeld. Als je interesse hebt neem dan vooral contact met mij op!</p>
        </div>
        <div class="button-container">
          <button class="--projectBtn"><a href="#projects">[Bekijk projecten]</a> </button>
        </div>
      </div>
      <div class="introduction-image">
        <img src="../assets/img/aidenPF.jpeg" alt="">
        <img class="--mobileImg" src="../assets/img/mobilePFP.png" alt="">
      </div>
    </section>
    <h2 class="--title">Projecten</h2>
    <section id="projects" class="projects">
      <div v-for="project in projects" :key="project.id" class="--projectCard" @click="goToProject(project.id)">
        <img :src="project.images[project.currentImage]" class="project-images" alt="Project afbeelding" />
        <h2 class="--projectTitle">{{ project.title }}</h2>
      </div>
    </section>


  </main>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import '../css/navbar.css';
import '../css/homepage.css';
import '../css/standardCSS.css';
import '../css/projectCards.css';
import '../css/homePageMobileFirst.css';
import { supabase } from '../supabase/supabase.js'
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const goToProject = (id) => {
  router.push(`/project/${id}`)
}

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
