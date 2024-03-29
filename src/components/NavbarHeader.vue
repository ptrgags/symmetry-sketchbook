import { RouterLink } from 'vue-router';
<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      |
      <a href="https://github.com/ptrgags/symmetry-sketchbook">GitHub</a>
    </nav>
  </header>
</template>

<style scoped>
nav {
  background-color: var(--color-background-light);
  padding: 10px;
}
</style>
