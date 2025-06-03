import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["item", "trigger", "content", "icon"]
  static values = { multiple: Boolean }

  connect() {
    console.log('🪗 BUI Accordion Controller connected')
    console.log('🔧 Multiple mode:', this.multipleValue)
    
    // Inizializza stati ARIA
    this.initializeAriaStates()
    
    // Imposta gli stati iniziali dei contenuti
    this.initializeContentStates()
  }

  // Metodo principale per toggle di un item (referenziato nei componenti Ruby)
  toggle(event) {
    event.preventDefault()
    
    const trigger = event.currentTarget
    const item = trigger.closest('[data-bui-accordion-target="item"]')
    
    if (!item) {
      console.warn('⚠️ No accordion item found for trigger')
      return
    }
    
    // Controlla se l'item è disabilitato
    if (trigger.disabled) {
      console.log('🚫 Accordion item is disabled')
      return
    }
    
    const content = item.querySelector('[data-bui-accordion-target="content"]')
    const icon = item.querySelector('[data-bui-accordion-target="icon"]')
    
    if (!content) {
      console.warn('⚠️ No content found for accordion item')
      return
    }
    
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true'
    
    console.log('🎯 Toggle accordion item, currently expanded:', isExpanded)
    
    if (isExpanded) {
      this.collapseItem(trigger, content, icon)
    } else {
      this.expandItem(trigger, content, icon)
      
      // Se non è multiple, chiudi tutti gli altri item
      if (!this.multipleValue) {
        this.collapseOtherItems(item)
      }
    }
  }

  // Gestione eventi tastiera per navigazione
  keydown(event) {
    const trigger = event.currentTarget
    const currentIndex = this.triggerTargets.indexOf(trigger)
    
    switch(event.key) {
      case "ArrowDown":
        event.preventDefault()
        this.navigateDown(currentIndex)
        break
        
      case "ArrowUp":
        event.preventDefault()
        this.navigateUp(currentIndex)
        break
        
      case "Home":
        event.preventDefault()
        this.navigateToFirst()
        break
        
      case "End":
        event.preventDefault()
        this.navigateToLast()
        break
        
      case "Enter":
      case " ": // Space
        event.preventDefault()
        this.toggle(event)
        break
    }
  }

  // Espande un item specifico
  expandItem(trigger, content, icon) {
    console.log('📖 Expanding accordion item')
    
    // Aggiorna ARIA
    trigger.setAttribute('aria-expanded', 'true')
    
    // Mostra il contenuto con animazione
    content.classList.remove('hidden')
    content.classList.add('block')
    
    // Ruota l'icona se presente
    if (icon) {
      icon.classList.add('rotate-180')
    }
    
    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('bui-accordion:expanded', {
      detail: { trigger, content },
      bubbles: true
    }))
  }

  // Collassa un item specifico
  collapseItem(trigger, content, icon) {
    console.log('📕 Collapsing accordion item')
    
    // Aggiorna ARIA
    trigger.setAttribute('aria-expanded', 'false')
    
    // Nasconde il contenuto
    content.classList.remove('block')
    content.classList.add('hidden')
    
    // Ripristina l'icona se presente
    if (icon) {
      icon.classList.remove('rotate-180')
    }
    
    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('bui-accordion:collapsed', {
      detail: { trigger, content },
      bubbles: true
    }))
  }

  // Collassa tutti gli altri item (per modalità single)
  collapseOtherItems(currentItem) {
    console.log('🔄 Collapsing other items (single mode)')
    
    this.itemTargets.forEach(item => {
      if (item === currentItem) return
      
      const trigger = item.querySelector('[data-bui-accordion-target="trigger"]')
      const content = item.querySelector('[data-bui-accordion-target="content"]')
      const icon = item.querySelector('[data-bui-accordion-target="icon"]')
      
      if (trigger && trigger.getAttribute('aria-expanded') === 'true') {
        this.collapseItem(trigger, content, icon)
      }
    })
  }

  // Naviga al trigger successivo (con wrap-around)
  navigateDown(currentIndex) {
    const newIndex = (currentIndex + 1) % this.triggerTargets.length
    this.focusTrigger(newIndex)
  }

  // Naviga al trigger precedente (con wrap-around)
  navigateUp(currentIndex) {
    const newIndex = currentIndex <= 0 
      ? this.triggerTargets.length - 1 
      : currentIndex - 1
    this.focusTrigger(newIndex)
  }

  // Naviga al primo trigger
  navigateToFirst() {
    this.focusTrigger(0)
  }

  // Naviga all'ultimo trigger
  navigateToLast() {
    this.focusTrigger(this.triggerTargets.length - 1)
  }

  // Focus su un trigger specifico
  focusTrigger(index) {
    if (index >= 0 && index < this.triggerTargets.length) {
      const trigger = this.triggerTargets[index]
      if (!trigger.disabled) {
        trigger.focus()
      }
    }
  }

  // Inizializza gli stati ARIA
  initializeAriaStates() {
    console.log('🎭 Initializing ARIA states')
    
    this.triggerTargets.forEach(trigger => {
      // Se non ha già un valore aria-expanded, imposta a false
      if (!trigger.hasAttribute('aria-expanded')) {
        trigger.setAttribute('aria-expanded', 'false')
      }
      
      // Imposta tabindex per navigazione keyboard
      trigger.setAttribute('tabindex', '0')
    })
  }

  // Inizializza gli stati dei contenuti basandosi su aria-expanded
  initializeContentStates() {
    console.log('📋 Initializing content states')
    
    this.triggerTargets.forEach(trigger => {
      const item = trigger.closest('[data-bui-accordion-target="item"]')
      if (!item) return
      
      const content = item.querySelector('[data-bui-accordion-target="content"]')
      const icon = item.querySelector('[data-bui-accordion-target="icon"]')
      
      if (!content) return
      
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true'
      
      if (isExpanded) {
        content.classList.remove('hidden')
        content.classList.add('block')
        if (icon) icon.classList.add('rotate-180')
      } else {
        content.classList.remove('block')
        content.classList.add('hidden')
        if (icon) icon.classList.remove('rotate-180')
      }
      
      console.log(`🎯 Item initialized - expanded: ${isExpanded}`)
    })
  }

  // Metodi pubblici per controllo programmatico

  // Espande tutti gli item (solo se multiple = true)
  expandAll() {
    if (!this.multipleValue) {
      console.warn('⚠️ expandAll() not available in single mode')
      return
    }
    
    console.log('📖 Expanding all items')
    
    this.triggerTargets.forEach(trigger => {
      const item = trigger.closest('[data-bui-accordion-target="item"]')
      if (!item || trigger.disabled) return
      
      const content = item.querySelector('[data-bui-accordion-target="content"]')
      const icon = item.querySelector('[data-bui-accordion-target="icon"]')
      
      if (content && trigger.getAttribute('aria-expanded') !== 'true') {
        this.expandItem(trigger, content, icon)
      }
    })
  }

  // Collassa tutti gli item
  collapseAll() {
    console.log('📕 Collapsing all items')
    
    this.triggerTargets.forEach(trigger => {
      const item = trigger.closest('[data-bui-accordion-target="item"]')
      if (!item) return
      
      const content = item.querySelector('[data-bui-accordion-target="content"]')
      const icon = item.querySelector('[data-bui-accordion-target="icon"]')
      
      if (content && trigger.getAttribute('aria-expanded') === 'true') {
        this.collapseItem(trigger, content, icon)
      }
    })
  }

  // Getter per stato accordion
  get expandedItems() {
    return this.triggerTargets.filter(trigger => 
      trigger.getAttribute('aria-expanded') === 'true'
    )
  }

  get collapsedItems() {
    return this.triggerTargets.filter(trigger => 
      trigger.getAttribute('aria-expanded') !== 'true'
    )
  }
}
