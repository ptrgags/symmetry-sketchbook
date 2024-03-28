<!--
    Tab Layout based on https://youtu.be/ROGeJxI2L58?si=qLog_JcRzp-1UIyG
    but done with the composition API
-->
<script setup lang="ts">
import { ref, onMounted, useSlots, provide } from 'vue'

const tab_titles = ref<string[]>([])
const selected_title = ref<string>('')
provide('selected_title', selected_title)
const slots = useSlots()

if (slots.default) {
  tab_titles.value = slots.default().map((tab) => tab.props?.title ?? '[Untitled]')
  selected_title.value = tab_titles.value[0]
}

function get_tab_class(title: string): string[] {
  if (title === selected_title.value) {
    return ['tab', 'selected']
  }

  return ['tab']
}

function select_tab(title: string) {
  selected_title.value = title
}
</script>

<template>
  <div class="headings horizontal">
    <div
      v-for="title in tab_titles"
      :key="title"
      :class="get_tab_class(title)"
      @click="select_tab(title)"
    >
      {{ title }}
    </div>
  </div>
  <div class="tab-body">
    <slot></slot>
  </div>
</template>

<style>
.headings {
  width: 100%;
}

.tab-body {
  padding: 10px;
}

.tab {
  background-color: var(--color-background-dark);
  padding: 10px;
  border-bottom: 2px solid var(--color-accent2);
}

.selected {
  background-color: var(--color-accent2);
  border-bottom-color: var(--color-accent);
}
</style>
