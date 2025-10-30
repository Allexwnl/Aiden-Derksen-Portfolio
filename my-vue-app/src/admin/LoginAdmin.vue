<template>
  <NavBar />
  <MobileNavbar />
  <section class="login">
    <div class="--containerLogin">
      <h1>Admin Login</h1>
      <input v-model="email" placeholder="E-mail" type="email"/>
      <input v-model="password" placeholder="Wachtwoord" type="password" />
      <button @click="login" class="--loginBtn">Login</button>
      <p v-if="error">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import MobileNavbar from '../components/MobileNavbar.vue';
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
