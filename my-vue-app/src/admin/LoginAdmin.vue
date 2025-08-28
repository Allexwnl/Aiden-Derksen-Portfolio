<template>
  <div>
    <input v-model="email" placeholder="E-mail" type="email" />
    <input v-model="password" placeholder="Wachtwoord" type="password" />
    <button @click="login">Login</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { supabase } from '../supabase/supabase.js'

const allowedEmails = [
  "alexanderzoet@gmail.com"
]

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      if (!allowedEmails.includes(this.email)) {
        this.error = "Deze e-mail mag niet inloggen";
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });

      if (error) {
        this.error = error.message;
      } else {
        this.$router.push('/dashboard');
      }
    }
  }
}
</script>
