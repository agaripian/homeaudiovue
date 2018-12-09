import Vue from 'vue'
import Sortable from 'sortablejs'

let sortable
Vue.directive('sortableTable', {
  bind(el, binding, vnode) {
    let sortableElement = el.getElementsByTagName('tbody')[0]
    const options = {
      handle: '.sortHandle',
      animation: 150,
      onUpdate: function(event) {
        vnode.child.$emit('sorted', event)
      }
    }

    sortable = Sortable.create(sortableElement, options)
  }
})
