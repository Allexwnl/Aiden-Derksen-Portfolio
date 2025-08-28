<template>
  <NavBar />
  <div class="p-4">
    <input v-model="email" placeholder="E-mail" type="email" class="border p-2 mb-2 w-full"/>
    <input v-model="password" placeholder="Wachtwoord" type="password" class="border p-2 mb-2 w-full"/>
    <button @click="login" class="bg-blue-500 text-white p-2 rounded">Login</button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import { supabase } from '../supabase/supabase.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Reactive variables
const email = ref('')
const password = ref('')
const error = ref('')

// Router
const router = useRouter()

// Allowed emails
const allowedEmails = [
  "alexanderzoet@gmail.com",
  "aidenderksen2007@gmail.com"
]

// Login function
const login = async () => {
  if (!allowedEmails.includes(email.value)) {
    error.value = "Deze e-mail mag niet inloggen"
    return
  }

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (loginError) {
    error.value = loginError.message
  } else {
    router.push('/dashboard')
  }
}
</script>
