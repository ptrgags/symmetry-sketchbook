<script setup lang="ts">
import { inject, type Ref } from 'vue'

const props = defineProps<{
  title: string
}>()

const selected_title = inject<Ref<string>>('selected_title')
</script>

<template>
  <div class="content vertical" v-show="props.title === selected_title">
    <slot></slot>
  </div>
</template>
