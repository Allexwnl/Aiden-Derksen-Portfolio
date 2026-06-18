<template>
  <NavBar />
  <MobileNavbar />
  <section class="login">
    <div class="--containerLogin">
      <h1>Admin Login</h1>
      <input v-model="email" placeholder="E-mail" type="email" />
      <input v-model="password" placeholder="Wachtwoord" type="password" />
      <button @click="login" class="--loginBtn" :disabled="loading">
        {{ loading ? 'Bezig...' : 'Login' }}
      </button>
      <p v-if="error">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
import MobileNavbar from '../components/MobileNavbar.vue';
import { auth } from '../firebase/firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()

const allowedEmails = [
  'alexanderzoet@gmail.com',
  'aidenderksen2007@gmail.com',
]

const login = async () => {
  error.value = ''
  if (!allowedEmails.includes(email.value)) {
    error.value = 'Deze e-mail mag niet inloggen'
    return
  }

  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.code === 'auth/invalid-credential'
      ? 'Onjuiste inloggegevens'
      : (e.message || 'Inloggen mislukt')
  } finally {
    loading.value = false
  }
}
</script>
