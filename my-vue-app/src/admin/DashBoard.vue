<template>
    <NavBar />
    <MobileNavbar />
    <div class="dashboard">
        <h1 class="dashboardTitle">Project Dashboard</h1>

        <section class="addProjectContainer">
            <h2 class="sectionTitle">Nieuw Project</h2>

            <input v-model="title" placeholder="Titel" class="inputField" />
            <textarea v-model="description" placeholder="Beschrijving" class="inputField"></textarea>

            <input type="file" accept="image/*" multiple @change="handleFiles" class="inputFile" />

            <button @click="addProject" class="addButton" :disabled="busy">
                {{ busy ? statusText : 'Voeg project toe' }}
            </button>
        </section>

        <section class="projectsContainer">
            <div v-for="project in projects" :key="project.id" class="dashboardProjectCard">
                <h2 class="projectTitle">{{ project.title }}</h2>
                <p class="projectDescription">{{ project.description }}</p>

                <div v-if="project.images.length" class="imageCarousel">
                    <img :src="project.images[project.currentImage].thumb" class="carouselImage" />
                    <button @click="prevImage(project)" class="carouselBtn prev">‹</button>
                    <button @click="nextImage(project)" class="carouselBtn next">›</button>
                </div>

                <button @click="removeProject(project)" class="deleteButton">
                    Verwijder project
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import MobileNavbar from '../components/MobileNavbar.vue';
import '../css/dashboard.css'
import { db } from '../firebase/firebase.js'
import {
    collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { processImage } from '../lib/imageProcessing.js'
import { ref, onMounted } from 'vue'

const title = ref('')
const description = ref('')
const files = ref([])
const projects = ref([])
const busy = ref(false)
const statusText = ref('')

const handleFiles = (e) => {
    files.value = Array.from(e.target.files)
}

const fetchProjects = async () => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    projects.value = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        images: d.data().images || [],
        currentImage: 0,
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

// Verwerkt + uploadt één bestand via de Netlify-functie -> { full, thumb } CDN-URL's.
const uploadFile = async (file) => {
    const { fullB64, thumbB64 } = await processImage(file)
    const baseName = `${Date.now()}_${Math.random().toString(36).slice(2)}`
    const res = await fetch('/.netlify/functions/githubUpload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseName, fullB64, thumbB64 }),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
}

const addProject = async () => {
    if (!title.value) return alert('Titel is verplicht')

    busy.value = true
    try {
        const images = []
        for (let i = 0; i < files.value.length; i++) {
            statusText.value = `Foto ${i + 1}/${files.value.length} uploaden...`
            images.push(await uploadFile(files.value[i]))
        }

        statusText.value = 'Project opslaan...'
        await addDoc(collection(db, 'projects'), {
            title: title.value,
            description: description.value,
            images,
            cover: images[0]?.thumb || '',
            createdAt: serverTimestamp(),
        })

        alert('Project toegevoegd!')
        title.value = ''
        description.value = ''
        files.value = []
        await fetchProjects()
    } catch (e) {
        alert('Fout bij toevoegen project: ' + (e.message || e))
    } finally {
        busy.value = false
        statusText.value = ''
    }
}

const removeProject = async (project) => {
    if (!confirm('Project verwijderen?')) return
    try {
        const urls = (project.images || []).flatMap((img) => [img.full, img.thumb]).filter(Boolean)
        if (urls.length) {
            await fetch('/.netlify/functions/githubDelete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls }),
            })
        }
        await deleteDoc(doc(db, 'projects', project.id))
        await fetchProjects()
    } catch (e) {
        alert('Fout bij verwijderen: ' + (e.message || e))
    }
}

onMounted(fetchProjects)
</script>

<style scoped>
.imageCarousel {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 8px;
    margin-bottom: 10px;
}

.carouselImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
