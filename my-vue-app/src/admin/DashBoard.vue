<template>
    <NavBar />
    <div class="p-4">
        <h1 class="dashboardTitle">Project Dashboard</h1>

        <section class="container">
            <div class="addProjectContainer">
                <h2 class="text-xl mb-2">Nieuw Project</h2>
                <input v-model="title" placeholder="Titel" class="border p-2 mb-2 w-full" />
                <textarea v-model="description" placeholder="Beschrijving" class="border p-2 mb-2 w-full"></textarea>
                <input type="file" multiple @change="handleFiles" class="mb-2" />
                <button @click="addProject" class="bg-blue-500 text-white p-2 rounded">Voeg project toe</button>
            </div>
        </section>
        <section class="container-row">
            <div v-for="project in projects" :key="project.id" class="dashboardProjectCard">
                <h2 class="text-xl">{{ project.title }}</h2>
                <p>{{ project.description }}</p>

                <!-- Carousel -->
                <div v-if="project.images.length" class="project-images">
                    <img :src="project.images[project.currentImage]" class="" />

                    <!-- Prev knop -->
                    <button @click="prevImage(project)" class="">
                        ‹
                    </button>

                    <!-- Next knop -->
                    <button @click="nextImage(project)" class="">
                        ›
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped></style>

<script setup>
import NavBar from '../components/NavBar.vue'
import '../css/dashboard.css'
import { supabase } from '../supabase/supabase.js'
import { ref, onMounted } from 'vue'

const supabaseUrl = "https://reverggwhilxgijmxidc.supabase.co"

// Reactive variables
const title = ref('')
const description = ref('')
const files = ref([])
const projects = ref([])

// Handle file selection
const handleFiles = (e) => {
    files.value = Array.from(e.target.files)
}

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

// Add project
const addProject = async () => {
    if (!title.value) return alert('Titel is verplicht')
    if (!files.value.length) alert('Geen bestanden geselecteerd. Het project kan wel zonder afbeeldingen.')

    const uploadedUrls = []

    for (const file of files.value) {
        if (!(file instanceof File)) {
            console.log('Ongeldig bestand:', file)
            continue
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(fileName, file)

        if (uploadError) {
            console.log('Upload error:', uploadError.message)
            continue
        }

        uploadedUrls.push(`${supabaseUrl}/storage/v1/object/public/project-images/${fileName}`)
    }

    const { data: project, error: insertError } = await supabase
        .from('projects')
        .insert([{
            title: title.value,
            description: description.value,
            images: uploadedUrls
        }])
        .select()
        .single()

    if (insertError) {
        console.log('Insert project error:', insertError.message)
        alert('Fout bij toevoegen project: ' + insertError.message)
        return
    }

    alert('Project toegevoegd!')
    title.value = ''
    description.value = ''
    files.value = []
    fetchProjects()
}

// Delete project
const deleteProject = async (projectId, imagesArray) => {
    for (const url of imagesArray) {
        try {
            const path = url.split('/project-images/')[1]
            if (!path) continue
            const { error } = await supabase.storage.from('project-images').remove([path])
            if (error) console.log('Storage delete error:', error.message)
        } catch (err) {
            console.log('Storage delete exception:', err)
        }
    }

    const { error: delError } = await supabase.from('projects').delete().eq('id', projectId)
    if (delError) console.log('Delete project error:', delError.message)

    fetchProjects()
}

// Fetch projects on mount
onMounted(() => {
    fetchProjects()
})
</script>
