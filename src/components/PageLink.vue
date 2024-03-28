<template>
  <div class="link">
    <slot name="thumbnail"></slot>
    <slot name="link"></slot> &mdash;
    <div class="description">
      <slot name="description"></slot>
    </div>
  </div>
</template>

<style scoped>
.link {
  background-color: var(--color-background);
  padding: 10px;
  margin: 10px 0;
  width: 50%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.description {
  max-width: 50%;
}

@media screen and (max-width: 500px) {
  .link {
    /** Match the size of the image */
    width: 250px;
  }
}
</style>
