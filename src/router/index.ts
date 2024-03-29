import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexView
    },
    {
      path: '/curve_symmetry',
      component: () => import('@/views/CurveGalleryView.vue')
    },
    {
      path: '/curve_symmetry/curve_maker',
      component: () => import('@/views/CurveMakerView.vue')
    },
    {
      path: '/curve_symmetry/orbital_motion',
      component: () => import('@/views/OrbitalMotionView.vue')
    },
    {
      path: '/point_symmetry',
      component: () => import('@/views/PolynomialGalleryView.vue'),
      props: {
        symmetryMode: 'rosette'
      }
    },
    {
      path: '/point_symmetry/tie_dye_analogy',
      component: () => import('@/views/TieDyeAnalogyView.vue')
    },
    {
      path: '/point_symmetry/rosette_maker',
      component: () => import('@/views/PolynomialMakerView.vue'),
      props: {
        symmetryMode: 'rosette'
      }
    },
    {
      path: '/frieze_symmetry',
      component: () => import('@/views/PolynomialGalleryView.vue'),
      props: {
        symmetryMode: 'frieze'
      }
    },
    {
      path: '/frieze_symmetry/frieze_maker',
      component: () => import('@/views/PolynomialMakerView.vue'),
      props: {
        symmetryMode: 'frieze'
      }
    },
    {
      path: '/wallpaper_symmetry',
      component: () => import('@/views/WallpaperGalleryView.vue')
    },
    {
      path: '/wallpaper_symmetry/wallpaper_maker',
      component: () => import('@/views/WallpaperMakerView.vue')
    }
  ]
})

export default router
