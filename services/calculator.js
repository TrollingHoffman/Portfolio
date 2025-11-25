document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const resultSummary = document.getElementById('result-summary');
    const totalPrice = document.getElementById('total-price');
    const specialNotice = document.getElementById('business-data-notice');

    if (!calculateBtn) return;

    // Calculate button click handler
    calculateBtn.addEventListener('click', calculatePrice);
    
    // Reset button click handler
    resetBtn.addEventListener('click', resetForm);
    
    // Get quote button click handler
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            const total = totalPrice.textContent;
            const services = getSelectedServices();
            
            // Format message for WhatsApp
            const servicesList = services.map(s => `• ${s.name} - ₪${s.price}`).join('%0a');
            const message = `Hi Amit! I'm interested in:%0a%0a${servicesList}%0a%0a*Total Estimate: ${total}*%0a%0aCan we discuss the details?`;
            
            window.open(`https://wa.me/972503000184?text=${message}`, '_blank');
        });
    }
    
    function calculatePrice() {
        const services = getSelectedServices();
        
        // Validation - Must select at least one service
        if (services.length === 0) {
            showNotification('Please select at least one service.', 'warning');
            return;
        }

        const total = services.reduce((sum, service) => sum + service.price, 0);
        
        displayResults(services, total);
        handleSpecialNotices(services); 
        
        showNotification('Quote calculated successfully!', 'success');
    }

    function getSelectedServices() {
        const services = [];
        
        // 1. Get all checked services (from the big list)
        const checkedServices = document.querySelectorAll('.service-checkbox:checked');
        
        checkedServices.forEach(checkbox => {
            services.push({
                name: checkbox.dataset.name,
                price: parseInt(checkbox.dataset.price) || 0,
                id: checkbox.value // Store ID to check for business-data later
            });
        });

        // 2. Get Timeline Selection
        const selectedTimeline = document.querySelector('input[name="timeline"]:checked');
        if (selectedTimeline && selectedTimeline.dataset.price && selectedTimeline.dataset.price !== '0') {
            const labelSpan = selectedTimeline.parentElement.querySelector('.radio-text');
            const timelineName = labelSpan ? labelSpan.textContent.split(' (')[0] : 'Express Delivery';
            
            services.push({
                name: timelineName,
                price: parseInt(selectedTimeline.dataset.price) || 0,
                id: 'timeline'
            });
        }
        
        return services;
    }

    function handleSpecialNotices(services) {
        // Check if "Business Data Analysis" is in the selected services list
        const hasBusinessData = services.some(s => s.id === 'business-data');
        
        if (hasBusinessData) {
            if (specialNotice) specialNotice.style.display = 'block';
            if (getQuoteBtn) getQuoteBtn.style.display = 'none'; // Hide standard button
        } else {
            if (specialNotice) specialNotice.style.display = 'none';
            if (getQuoteBtn) getQuoteBtn.style.display = 'flex'; // Show standard button
        }
    }
    
    function displayResults(services, total) {
        resultSummary.innerHTML = '';
        
        services.forEach((service, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'result-item';
            itemElement.innerHTML = `
                <span class="result-item-name">${service.name}</span>
                <span class="result-item-price">₪${service.price.toLocaleString()}</span>
            `;
            
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(-10px)';
            itemElement.style.transition = 'all 0.3s ease-out';
            
            resultSummary.appendChild(itemElement);
            
            setTimeout(() => {
                itemElement.style.opacity = '1';
                itemElement.style.transform = 'translateX(0)';
            }, 50 * index);
        });
        
        animateValue(totalPrice, 0, total, 1000);
    }
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = `₪${current.toLocaleString()}`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    function resetForm() {
        // Uncheck all service checkboxes
        document.querySelectorAll('.service-checkbox').forEach(cb => cb.checked = false);
        
        // Reset timeline to standard
        const standardTimeline = document.getElementById('timeline-standard');
        if(standardTimeline) standardTimeline.checked = true;
        
        resultSummary.innerHTML = `
            <p class="empty-message">
                <i class="fas fa-info-circle"></i>
                Select services to see your customized quote
            </p>
        `;
        totalPrice.textContent = '₪0';
        
        if (getQuoteBtn) getQuoteBtn.style.display = 'none';
        if (specialNotice) specialNotice.style.display = 'none';
        
        showNotification('Form reset successfully', 'info');
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        let bgColor = '#2196F3'; 
        let icon = 'info-circle';
        
        if (type === 'success') { bgColor = '#00C853'; icon = 'check-circle'; }
        if (type === 'warning') { bgColor = '#FFA000'; icon = 'exclamation-triangle'; }

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
        `;
        
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
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(50px)';
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 300);
        }, 3000);
    }
});