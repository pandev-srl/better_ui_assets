import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["star", "hiddenInput", "display"]
  static values = { 
    rating: Number,
    max: Number,
    readonly: Boolean,
    halfStars: Boolean,
    name: String
  }

  connect() {
    this.updateStarsDisplay()
  }

  // Handle star click
  starClick(event) {
    if (this.readonlyValue) return
    
    const starIndex = parseInt(event.currentTarget.dataset.index)
    const isFullStar = this.halfStarsValue ? this.getClickPosition(event) > 0.5 : true
    
    this.ratingValue = isFullStar ? starIndex + 1 : starIndex + 0.5
    this.updateStarsDisplay()
    this.updateHiddenInput()
    
    // Dispatch custom event
    this.dispatch('change', { detail: { rating: this.ratingValue } })
  }

  // Handle star hover for preview
  starHover(event) {
    if (this.readonlyValue) return
    
    const starIndex = parseInt(event.currentTarget.dataset.index)
    const isFullStar = this.halfStarsValue ? this.getClickPosition(event) > 0.5 : true
    
    const previewRating = isFullStar ? starIndex + 1 : starIndex + 0.5
    this.updateStarsDisplay(previewRating)
  }

  // Reset to actual rating when hover ends
  starLeave() {
    if (this.readonlyValue) return
    this.updateStarsDisplay()
  }

  // Get click/hover position within star (0-1)
  getClickPosition(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    return x / rect.width
  }

  // Update visual display of stars
  updateStarsDisplay(previewRating = null) {
    const displayRating = previewRating !== null ? previewRating : this.ratingValue
    
    this.starTargets.forEach((star, index) => {
      const starValue = index + 1
      const starRating = displayRating
      
      // Reset classes
      star.classList.remove('text-yellow-400', 'text-yellow-300', 'text-gray-300')
      
      if (starRating >= starValue) {
        // Full star
        star.classList.add('text-yellow-400')
        star.innerHTML = '★'
      } else if (this.halfStarsValue && starRating >= starValue - 0.5) {
        // Half star
        star.classList.add('text-yellow-300')
        star.innerHTML = this.createHalfStar()
      } else {
        // Empty star
        star.classList.add('text-gray-300')
        star.innerHTML = '☆'
      }
    })
    
    // Update display text if present
    if (this.hasDisplayTarget) {
      this.displayTarget.textContent = displayRating > 0 ? displayRating.toString() : ''
    }
  }

  // Create half star HTML
  createHalfStar() {
    return `
      <span class="relative inline-block">
        <span class="text-gray-300">☆</span>
        <span class="absolute inset-0 overflow-hidden w-1/2">
          <span class="text-yellow-400">★</span>
        </span>
      </span>
    `
  }

  // Update hidden input value
  updateHiddenInput() {
    if (this.hasHiddenInputTarget) {
      this.hiddenInputTarget.value = this.ratingValue
    }
  }

  // Handle rating value change
  ratingValueChanged() {
    this.updateStarsDisplay()
    this.updateHiddenInput()
  }

  // Reset rating
  reset() {
    if (this.readonlyValue) return
    
    this.ratingValue = 0
    this.updateStarsDisplay()
    this.updateHiddenInput()
    
    this.dispatch('change', { detail: { rating: this.ratingValue } })
  }

  // Keyboard navigation
  keydown(event) {
    if (this.readonlyValue) return
    
    switch(event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        this.incrementRating()
        break
        
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault()
        this.decrementRating()
        break
        
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        event.preventDefault()
        this.setRating(parseInt(event.key))
        break
        
      case 'Escape':
        event.preventDefault()
        this.reset()
        break
    }
  }

  // Increment rating
  incrementRating() {
    const step = this.halfStarsValue ? 0.5 : 1
    const newRating = Math.min(this.ratingValue + step, this.maxValue)
    
    if (newRating !== this.ratingValue) {
      this.ratingValue = newRating
      this.updateStarsDisplay()
      this.updateHiddenInput()
      this.dispatch('change', { detail: { rating: this.ratingValue } })
    }
  }

  // Decrement rating
  decrementRating() {
    const step = this.halfStarsValue ? 0.5 : 1
    const newRating = Math.max(this.ratingValue - step, 0)
    
    if (newRating !== this.ratingValue) {
      this.ratingValue = newRating
      this.updateStarsDisplay()
      this.updateHiddenInput()
      this.dispatch('change', { detail: { rating: this.ratingValue } })
    }
  }

  // Set specific rating
  setRating(rating) {
    const newRating = Math.min(Math.max(rating, 0), this.maxValue)
    
    if (newRating !== this.ratingValue) {
      this.ratingValue = newRating
      this.updateStarsDisplay()
      this.updateHiddenInput()
      this.dispatch('change', { detail: { rating: this.ratingValue } })
    }
  }
}
