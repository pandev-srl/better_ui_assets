import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["container", "section", "sectionTrigger", "sectionContent", "resizeHandle", "overlay"]
  static values = { 
    width: Number,
    minWidth: { type: Number, default: 200 },
    maxWidth: { type: Number, default: 400 },
    collapsed: Boolean,
    pinned: { type: Boolean, default: true },
    mobile: Boolean
  }

  connect() {
    console.log('🎛️ Sidebar controller connected')
    
    // Inizializza stato mobile
    this.checkMobileState()
    
    // Bind metodi per event listeners
    this.boundHandleResize = this.handleWindowResize.bind(this)
    this.boundHandleClickOutside = this.handleClickOutside.bind(this)
    
    // Event listeners globali
    window.addEventListener('resize', this.boundHandleResize)
    
    // Setup resize handle se presente
    if (this.hasResizeHandleTarget) {
      this.setupResizeHandle()
    }
    
    // Inizializza sezioni collapsible
    this.initializeCollapsibleSections()
    
    // Applica stato iniziale
    this.applyInitialState()
  }

  disconnect() {
    console.log('🎛️ Sidebar controller disconnected')
    window.removeEventListener('resize', this.boundHandleResize)
    document.removeEventListener('click', this.boundHandleClickOutside)
  }

  // ========================================
  // COLLAPSIBLE SECTIONS
  // ========================================
  
  // Toggle sezione collapsible
  toggleSection(event) {
    const trigger = event.currentTarget
    const sectionId = trigger.dataset.buiSidebarSectionId
    const content = this.sectionContentTargets.find(el => 
      el.dataset.buiSidebarSectionId === sectionId
    )
    
    if (!content) return
    
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true'
    
    if (isExpanded) {
      this.collapseSection(trigger, content)
    } else {
      this.expandSection(trigger, content)
    }
  }
  
  // Espandi sezione
  expandSection(trigger, content) {
    trigger.setAttribute('aria-expanded', 'true')
    content.classList.remove('hidden')
    
    // Ruota l'icona chevron
    const chevron = trigger.querySelector('[data-bui-sidebar-chevron]')
    if (chevron) {
      chevron.classList.add('rotate-90')
    }
    
    console.log('📂 Section expanded:', trigger.dataset.buiSidebarSectionId)
  }
  
  // Comprimi sezione
  collapseSection(trigger, content) {
    trigger.setAttribute('aria-expanded', 'false')
    content.classList.add('hidden')
    
    // Ruota l'icona chevron
    const chevron = trigger.querySelector('[data-bui-sidebar-chevron]')
    if (chevron) {
      chevron.classList.remove('rotate-90')
    }
    
    console.log('📁 Section collapsed:', trigger.dataset.buiSidebarSectionId)
  }

  // ========================================
  // RESIZABLE WIDTH
  // ========================================
  
  // Setup drag handle per resize
  setupResizeHandle() {
    this.resizeHandleTarget.addEventListener('mousedown', this.startResize.bind(this))
    this.resizeHandleTarget.addEventListener('touchstart', this.startResize.bind(this), { passive: false })
  }
  
  // Inizia resize
  startResize(event) {
    event.preventDefault()
    
    this.isResizing = true
    this.startX = event.clientX || event.touches[0].clientX
    this.startWidth = this.containerTarget.offsetWidth
    
    // Event listeners per drag
    document.addEventListener('mousemove', this.handleResize.bind(this))
    document.addEventListener('mouseup', this.stopResize.bind(this))
    document.addEventListener('touchmove', this.handleResize.bind(this), { passive: false })
    document.addEventListener('touchend', this.stopResize.bind(this))
    
    // Aggiungi classe CSS per feedback visivo
    this.containerTarget.classList.add('bui-sidebar-resizing')
    document.body.classList.add('bui-sidebar-resizing')
    
    console.log('📏 Started resizing sidebar')
  }
  
  // Gestisce resize durante drag
  handleResize(event) {
    if (!this.isResizing) return
    
    event.preventDefault()
    const clientX = event.clientX || event.touches[0].clientX
    const deltaX = clientX - this.startX
    const newWidth = Math.max(
      this.minWidthValue,
      Math.min(this.maxWidthValue, this.startWidth + deltaX)
    )
    
    this.containerTarget.style.width = `${newWidth}px`
    this.widthValue = newWidth
  }
  
  // Termina resize
  stopResize() {
    if (!this.isResizing) return
    
    this.isResizing = false
    
    // Rimuovi event listeners
    document.removeEventListener('mousemove', this.handleResize.bind(this))
    document.removeEventListener('mouseup', this.stopResize.bind(this))
    document.removeEventListener('touchmove', this.handleResize.bind(this))
    document.removeEventListener('touchend', this.stopResize.bind(this))
    
    // Rimuovi classi CSS
    this.containerTarget.classList.remove('bui-sidebar-resizing')
    document.body.classList.remove('bui-sidebar-resizing')
    
    console.log('📏 Stopped resizing sidebar. New width:', this.widthValue)
  }

  // ========================================
  // MOBILE TOGGLE
  // ========================================
  
  // Toggle sidebar su mobile
  toggleMobile() {
    this.collapsedValue = !this.collapsedValue
    this.updateMobileState()
  }
  
  // Mostra sidebar su mobile
  showMobile() {
    this.collapsedValue = false
    this.updateMobileState()
  }
  
  // Nasconde sidebar su mobile
  hideMobile() {
    this.collapsedValue = true
    this.updateMobileState()
  }
  
  // Aggiorna stato mobile
  updateMobileState() {
    if (!this.mobileValue) return
    
    if (this.collapsedValue) {
      this.containerTarget.classList.add('hidden')
      if (this.hasOverlayTarget) {
        this.overlayTarget.classList.add('hidden')
      }
      document.removeEventListener('click', this.boundHandleClickOutside)
    } else {
      this.containerTarget.classList.remove('hidden')
      if (this.hasOverlayTarget) {
        this.overlayTarget.classList.remove('hidden')
      }
      // Aggiungi listener per click esterno su mobile
      setTimeout(() => {
        document.addEventListener('click', this.boundHandleClickOutside)
      }, 100)
    }
    
    console.log('📱 Mobile sidebar:', this.collapsedValue ? 'hidden' : 'shown')
  }

  // ========================================
  // PIN/UNPIN STATE
  // ========================================
  
  // Toggle pin state
  togglePin() {
    this.pinnedValue = !this.pinnedValue
    this.updatePinState()
  }
  
  // Aggiorna stato pin
  updatePinState() {
    if (this.pinnedValue) {
      this.containerTarget.classList.remove('absolute')
      this.containerTarget.classList.add('relative')
    } else {
      this.containerTarget.classList.remove('relative')
      this.containerTarget.classList.add('absolute')
    }
    
    console.log('📌 Sidebar pin state:', this.pinnedValue ? 'pinned' : 'floating')
  }

  // ========================================
  // ACTIVE STATE MANAGEMENT
  // ========================================
  
  // Imposta item attivo
  setActiveItem(event) {
    const clickedItem = event.currentTarget
    
    // Rimuovi stato attivo da tutti gli item
    this.clearAllActiveStates()
    
    // Aggiungi stato attivo al clicked item
    clickedItem.classList.add('bg-gray-100', 'text-gray-900')
    clickedItem.setAttribute('aria-current', 'page')
    
    console.log('🎯 Active item set:', clickedItem.textContent.trim())
  }
  
  // Rimuovi tutti gli stati attivi
  clearAllActiveStates() {
    const activeItems = this.containerTarget.querySelectorAll('[aria-current="page"]')
    activeItems.forEach(item => {
      item.classList.remove('bg-gray-100', 'text-gray-900')
      item.removeAttribute('aria-current')
    })
  }

  // ========================================
  // WINDOW EVENTS & UTILITIES
  // ========================================
  
  // Gestisce resize finestra
  handleWindowResize() {
    this.checkMobileState()
  }
  
  // Verifica se siamo su mobile
  checkMobileState() {
    const wasMobile = this.mobileValue
    this.mobileValue = window.innerWidth < 768 // md breakpoint
    
    if (wasMobile !== this.mobileValue) {
      this.updateLayoutForBreakpoint()
    }
  }
  
  // Aggiorna layout per breakpoint
  updateLayoutForBreakpoint() {
    if (this.mobileValue) {
      // Switch a mobile: nasconde sidebar di default
      this.collapsedValue = true
      this.updateMobileState()
    } else {
      // Switch a desktop: mostra sidebar
      this.collapsedValue = false
      this.containerTarget.classList.remove('hidden')
      if (this.hasOverlayTarget) {
        this.overlayTarget.classList.add('hidden')
      }
      document.removeEventListener('click', this.boundHandleClickOutside)
    }
    
    console.log('💻 Layout updated for:', this.mobileValue ? 'mobile' : 'desktop')
  }
  
  // Gestisce click esterno su mobile
  handleClickOutside(event) {
    if (!this.mobileValue || this.collapsedValue) return
    
    if (!this.containerTarget.contains(event.target)) {
      this.hideMobile()
    }
  }
  
  // Applica stato iniziale
  applyInitialState() {
    // Applica larghezza se specificata
    if (this.widthValue && !this.mobileValue) {
      this.containerTarget.style.width = `${this.widthValue}px`
    }
    
    // Applica stato pin
    this.updatePinState()
    
    // Applica stato mobile
    if (this.mobileValue) {
      this.updateMobileState()
    }
  }
  
  // Inizializza sezioni collapsible
  initializeCollapsibleSections() {
    this.sectionTriggerTargets.forEach(trigger => {
      const sectionId = trigger.dataset.buiSidebarSectionId
      const content = this.sectionContentTargets.find(el => 
        el.dataset.buiSidebarSectionId === sectionId
      )
      
      if (content) {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true'
        if (isExpanded) {
          content.classList.remove('hidden')
        } else {
          content.classList.add('hidden')
        }
      }
    })
  }
}
