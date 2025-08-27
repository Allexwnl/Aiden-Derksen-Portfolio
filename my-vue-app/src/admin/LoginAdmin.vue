<template>
    <main>
        <NavBar />
        <section class="login-container">
            <h1>Admin Login</h1>
            <form class="login-form">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
        </section>
    </main>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import '../css/navbar.css';

</script>