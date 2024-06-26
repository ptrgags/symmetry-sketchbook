<script setup lang="ts">
import PageLink from '@/components/PageLink.vue'
</script>

<template>
  <div class="one-column vertical">
    <h1>Symmetry Sketchbook</h1>
    <p>
      This repo has a few artistic math experiments based on the book
      <cite>
        <a href="https://www.google.com/books/edition/Creating_Symmetry/blGUBgAAQBAJ?hl=en&gbpv=0"
          >Creating Symmetry</a
        >
      </cite>
      by Frank A. Farris and implemented in p5.js
    </p>
    <h3>Parametric Curve Symmetry</h3>
    <p class="expand">Symmetric paths based on chapters 1-5 of the book.</p>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/curve-gallery.png"
          alt="symmetric curve example from the gallery page"
        />
      </template>
      <template #link>
        <RouterLink to="/curve_symmetry">Curve Symmetry Gallery</RouterLink>
      </template>
      <template #description>A showcase of the symmetric curves I've made.</template>
    </PageLink>
    <PageLink>
      <template #thumbnail>
        <img src="@/assets/thumbnails/orbital-motion.png" alt="preview of orbital motion" />
      </template>
      <template #link>
        <RouterLink to="/curve_symmetry/orbital_motion">Orbital Motion</RouterLink>
      </template>
      <template #description>
        As a fun bonus, I realized that the code for these curves can be re-used to make a
        (simplified) model of a solar system
      </template>
    </PageLink>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/curve-maker.png"
          alt="Example curve made with the curve maker"
        />
      </template>
      <template #link>
        <RouterLink to="/curve_symmetry/curve_maker">Curve Maker</RouterLink>
      </template>
      <template #description>
        (Advanced) This is a visual editor I made for myself to make designing patterns easier.
      </template>
    </PageLink>

    <h3>Point Symmetry</h3>
    <p class="expand">
      Patterns that are symmetric about a center point. Based on chapters 6-7 of the book.
    </p>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/rosette-gallery.png"
          alt="Rosette pattern example from the gallery"
        />
      </template>
      <template #link><RouterLink to="/point_symmetry">Rosette Gallery</RouterLink></template>
      <template #description>A showcase of the rosette patterns I've made.</template>
    </PageLink>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/tie-dye-analogy.png"
          alt="screenshot from tie-dye analogy animation"
        />
      </template>
      <template #link>
        <RouterLink to="/point_symmetry/tie_dye_analogy">Tie-Dye Analogy</RouterLink>
      </template>
      <template #description>
        It can be a bit tricky to understand how these patterns are produced with math. I made an
        animation to explain it by analogy with tie-dying a t-shirt.
      </template>
    </PageLink>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/rosette-maker.png"
          alt="Example rosette pattern made with the rosette maker page"
        />
      </template>
      <template #link>
        <RouterLink to="/point_symmetry/rosette_maker">Rosette Maker</RouterLink>
      </template>
      <template #description>
        (Advanced) This is a visual editor I made for myself to make designing patterns easier.
      </template>
    </PageLink>

    <h3>Frieze Symmetry</h3>
    <p class="expand">Patterns that repeat in one direction. Based on chapter 8 of the book.</p>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/frieze-gallery.png"
          alt="Frieze pattern example from the gallery"
        />
      </template>
      <template #link>
        <RouterLink to="/frieze_symmetry">Frieze Gallery</RouterLink>
      </template>
      <template #description>A showcase of the frieze patterns I've made.</template>
    </PageLink>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/frieze-maker.png"
          alt="Example wallpaper pattern made with the frieze maker page"
        />
      </template>
      <template #link>
        <RouterLink to="/frieze_symmetry/frieze_maker">Frieze Maker</RouterLink>
      </template>
      <template #description>
        (Advanced) This is a visual editor I made for myself to make designing patterns easier.
      </template>
    </PageLink>

    <h3>Wallpaper Symmetry</h3>
    <p class="expand">
      Patterns that repeat in one direction. Based on chapters 9-19 as well as appendices B and C.
    </p>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/wallpaper-gallery.png"
          alt="Wallpaper pattern example from the gallery"
        />
      </template>
      <template #link>
        <RouterLink to="/wallpaper_symmetry">Wallpaper Gallery</RouterLink>
      </template>
      <template #description>A showcase of the wallpaper patterns I've made.</template>
    </PageLink>
    <PageLink>
      <template #thumbnail>
        <img
          src="@/assets/thumbnails/wallpaper-maker.png"
          alt="Example wallpaper pattern made with the wallpaper maker page"
        />
      </template>
      <template #link>
        <RouterLink to="/wallpaper_symmetry/wallpaper_maker">Wallpaper Maker</RouterLink>
      </template>
      <template #description>
        (Advanced) This is a visual editor I made for myself to make designing patterns easier.
      </template>
    </PageLink>
  </div>
</template>

<style scoped>
img {
  width: 250px;
  height: 350px;
}

.expand {
  width: 50%;
}
</style>
