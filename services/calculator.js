document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const primaryServiceSelect = document.getElementById('primary-service');
    const addTraining = document.getElementById('add-training');
    const addMaintenance = document.getElementById('add-maintenance');
    const addIntegration = document.getElementById('add-integration');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const resultSummary = document.getElementById('result-summary');
    const totalPrice = document.getElementById('total-price');
    const specialNotice = document.getElementById('business-data-notice'); // New reference

    // Safety check - ensure critical elements exist
    if (!calculateBtn || !primaryServiceSelect) return;

    // Calculate button click handler
    calculateBtn.addEventListener('click', calculatePrice);
    
    // Reset button click handler
    resetBtn.addEventListener('click', resetForm);
    
    // Get quote button click handler (Standard Quote)
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            const total = totalPrice.textContent.replace('$', '').replace(',', '');
            const services = getSelectedServices();
            // Format message for WhatsApp
            const servicesList = services.map(s => `• ${s.name} - $${s.price}`).join('%0a');
            const message = `Hi Amit! I'm interested in:%0a%0a${servicesList}%0a%0a*Total Estimate: $${total}*%0a%0aCan we discuss the details?`;
            
            window.open(`https://wa.me/972503000184?text=${message}`, '_blank');
        });
    }
    
    function calculatePrice() {
        // Validation
        if (!primaryServiceSelect.value) {
            showNotification('Please select a primary service first.', 'warning');
            primaryServiceSelect.focus();
            return;
        }

        const services = getSelectedServices();
        const total = services.reduce((sum, service) => sum + service.price, 0);
        
        displayResults(services, total);
        handleSpecialNotices(); // Check if we need to show the special alert
        
        showNotification('Quote calculated successfully!', 'success');
    }

    function handleSpecialNotices() {
        const selectedValue = primaryServiceSelect.value;
        
        // Logic for Business Data Analysis Special Notice
        if (selectedValue === 'business-data') {
            if (specialNotice) specialNotice.style.display = 'block';
            if (getQuoteBtn) getQuoteBtn.style.display = 'none'; // Hide standard button, use the specific one inside notice
        } else {
            if (specialNotice) specialNotice.style.display = 'none';
            if (getQuoteBtn) getQuoteBtn.style.display = 'flex'; // Show standard button
        }
    }
    
    function getSelectedServices() {
        const services = [];
        
        // Primary service
        const selectedOption = primaryServiceSelect.options[primaryServiceSelect.selectedIndex];
        if (selectedOption.value) {
            services.push({
                name: selectedOption.text.split(' ($')[0],
                price: parseInt(selectedOption.dataset.price) || 0
            });
        }
        
        // Additional services
        if (addTraining && addTraining.checked) {
            services.push({
                name: 'AI Training & Consultation',
                price: parseInt(addTraining.dataset.price) || 0
            });
        }
        
        if (addMaintenance && addMaintenance.checked) {
            services.push({
                name: 'Monthly Maintenance',
                price: parseInt(addMaintenance.dataset.price) || 0
            });
        }
        
        if (addIntegration && addIntegration.checked) {
            services.push({
                name: 'System Integration',
                price: parseInt(addIntegration.dataset.price) || 0
            });
        }
        
        // Timeline selection
        const selectedTimeline = document.querySelector('input[name="timeline"]:checked');
        if (selectedTimeline && selectedTimeline.dataset.price && selectedTimeline.dataset.price !== '0') {
            // Find the label text relative to the radio button
            const labelSpan = selectedTimeline.parentElement.querySelector('.radio-text');
            const timelineName = labelSpan ? labelSpan.textContent.split(' (')[0] : 'Express Delivery';
            
            services.push({
                name: timelineName,
                price: parseInt(selectedTimeline.dataset.price) || 0
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
        
        services.forEach((service, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'result-item';
            itemElement.innerHTML = `
                <span class="result-item-name">${service.name}</span>
                <span class="result-item-price">$${service.price.toLocaleString()}</span>
            `;
            
            // Add animation styles directly
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(-10px)';
            itemElement.style.transition = 'all 0.3s ease-out';
            
            resultSummary.appendChild(itemElement);
            
            // Staggered animation
            setTimeout(() => {
                itemElement.style.opacity = '1';
                itemElement.style.transform = 'translateX(0)';
            }, 50 * index);
        });
        
        // Animate total price
        animateValue(totalPrice, 0, total, 1000);
    }
    
    function animateValue(element, start, end, duration) {
        // Parse current value if it's text to prevent NaN jump
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = `$${current.toLocaleString()}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    function resetForm() {
        primaryServiceSelect.value = '';
        if(addTraining) addTraining.checked = false;
        if(addMaintenance) addMaintenance.checked = false;
        if(addIntegration) addIntegration.checked = false;
        
        const standardTimeline = document.getElementById('timeline-standard');
        if(standardTimeline) standardTimeline.checked = true;
        
        resultSummary.innerHTML = `
            <p class="empty-message">
                <i class="fas fa-info-circle"></i>
                Select services to see your customized quote
            </p>
        `;
        totalPrice.textContent = '$0';
        
        if (getQuoteBtn) getQuoteBtn.style.display = 'none';
        if (specialNotice) specialNotice.style.display = 'none';
        
        showNotification('Form reset successfully', 'info');
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        // Determine color based on type
        let bgColor = '#2196F3'; // Info blue
        let icon = 'info-circle';
        
        if (type === 'success') { bgColor = '#00C853'; icon = 'check-circle'; }
        if (type === 'warning') { bgColor = '#FFA000'; icon = 'exclamation-triangle'; }

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Inline styles for reliability
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.3s ease-out;
            font-family: 'Poppins', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(50px)';
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 300);
        }, 3000);
    }
});