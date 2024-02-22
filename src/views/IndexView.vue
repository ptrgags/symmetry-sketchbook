<script setup lang="ts">
import PageLink from '@/components/PageLink.vue'
</script>

<template>
  <div class="one-column vertical">
    <h2>Symmetry Sketchbook</h2>
    <p>
      This repo has a few experiments based on the book <i>Creating Symmetry</i> by Frank A. Farris
      and implemented in p5.js
    </p>
    <h3>Parametric Curve Symmetry</h3>
    <PageLink><RouterLink to="/curve_symmetry">Curve Viewer</RouterLink></PageLink>
    <!--<PageLink><RouterLink to="/curve_symmetry/orbital_motion">Orbital Motion</RouterLink></PageLink>
      <PageLink><RouterLink to="/curve_symmetry/curve_blender">Curve Blender</RouterLink></PageLink> -->
    <PageLink><RouterLink to="/curve_symmetry/curve_maker">Curve Maker</RouterLink></PageLink>
    <!--<h3>Point Symmetry</h3>
    <PageLink><RouterLink to="/point_symmetry/rosette_viewer">Rosette Viewer</RouterLink></PageLink>
    <PageLink
      ><RouterLink to="/point_symmetry/tie_dye_analogy">Tie-Dye Analogy</RouterLink></PageLink
    >
    <PageLink
      ><RouterLink to="/point_symmetry/rosette_blender">Rosette Blender</RouterLink></PageLink
    >
    <PageLink><RouterLink to="/point_symmetry/rosette_maker">Rosette Maker</RouterLink></PageLink>
    <h3>Frieze Symmetry</h3>
    <PageLink><RouterLink to="/frieze_symmetry/frieze_viewer">Frieze Viewer</RouterLink></PageLink>
    <PageLink
      ><RouterLink to="/frieze_symmetry/frieze_blender">Frieze Blender</RouterLink></PageLink
    >
    <PageLink><RouterLink to="/frieze_symmetry/frieze_maker">Frieze Maker</RouterLink></PageLink>
    <h3>Wallpaper Symmetry</h3>
    <PageLink
      ><RouterLink to="/wallpaper_symmetry/wallpaper_viewer">Wallpaper Viewer</RouterLink></PageLink
    >
    <PageLink
      ><RouterLink to="/wallpaper_symmetry/wallpaper_blender"
        >Wallpaper Blender</RouterLink
      ></PageLink
    >
    <PageLink
      ><RouterLink to="/wallpaper_symmetry/wallpaper_maker">Wallpaper Maker</RouterLink></PageLink
    >
    -->
  </div>
</template>
