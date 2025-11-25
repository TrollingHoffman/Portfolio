document.addEventListener('DOMContentLoaded', function() {
    const primaryServiceSelect = document.getElementById('primary-service');
    const addTraining = document.getElementById('add-training');
    const addMaintenance = document.getElementById('add-maintenance');
    const addIntegration = document.getElementById('add-integration');
    const timelineRadios = document.querySelectorAll('input[name="timeline"]');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const resultSummary = document.getElementById('result-summary');
    const totalPrice = document.getElementById('total-price');
    
    // Calculate button click handler
    calculateBtn.addEventListener('click', calculatePrice);
    
    // Reset button click handler
    resetBtn.addEventListener('click', resetForm);
    
    // Get quote button click handler
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            const total = totalPrice.textContent.replace('$', '').replace(',', '');
            const services = getSelectedServices();
            const message = `Hi! I'm interested in:\n\n${services.map(s => `• ${s.name} - $${s.price}`).join('\n')}\n\nTotal: $${total}\n\nCan we discuss the details?`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/972503000184?text=${encodedMessage}`, '_blank');
        });
    }
    
    function calculatePrice() {
        // Check if primary service is selected
        if (!primaryServiceSelect.value) {
            showNotification('Please select a primary service first.', 'warning');
            return;
        }

        const services = getSelectedServices();
        const total = services.reduce((sum, service) => sum + service.price, 0);
        
        displayResults(services, total);
        
        // Show get quote button
        if (getQuoteBtn) {
            getQuoteBtn.style.display = 'flex';
        }
        
        // Show success notification
        showNotification('Quote calculated successfully!', 'success');
    }
    
    function getSelectedServices() {
        const services = [];
        
        // Primary service
        const selectedOption = primaryServiceSelect.options[primaryServiceSelect.selectedIndex];
        if (selectedOption.value) {
            services.push({
                name: selectedOption.text.split(' ($')[0],
                price: parseInt(selectedOption.dataset.price)
            });
        }
        
        // Additional services
        if (addTraining.checked) {
            services.push({
                name: 'AI Training & Consultation',
                price: parseInt(addTraining.dataset.price)
            });
        }
        
        if (addMaintenance.checked) {
            services.push({
                name: 'Monthly Maintenance & Support',
                price: parseInt(addMaintenance.dataset.price)
            });
        }
        
        if (addIntegration.checked) {
            services.push({
                name: 'System Integration Services',
                price: parseInt(addIntegration.dataset.price)
            });
        }
        
        // Timeline selection
        const selectedTimeline = document.querySelector('input[name="timeline"]:checked');
        if (selectedTimeline && selectedTimeline.dataset.price !== '0') {
            const timelineLabel = selectedTimeline.nextElementSibling.querySelector('.radio-label').textContent;
            services.push({
                name: `${timelineLabel} Delivery`,
                price: parseInt(selectedTimeline.dataset.price)
            });
        }
        
        return services;
    }
    
    function displayResults(services, total) {
        resultSummary.innerHTML = '';
        
        if (services.length === 0) {
            resultSummary.innerHTML = `
                <p class="empty-message">
                    <i class="fas fa-info-circle"></i>
                    Select services to see your customized quote
                </p>
            `;
            totalPrice.textContent = '$0';
            return;
        }
        
        services.forEach(service => {
            const itemElement = document.createElement('div');
            itemElement.className = 'result-item';
            itemElement.innerHTML = `
                <span class="service-name">${service.name}</span>
                <span class="service-result-price">$${service.price.toLocaleString()}</span>
            `;
            
            // Add animation
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(-20px)';
            resultSummary.appendChild(itemElement);
            
            setTimeout(() => {
                itemElement.style.transition = 'all 0.3s ease-out';
                itemElement.style.opacity = '1';
                itemElement.style.transform = 'translateX(0)';
            }, 50 * services.indexOf(service));
        });
        
        // Animate total price
        animateValue(totalPrice, 0, total, 1000);
    }
    
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = `$${end.toLocaleString()}`;
                clearInterval(timer);
            } else {
                element.textContent = `$${Math.floor(current).toLocaleString()}`;
            }
        }, 16);
    }
    
    function resetForm() {
        primaryServiceSelect.value = '';
        addTraining.checked = false;
        addMaintenance.checked = false;
        addIntegration.checked = false;
        document.getElementById('timeline-standard').checked = true;
        
        resultSummary.innerHTML = `
            <p class="empty-message">
                <i class="fas fa-info-circle"></i>
                Select services to see your customized quote
            </p>
        `;
        totalPrice.textContent = '$0';
        
        if (getQuoteBtn) {
            getQuoteBtn.style.display = 'none';
        }
        
        showNotification('Form reset successfully', 'info');
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#00C853' : type === 'warning' ? '#FFA000' : '#2196F3'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});