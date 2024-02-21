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
.horizontal {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.column {
  width: 40%;
  margin: 0 auto;
}
</style>
