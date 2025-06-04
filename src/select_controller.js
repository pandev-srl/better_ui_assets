import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["trigger", "dropdown", "search", "option", "hiddenInput", "badgeContainer", "badge"]
  static values = { 
    open: Boolean, 
    multiple: Boolean,
    searchable: Boolean,
    selected: Array,
    options: Array,
    placeholder: String,
    searchPlaceholder: String
  }

  connect() {
    this.close()
    this.updateTriggerText()
    this.boundClickOutside = this.clickOutside.bind(this)
    
    // Initialize options data
    this.initializeOptions()
    
    // Initialize badges for existing selections
    if (this.multipleValue) {
      this.updateBadges()
    }
  }

  disconnect() {
    document.removeEventListener("click", this.boundClickOutside)
  }

  // Initialize options from DOM
  initializeOptions() {
    if (this.hasOptionTargets) {
      this.optionsValue = this.optionTargets.map(option => ({
        value: option.dataset.value,
        label: option.textContent.trim(),
        element: option
      }))
    }
  }

  // Toggle dropdown
  toggle() {
    this.openValue ? this.close() : this.open()
  }

  // Open dropdown with animation
  open() {
    this.openValue = true
    this.dropdownTarget.classList.remove('hidden')
    
    // Trigger reflow for animation
    this.dropdownTarget.offsetHeight
    
    this.dropdownTarget.classList.remove('opacity-0', 'scale-95', 'translate-y-1')
    this.dropdownTarget.classList.add('opacity-100', 'scale-100', 'translate-y-0')
    
    // Focus search if searchable
    if (this.searchableValue && this.hasSearchTarget) {
      setTimeout(() => this.searchTarget.focus(), 100)
    }
    
    document.addEventListener("click", this.boundClickOutside)
  }

  // Close dropdown with animation
  close() {
    if (!this.openValue) return
    
    this.openValue = false
    this.dropdownTarget.classList.remove('opacity-100', 'scale-100', 'translate-y-0')
    this.dropdownTarget.classList.add('opacity-0', 'scale-95', 'translate-y-1')
    
    // Hide after animation
    setTimeout(() => {
      this.dropdownTarget.classList.add('hidden')
    }, 150)
    
    // Clear search
    if (this.hasSearchTarget) {
      this.searchTarget.value = ''
      this.performSearch()
    }
    
    document.removeEventListener("click", this.boundClickOutside)
  }

  // Handle click outside
  clickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  // Select option
  selectOption(event) {
    const value = event.currentTarget.dataset.value
    const label = event.currentTarget.textContent.trim()
    
    if (this.multipleValue) {
      this.toggleMultipleSelection(value, label)
    } else {
      this.setSingleSelection(value, label)
      this.close()
    }
    
    this.updateHiddenInput()
    this.updateTriggerText()
  }

  // Toggle selection for multiple mode
  toggleMultipleSelection(value, label) {
    const currentSelected = [...this.selectedValue]
    const index = currentSelected.findIndex(item => item.value === value)
    
    if (index >= 0) {
      // Remove selection
      currentSelected.splice(index, 1)
    } else {
      // Add selection
      currentSelected.push({ value, label })
    }
    
    this.selectedValue = currentSelected
    this.updateBadges()
  }

  // Set single selection
  setSingleSelection(value, label) {
    this.selectedValue = [{ value, label }]
  }

  // Remove selection (from badge)
  removeSelection(event) {
    const value = event.currentTarget.dataset.value
    const currentSelected = [...this.selectedValue]
    const index = currentSelected.findIndex(item => item.value === value)
    
    if (index >= 0) {
      currentSelected.splice(index, 1)
      this.selectedValue = currentSelected
      this.updateBadges()
      this.updateHiddenInput()
      this.updateTriggerText()
    }
  }

  // Search functionality
  search(event) {
    this.performSearch()
  }

  performSearch() {
    if (!this.hasSearchTarget) return
    
    const query = this.searchTarget.value.toLowerCase()
    
    this.optionTargets.forEach(option => {
      const label = option.textContent.trim().toLowerCase()
      const matches = label.includes(query)
      
      option.style.display = matches ? 'block' : 'none'
      
      // Add highlight if there's a query
      if (query && matches) {
        this.highlightMatch(option, query)
      } else {
        this.removeHighlight(option)
      }
    })
  }

  // Highlight matching text
  highlightMatch(option, query) {
    const originalText = option.dataset.originalText || option.textContent
    option.dataset.originalText = originalText
    
    const regex = new RegExp(`(${query})`, 'gi')
    const highlightedText = originalText.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
    option.innerHTML = highlightedText
  }

  // Remove highlight
  removeHighlight(option) {
    if (option.dataset.originalText) {
      option.textContent = option.dataset.originalText
      delete option.dataset.originalText
    }
  }

  // Update trigger text
  updateTriggerText() {
    const triggerText = this.triggerTarget.querySelector('[data-select-text]')
    if (!triggerText) return
    
    if (this.selectedValue.length === 0) {
      triggerText.textContent = this.placeholderValue || 'Seleziona...'
      triggerText.classList.add('text-gray-500')
    } else if (this.multipleValue) {
      if (this.selectedValue.length === 1) {
        triggerText.textContent = this.selectedValue[0].label
      } else {
        triggerText.textContent = `${this.selectedValue.length} selezionati`
      }
      triggerText.classList.remove('text-gray-500')
    } else {
      triggerText.textContent = this.selectedValue[0].label
      triggerText.classList.remove('text-gray-500')
    }
  }

  // Update badges for multiple selection
  updateBadges() {
    if (!this.multipleValue || !this.hasBadgeContainerTarget) return
    
    this.badgeContainerTarget.innerHTML = ''
    
    // Show/hide container based on selections
    if (this.selectedValue.length > 0) {
      this.badgeContainerTarget.style.display = 'flex'
      
      this.selectedValue.forEach(item => {
        const badge = this.createBadge(item.value, item.label)
        this.badgeContainerTarget.appendChild(badge)
      })
    } else {
      this.badgeContainerTarget.style.display = 'none'
    }
  }

  // Create badge element
  createBadge(value, label) {
    const badge = document.createElement('span')
    badge.className = 'inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded'
    badge.dataset.selectTarget = 'badge'
    
    const text = document.createElement('span')
    text.textContent = label
    
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'hover:text-gray-600'
    button.dataset.value = value
    button.dataset.action = 'click->select#removeSelection'
    button.innerHTML = '×'
    
    badge.appendChild(text)
    badge.appendChild(button)
    
    return badge
  }

  // Update hidden input
  updateHiddenInput() {
    if (!this.hasHiddenInputTarget) return
    
    if (this.multipleValue) {
      // For multiple selection, create array of values
      const values = this.selectedValue.map(item => item.value)
      this.hiddenInputTarget.value = JSON.stringify(values)
    } else {
      // For single selection, just the value
      this.hiddenInputTarget.value = this.selectedValue.length > 0 ? this.selectedValue[0].value : ''
    }
  }

  // Keyboard navigation
  keydown(event) {
    switch(event.key) {
      case 'Enter':
        event.preventDefault()
        if (!this.openValue) {
          this.open()
        }
        break
        
      case 'Escape':
        event.preventDefault()
        if (this.openValue) {
          this.close()
        }
        break
        
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (!this.openValue) {
          this.open()
        }
        break
    }
  }

  // Update selected state visual indicators
  selectedValueChanged() {
    this.updateOptionStates()
  }

  updateOptionStates() {
    this.optionTargets.forEach(option => {
      const value = option.dataset.value
      const isSelected = this.selectedValue.some(item => item.value === value)
      
      option.classList.toggle('bg-gray-100', isSelected)
      
      // Add/remove checkmark
      const checkmark = option.querySelector('.checkmark')
      if (isSelected && !checkmark) {
        const mark = document.createElement('span')
        mark.className = 'checkmark ml-auto text-gray-600'
        mark.innerHTML = '✓'
        option.appendChild(mark)
      } else if (!isSelected && checkmark) {
        checkmark.remove()
      }
    })
  }
}
