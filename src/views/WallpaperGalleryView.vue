<script setup lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import P5Sketch from '@/components/P5Sketch.vue'
import ReferenceGeometryEditor from '@/components/ReferenceGeometryEditor.vue'
import TwoColumns from '@/components/TwoColumns.vue'
import { FourierSeries2D } from '@/core/FourierSeries2D'
import { default_ref_geom, type ReferenceGeometryCollection } from '@/core/ReferenceGeometry'
import { get_string_param } from '@/core/query_util'
import { WallpaperPaletteSerializer } from '@/core/serialization/SerializedWallpaperPalette'
import { WallpaperPatternSerializer } from '@/core/serialization/SerializedWallpaperPattern'
import { from_compressed_json } from '@/core/serialization/serialization'
import { DEFAULT_PALETTE, type WallpaperPalette } from '@/core/wallpaper_symmetry/WallpaperPalette'
import { WALLPAPER_GROUPS } from '@/core/wallpaper_symmetry/WallpaperSymmetryGroup'
import { WALLPAPER_PALETTES } from '@/presets/wallpaper_palettes'
import { WALLPAPER_PATTERNS } from '@/presets/wallpapers'
import { WallpaperSketch, type WallpaperPattern } from '@/sketches/WallpaperSketch'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const DEFAULT_PATTERN = {
  series: FourierSeries2D.from_tuples([
    [1, 0, 1, 0],
    [0, 1, 1, 0]
  ]),
  group: WALLPAPER_GROUPS.p2
}

const sketch = new WallpaperSketch({
  pattern: DEFAULT_PATTERN,
  palette: DEFAULT_PALETTE
})

const PATTERN_SERIALIZER = new WallpaperPatternSerializer()
const PALETTE_SERIALIZER = new WallpaperPaletteSerializer()

const selected_pattern = defineModel<WallpaperPattern>('selected_pattern')
const selected_palette = defineModel<WallpaperPalette>('selected_palette')

const ref_geom = defineModel<ReferenceGeometryCollection>('ref_geom', { default: default_ref_geom })

async function handle_pattern(preset_id: string | undefined, custom_pattern: string | undefined) {
  if (custom_pattern) {
    const pattern = await from_compressed_json(custom_pattern, PATTERN_SERIALIZER)
    if (pattern) {
      selected_pattern.value = undefined
      sketch.pattern = pattern
      return
    }
  }

  if (preset_id) {
    const preset = WALLPAPER_PATTERNS.find((x) => x.id === preset_id)
    if (preset) {
      selected_pattern.value = preset.value
      sketch.pattern = preset.value
      return
    }
  }

  selected_pattern.value = WALLPAPER_PATTERNS[0].value
  sketch.pattern = selected_pattern.value
}

async function handle_palette(preset_id: string | undefined, custom_palette: string | undefined) {
  if (custom_palette) {
    const palette = await from_compressed_json(custom_palette, PALETTE_SERIALIZER)
    if (palette) {
      selected_palette.value = undefined
      sketch.palette = palette
      return
    }
  }

  if (preset_id) {
    const preset = WALLPAPER_PALETTES.find((x) => x.id == preset_id)
    if (preset) {
      selected_palette.value = preset.value
      sketch.palette = preset.value
    }
  }

  selected_palette.value = WALLPAPER_PALETTES[0].value
  sketch.palette = selected_palette.value
}

async function handle_query() {
  const query = route.query

  handle_palette(
    get_string_param(query.palette, 'palette'),
    get_string_param(query.custom_palette, 'custom_palette')
  )

  handle_pattern(
    get_string_param(query.pattern, 'pattern'),
    get_string_param(query.custom_pattern, 'custom_pattern')
  )
}

onMounted(() => {
  handle_query().catch(console.error)
})

watch(
  ref_geom,
  (value) => {
    sketch.ref_geom = value
  },
  { deep: true }
)

watch(selected_pattern, (value) => {
  if (!value) {
    return
  }

  sketch.pattern = value
})

watch(selected_palette, (value) => {
  if (!value) {
    return
  }

  sketch.palette = value
})
</script>

<template>
  <TwoColumns>
    <template #left>
      <P5Sketch :sketch="sketch" :is_card="true"></P5Sketch>
    </template>
    <template #right>
      <h1>Wallpaper Gallery</h1>
      <div class="form-row">
        <DropdownSelect :options="WALLPAPER_PATTERNS" v-model="selected_pattern"
          >Pattern:
        </DropdownSelect>
      </div>
      <div class="form-row">
        <DropdownSelect :options="WALLPAPER_PALETTES" v-model="selected_palette"
          >Palette:
        </DropdownSelect>
      </div>
      <p>
        Select a pattern and color palette preset from the lists above to view one of my designs.
        The two lists are the same length, and corresponding options (e.g. the third element of each
        list) are my original designs. However, you can mix and match to get new designs!
      </p>
      <details class="form-row">
        <summary>Reference Geometry</summary>
        <ReferenceGeometryEditor v-model="ref_geom"></ReferenceGeometryEditor>
      </details>
    </template>
  </TwoColumns>
</template>
