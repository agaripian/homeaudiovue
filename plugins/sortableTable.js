import Vue from 'vue'
import Sortable from 'sortablejs'

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

    Sortable.create(sortableElement, options)
  }
})
