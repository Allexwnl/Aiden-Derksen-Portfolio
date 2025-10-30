<template>
    <NavBar />
    <MobileNavbar />
    <div class="dashboard">
        <h1 class="dashboardTitle">Project Dashboard</h1>

        <!-- Nieuw project formulier -->
        <section class="addProjectContainer">
            <h2 class="sectionTitle">Nieuw Project</h2>

            <input v-model="title" placeholder="Titel" class="inputField" />
            <textarea v-model="description" placeholder="Beschrijving" class="inputField"></textarea>

            <input type="file" multiple @change="handleFiles" class="inputFile" />

            <button @click="addProject" class="addButton">
                Voeg project toe
            </button>
        </section>

        <!-- Project overzicht -->
        <section class="projectsContainer">
            <div v-for="project in projects" :key="project.id" class="dashboardProjectCard">
                <h2 class="projectTitle">{{ project.title }}</h2>
                <p class="projectDescription">{{ project.description }}</p>

                <!-- Afbeeldingencarrousel -->
                <div v-if="project.images.length" class="imageCarousel">
                    <img :src="project.images[project.currentImage]" class="carouselImage" />

                    <button @click="prevImage(project)" class="carouselBtn prev">‹</button>
                    <button @click="nextImage(project)" class="carouselBtn next">›</button>
                </div>

                <!-- Verwijderknop -->
                <button @click="deleteProject(project.id, project.images)" class="deleteButton">
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
import { supabase } from '../supabase/supabase.js'
import { ref, onMounted } from 'vue'

const supabaseUrl = 'https://reverggwhilxgijmxidc.supabase.co'

// Reactieve data
const title = ref('')
const description = ref('')
const files = ref([])
const projects = ref([])

// Bestand selectie
const handleFiles = (e) => {
    files.value = Array.from(e.target.files)
    console.log('Geselecteerde bestanden:', files.value)
}

// Projecten ophalen
const fetchProjects = async () => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false })

    if (error) {
        console.error('❌ Fout bij ophalen projecten:', error.message)
        return
    }

    projects.value = data.map((p) => ({
        ...p,
        images: p.images || [],
        currentImage: 0,
    }))
}

// Volgende afbeelding
const nextImage = (project) => {
    if (!project.images.length) return
    project.currentImage = (project.currentImage + 1) % project.images.length
}

// Vorige afbeelding
const prevImage = (project) => {
    if (!project.images.length) return
    project.currentImage =
        (project.currentImage - 1 + project.images.length) % project.images.length
}

// Project toevoegen
const addProject = async () => {
    console.log('▶️ addProject functie gestart')

    if (!title.value) return alert('Titel is verplicht')

    const uploadedUrls = []

    // Afbeeldingen uploaden
    if (files.value.length) {
        for (const file of files.value) {
            if (!(file instanceof File)) continue

            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(fileName, file)

            if (uploadError) {
                console.error('❌ Upload fout:', uploadError.message)
                continue
            }

            const publicUrl = `${supabaseUrl}/storage/v1/object/public/project-images/${fileName}`
            uploadedUrls.push(publicUrl)
        }
    }

    const { data, error: insertError } = await supabase
        .from('projects')
        .insert([
            {
                title: title.value,
                description: description.value,
                images: uploadedUrls,
            },
        ])
        .select()

    if (insertError) {
        console.error('❌ Fout bij toevoegen project:', insertError.message)
        alert('Fout bij toevoegen project: ' + insertError.message)
        return
    }

    console.log('✅ Project toegevoegd:', data)
    alert('Project toegevoegd!')

    title.value = ''
    description.value = ''
    files.value = []

    fetchProjects()
}

// Project verwijderen
const deleteProject = async (projectId, imagesArray) => {
    for (const url of imagesArray) {
        try {
            const path = url.split('/project-images/')[1]
            if (!path) continue
            const { error } = await supabase.storage.from('project-images').remove([path])
            if (error) console.error('Storage delete error:', error.message)
        } catch (err) {
            console.error('Storage delete exception:', err)
        }
    }

    const { error: delError } = await supabase.from('projects').delete().eq('id', projectId)
    if (delError) console.error('Delete project error:', delError.message)

    fetchProjects()
}

onMounted(() => {
    fetchProjects()
})
</script>

<style scoped>
.dashboard {
    padding: 20px;
    max-width: 1000px;
    margin: auto;
    font-family: Arial, sans-serif;
}

.dashboardTitle {
    text-align: center;
    margin-bottom: 30px;
}

.addProjectContainer {
    background-color: #f5f5f5;
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 40px;
}

.sectionTitle {
    font-size: 20px;
    margin-bottom: 10px;
}

.inputField {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #aaa;
    border-radius: 4px;
}

.inputFile {
    display: block;
    margin-bottom: 15px;
}

.addButton {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.addButton:hover {
    background-color: #0056b3;
}

.projectsContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

.dashboardProjectCard {
    width: 300px;
    background-color: #e0e0e0;
    border: 2px solid #333;
    border-radius: 10px;
    padding: 15px;
    position: relative;
}

.projectTitle {
    font-size: 18px;
    margin-bottom: 5px;
}

.projectDescription {
    font-size: 14px;
    margin-bottom: 10px;
}

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

.carouselBtn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    font-size: 20px;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
}

.carouselBtn.prev {
    left: 10px;
}

.carouselBtn.next {
    right: 10px;
}

.deleteButton {
    background-color: #c62828;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
}

.deleteButton:hover {
    background-color: #a91f1f;
}
</style>
