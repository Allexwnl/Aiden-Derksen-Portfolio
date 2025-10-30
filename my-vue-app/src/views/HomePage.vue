<template>
  <main>
    <NavBar />
    <MobileNavbar />
    <section class="introduction-container">
      <div class="--textAndButtonContainer">
        <div class="text-container">
          <h1>Aiden Derksen</h1>
          <p>
            Hallo! Mijn naam is Aiden Derksen en ben een jonge fotograaf. Mijn grootste interesse ligt in
            documentaire en portret fotografie maar heb ook genoeg ervaring met product fotografie. Mensen
            fotograferen terwijl ze aan iets werken is mijn passie. Het moment vastleggen terwijl ze
            gepassioneerd zijn en in focus, is zo gaaf om te zien. Ik ben een harde werker beide in een
            team of zelfstandig. Ik kan goed een studio opzetten en stijlen om de juiste sfeer over te
            brengen. Mijn foto’s zijn altijd in warme en kleurrijke tinten waardoor je je altijd
            comfortabel bent en meevoelt met het beeld. Als je interesse hebt neem dan vooral contact met
            mij op!
          </p>
        </div>
        <div class="button-container">
          <button class="--projectBtn"><a href="#projects">[Bekijk projecten]</a></button>
        </div>
      </div>
      <div class="introduction-image">
        <img src="../assets/img/aidenPF.jpeg" alt="">
        <img class="--mobileImg" src="../assets/img/mobilePFP.png" alt="">
      </div>
    </section>

    <h2 class="--title">Projecten</h2>
<section id="projects" class="projects" ref="projectsSection">
  <div
    v-for="(project, index) in projects"
    :key="project.id"
    class="--projectCard"
    :class="{ 'visible': project.visible }"
    :style="{ '--index': index }"
    @click="goToProject(project.id)"
  >
    <img :src="project.images[project.currentImage]" class="project-images" alt="Project afbeelding" />
    <h2 class="--projectTitle">{{ project.title }}</h2>
  </div>
</section>


    <FooTer />
  </main>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import FooTer from '../components/FooTer.vue';
import '../css/navbar.css';
import '../css/mobileNavbar.css';
import '../css/homepage.css';
import '../css/standardCSS.css';
import '../css/projectCards.css';
import '../css/homePageMobileFirst.css';
import { supabase } from '../supabase/supabase.js'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MobileNavbar from '../components/MobileNavbar.vue';

const router = useRouter()

const goToProject = (id) => {
  router.push(`/project/${id}`)
}

const projects = ref([])
const projectsSection = ref(null)

const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false })

  if (error) return

  projects.value = data.map(p => ({
    ...p,
    images: p.images || [],
    currentImage: 0,
    visible: false, // toegevoegd voor scroll-triggered fade-in
  }))
}

onMounted(() => {
  fetchProjects().then(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            projects.value.forEach((p, i) => {
              setTimeout(() => {
                p.visible = true
              }, i * 100) // staggered effect
            })
            observer.disconnect() // animatie maar 1x
          }
        })
      },
      {
        threshold: 0.1, // 10% van de sectie zichtbaar
      }
    )

    if (projectsSection.value) {
      observer.observe(projectsSection.value)
    }
  })
})

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.card-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.card-fade-enter-active {
  transition: opacity 3s ease, transform 3s ease;
}
.card-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.--projectCard {
  transform: translateY(20px);
  transition: opacity 2s ease, transform 2s ease;
}

.--projectCard.visible {
  opacity: 1;
  transform: translateY(0);
}

</style>
