import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["trigger", "menu", "item"]
  static values = { open: Boolean, currentIndex: Number }
  
  // Classi CSS per il focus management (Tailwind)
  static focusClasses = "bg-gray-100 text-gray-900"

  connect() {
    // Inizializza il dropdown in stato chiuso
    this.close()
    // Inizializza l'indice di navigazione
    this.currentIndexValue = -1
    // Bind del metodo clickOutside per poter rimuovere l'event listener
    this.boundClickOutside = this.clickOutside.bind(this)
  }

  disconnect() {
    // Cleanup: rimuove l'event listener quando il controller viene disconnesso
    document.removeEventListener("click", this.boundClickOutside)
  }

  // Azione principale: toggle del menu dropdown
  toggle() {
    this.openValue ? this.close() : this.open()
  }

  // Apre il menu dropdown
  open() {
    this.openValue = true
    this.menuTarget.style.display = "block"
    this.triggerTarget.setAttribute("aria-expanded", "true")
    
    // Aggiunge listener per click esterno
    document.addEventListener("click", this.boundClickOutside)
  }

  // Chiude il menu dropdown
  close() {
    this.openValue = false
    this.menuTarget.style.display = "none"
    this.triggerTarget.setAttribute("aria-expanded", "false")
    
    // Reset del focus e indice di navigazione
    this.clearAllFocus()
    this.currentIndexValue = -1
    
    // Rimuove listener per click esterno
    document.removeEventListener("click", this.boundClickOutside)
  }

  // Gestisce click esterno per chiudere il dropdown
  clickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  // Azione per chiudere il dropdown quando viene cliccato un item
  itemClick() {
    this.close()
  }

  // Gestione eventi tastiera
  keydown(event) {
    switch(event.key) {
      case "ArrowDown":
        event.preventDefault()
        if (!this.openValue) {
          this.open()
          this.focusFirstItem()
        } else {
          this.navigateDown()
        }
        break
        
      case "ArrowUp":
        event.preventDefault()
        if (this.openValue) {
          this.navigateUp()
        }
        break
        
      case "Enter":
      case " ": // Space
        event.preventDefault()
        if (this.openValue && this.currentIndexValue >= 0) {
          this.selectCurrentItem()
        } else if (!this.openValue) {
          this.toggle()
        }
        break
        
      case "Escape":
        event.preventDefault()
        if (this.openValue) {
          this.close()
          this.triggerTarget.focus()
        }
        break
        
      case "Tab":
        if (this.openValue) {
          this.close()
        }
        break
    }
  }

  // Naviga al prossimo item (con wrap-around)
  navigateDown() {
    const items = this.getNavigableItems()
    if (items.length === 0) return
    
    this.currentIndexValue = (this.currentIndexValue + 1) % items.length
    this.updateFocus()
  }

  // Naviga al precedente item (con wrap-around)
  navigateUp() {
    const items = this.getNavigableItems()
    if (items.length === 0) return
    
    this.currentIndexValue = this.currentIndexValue <= 0 
      ? items.length - 1 
      : this.currentIndexValue - 1
    this.updateFocus()
  }

  // Seleziona l'item corrente (simula click)
  selectCurrentItem() {
    const items = this.getNavigableItems()
    if (this.currentIndexValue >= 0 && this.currentIndexValue < items.length) {
      const currentItem = items[this.currentIndexValue]
      currentItem.click()
    }
  }

  // Focus sul primo item disponibile
  focusFirstItem() {
    const items = this.getNavigableItems()
    if (items.length > 0) {
      this.currentIndexValue = 0
      this.updateFocus()
    }
  }

  // Aggiorna il focus visivo
  updateFocus() {
    this.clearAllFocus()
    const items = this.getNavigableItems()
    
    if (this.currentIndexValue >= 0 && this.currentIndexValue < items.length) {
      const currentItem = items[this.currentIndexValue]
      const focusClasses = this.constructor.focusClasses.split(' ')
      currentItem.classList.add(...focusClasses)
    }
  }

  // Rimuove il focus da tutti gli item
  clearAllFocus() {
    const focusClasses = this.constructor.focusClasses.split(' ')
    this.itemTargets.forEach(item => {
      item.classList.remove(...focusClasses)
    })
  }

  // Restituisce solo gli item navigabili (non disabled)
  getNavigableItems() {
    return this.itemTargets.filter(item => {
      return !item.hasAttribute('aria-disabled') || 
             item.getAttribute('aria-disabled') !== 'true'
    })
  }
}
