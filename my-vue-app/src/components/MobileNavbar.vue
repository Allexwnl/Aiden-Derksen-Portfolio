<template>
    <nav class="mobile-nav">
        <div class="nav-header">
            <h3 class="nav-logo">Aiden Derksen</h3>
            <button class="hamburger" @click="toggleMenu">
                <span :class="{ 'open': isMenuOpen }"></span>
                <span :class="{ 'open': isMenuOpen }"></span>
                <span :class="{ 'open': isMenuOpen }"></span>
            </button>
        </div>

        <transition name="slide-fade">
            <ul v-if="isMenuOpen" class="nav-menu">
                <li><a href="#projects" @click="closeMenu">Projecten</a></li>
                <li><a href="#contact" @click="closeMenu">Contact</a></li>
            </ul>
        </transition>
    </nav>
</template>
<script>
export default {
    name: 'NavBar',
    data() {
        return {
            isMenuOpen: false,
        }
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
        },
        closeMenu() {
            this.isMenuOpen = false
        },
    },
}
</script>