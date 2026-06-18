<template>
  <main>
    <NavBar />
    <MobileNavbar />

    <section class="hero">
      <div class="hero-text">
        <p class="hero-eyebrow">Fotograaf</p>
        <h1 class="hero-title">Aiden Derksen</h1>
        <p class="hero-intro">{{ intro }}</p>
        <a href="#projects" class="hero-cta">Bekijk projecten</a>
      </div>
      <div class="hero-image">
        <img src="../assets/img/aidenPF.jpeg" alt="Aiden Derksen" />
        <img class="--mobileImg" src="../assets/img/mobilePFP.png" alt="Aiden Derksen" />
      </div>
    </section>

    <section id="projects" class="projects-section" ref="projectsSection">
      <div class="projects-head">
        <h2 class="projects-title">Projecten</h2>
      </div>

      <div class="gallery">
        <article
          v-for="project in projects"
          :key="project.id"
          class="gallery-card"
          @click="goToProject(project.id)"
        >
          <img :src="project.cover" :alt="project.title" loading="lazy" class="gallery-img" />
          <div class="gallery-cap"><span>{{ project.title }}</span></div>
        </article>
      </div>

      <div v-if="hasMore" class="load-more-wrap">
        <button class="load-more" @click="loadPage" :disabled="loading">
          {{ loading ? 'Laden...' : 'Meer laden' }}
        </button>
      </div>
    </section>

    <FooTer />
  </main>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import MobileNavbar from '../components/MobileNavbar.vue';
import FooTer from '../components/FooTer.vue';
import '../css/navbar.css';
import '../css/mobileNavbar.css';
import '../css/homepage.css';
import '../css/standardCSS.css';
import '../css/projectCards.css';
import '../css/homePageMobileFirst.css';
import { db } from '../firebase/firebase.js'
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToProject = (id) => router.push(`/project/${id}`)

const intro = `Hallo! Mijn naam is Aiden Derksen en ik ben een jonge fotograaf. Mijn grootste interesse ligt in documentaire en portretfotografie, maar ik heb ook ervaring met productfotografie. Het moment vastleggen terwijl mensen gepassioneerd en in focus zijn, is mijn passie — altijd in warme en kleurrijke tinten.`

const PAGE_SIZE = 9
const projects = ref([])
const hasMore = ref(false)
const loading = ref(false)
let lastDoc = null

const loadPage = async () => {
  loading.value = true
  try {
    const base = [collection(db, 'projects'), orderBy('createdAt', 'desc')]
    const q = lastDoc
      ? query(...base, startAfter(lastDoc), limit(PAGE_SIZE))
      : query(...base, limit(PAGE_SIZE))
    const snap = await getDocs(q)
    snap.docs.forEach((d) => {
      const data = d.data()
      projects.value.push({ id: d.id, title: data.title, cover: data.cover })
    })
    if (snap.docs.length) lastDoc = snap.docs[snap.docs.length - 1]
    hasMore.value = snap.docs.length === PAGE_SIZE
  } finally {
    loading.value = false
  }
}

onMounted(loadPage)
</script>
