import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import CurveViewerView from '@/views/CurveViewerView.vue'
import CurveMakerView from '@/views/CurveMakerView.vue'
import PointSymmetryView from '@/views/PointSymmetryView.vue'
import PolynomialMakerView from '@/views/PolynomialMakerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: IndexView
    },
    {
      path: '/curve_symmetry',
      name: 'Curve Symmetry',
      component: CurveViewerView
    },
    {
      path: '/curve_symmetry/curve_maker',
      name: 'Curve Maker',
      component: CurveMakerView
    },
    {
      path: '/point_symmetry',
      name: 'Point Symmetry',
      component: PointSymmetryView
    },
    {
      path: '/point_symmetry/rosette_maker',
      name: 'Rosette Maker',
      component: PolynomialMakerView,
      props: {
        symmetry_mode: 'rosette'
      }
    },
    {
      path: '/frieze_symmetry/frieze_maker',
      name: 'Frieze Symmetry Maker',
      component: PolynomialMakerView,
      props: {
        symmetry_mode: 'frieze'
      }
    }
  ]
})

export default router
