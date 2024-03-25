<template>
  <div class="horizontal">
    <div class="column">
      <slot name="left"></slot>
    </div>
    <div class="column">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style>
.column {
  width: 40%;
  margin: 0 auto;
}

@media screen and (max-width: 1000px) {
  .column {
    width: 100%;
  }
}
</style>
