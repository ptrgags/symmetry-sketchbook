import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import CurveViewerView from '@/views/CurveViewerView.vue'
import CurveMakerView from '@/views/CurveMakerView.vue'
import OrbitalMotionView from '@/views/OrbitalMotionView.vue'
import PolynomialGalleryView from '@/views/PolynomialGalleryView.vue'
import PolynomialMakerView from '@/views/PolynomialMakerView.vue'
import TieDyeAnalogyView from '@/views/TieDyeAnalogyView.vue'
import WallpaperGalleryView from '@/views/WallpaperSymmetryView.vue'
import WallpaperMakerView from '@/views/WallpaperMakerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexView
    },
    {
      path: '/curve_symmetry',
      component: CurveViewerView
    },
    {
      path: '/curve_symmetry/curve_maker',
      component: CurveMakerView
    },
    {
      path: '/curve_symmetry/orbital_motion',
      component: OrbitalMotionView
    },
    {
      path: '/point_symmetry',
      component: PolynomialGalleryView,
      props: {
        symmetryMode: 'rosette'
      }
    },
    {
      path: '/point_symmetry/tie_dye_analogy',
      component: TieDyeAnalogyView
    },
    {
      path: '/point_symmetry/rosette_maker',
      component: PolynomialMakerView,
      props: {
        symmetryMode: 'rosette'
      }
    },
    {
      path: '/frieze_symmetry',
      component: PolynomialGalleryView,
      props: {
        symmetryMode: 'frieze'
      }
    },
    {
      path: '/frieze_symmetry/frieze_maker',
      component: PolynomialMakerView,
      props: {
        symmetryMode: 'frieze'
      }
    },
    {
      path: '/wallpaper_symmetry',
      component: WallpaperGalleryView
    },
    {
      path: '/wallpaper_symmetry/wallpaper_maker',
      component: WallpaperMakerView
    }
  ]
})

export default router
