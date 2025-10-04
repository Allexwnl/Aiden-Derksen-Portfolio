<template>
  <nav class="navbar">
    <div class="nav-header">
      <h3 class="nav-logo">Aiden Derksen</h3>
    </div>
    
    <ul :class="['nav-links', { 'nav-active': isMenuOpen }]">
      <li><a href="/#about">About Me</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <button class="nav-toggle" @click="toggleMenu">
      ☰
    </button>
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
  },
}
</script>

<style scoped>
/* --- Algemene styling --- */
.navbar {
  background-color: transparent;
  overflow: hidden;
  border-bottom: 3px solid #c300ff;
  box-shadow: 0 4px 20px #00000033;
  background-color: #ffffff1a;
  backdrop-filter: blur(10px);
}

/* --- Header met logo + hamburger --- */
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 20px;
  margin: 0;
}

/* --- Hamburger knop --- */
.nav-toggle {
  background: none;
  border: none;
  color: black;
  font-size: 26px;
  cursor: pointer;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin-top: 10px;
  display: none;
  flex-direction: column;
  text-align: center;
}

.nav-links li {
  margin: 10px 0;
}

.nav-links a {
  color: black;
  text-decoration: none;
  font-size: 18px;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #c300ff;
}

/* --- Actieve menu (open op mobiel) --- */
.nav-active {
  display: flex;
}

/* --- Desktop layout --- */
@media (min-width: 768px) {
  .nav-toggle {
    display: none;
    /* hamburger verbergen */
  }

  .nav-links {
    display: flex !important;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 0;
  }

  .nav-links li {
    margin: 0 15px;
  }
}
</style>
