<template>
  <div class="p-4">
    <h1 class="text-2xl mb-4">Project Dashboard</h1>

    <!-- Voeg project toe -->
    <div class="mb-6 border p-4 rounded">
      <h2 class="text-xl mb-2">Nieuw Project</h2>
      <input v-model="title" placeholder="Titel" class="border p-2 mb-2 w-full"/>
      <textarea v-model="description" placeholder="Beschrijving" class="border p-2 mb-2 w-full"></textarea>
      <input type="file" multiple @change="handleFiles" class="mb-2"/>
      <button @click="addProject" class="bg-blue-500 text-white p-2 rounded">Voeg project toe</button>
    </div>

    <!-- Lijst van projecten -->
    <div v-for="project in projects" :key="project.id" class="border p-4 mb-4 rounded">
      <h2 class="text-xl">{{ project.title }}</h2>
      <p>{{ project.description }}</p>
      <div class="flex gap-2 mt-2 flex-wrap">
        <img v-for="img in project.images" :src="img" :key="img" class="w-32 h-32 object-cover"/>
      </div>
      <button @click="deleteProject(project.id, project.images)" class="bg-red-500 text-white p-2 rounded mt-2">Verwijder project</button>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase/supabase.js'
const supabaseUrl = "https://reverggwhilxgijmxidc.supabase.co" // jouw project URL

export default {
  data() {
    return {
      title: '',
      description: '',
      files: [],
      projects: []
    }
  },
  mounted() {
    this.fetchProjects()
  },
  methods: {
    handleFiles(e) {
      this.files = Array.from(e.target.files)
    },

    async addProject() {
      if (!this.title) return alert('Titel is verplicht')

      if (!this.files.length) alert('Geen bestanden geselecteerd. Het project kan wel zonder afbeeldingen.')

      const uploadedUrls = []

      for (const file of this.files) {
        // ✅ Check dat het een File object is
        if (!(file instanceof File)) {
          console.log('Ongeldig bestand:', file)
          continue
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`

        // ✅ Upload naar bucket
        const { data, error } = await supabase.storage
          .from('project-images')
          .upload(fileName, file)

        if (error) {
          console.log('Upload error:', error.message)
          continue
        }

        // ✅ Public URL
        const imageUrl = `${supabaseUrl}/storage/v1/object/public/project-images/${fileName}`
        uploadedUrls.push(imageUrl)
      }

      // ✅ Voeg project toe inclusief images array
      const { data: project, error: insertError } = await supabase
        .from('projects')
        .insert([{
          title: this.title,
          description: this.description,
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
      this.title = ''
      this.description = ''
      this.files = []
      this.fetchProjects()
    },

    async fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.log('Fetch projects error:', error.message)
        return
      }

      // ✅ Zorg dat images altijd een array is
      this.projects = data.map(p => ({
        ...p,
        images: p.images || []
      }))
    },

    async deleteProject(projectId, images) {
      // ✅ Verwijder bestanden uit storage
      for (const url of images) {
        try {
          const path = url.split('/project-images/')[1]
          if (!path) continue
          const { error } = await supabase.storage.from('project-images').remove([path])
          if (error) console.log('Storage delete error:', error.message)
        } catch (err) {
          console.log('Storage delete exception:', err)
        }
      }

      // ✅ Verwijder project record
      const { error: delError } = await supabase.from('projects').delete().eq('id', projectId)
      if (delError) console.log('Delete project error:', delError.message)

      this.fetchProjects()
    }
  }
}
</script>
