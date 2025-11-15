// Global Innovation University JavaScript
class GlobalInnovationUniversity {
    constructor() {
        this.PIPEDREAM_ENDPOINT = 'https://eoqvh9sfid85zc1.m.pipedream.net';
        this.leadForm = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupSmoothScrolling();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Form submission - FIXED
        this.leadForm = document.getElementById('leadForm');
        if (this.leadForm) {
            this.leadForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            const leadModal = document.getElementById('leadModal');
            const feeModal = document.getElementById('feeModal');
            
            if (e.target === leadModal) this.closeModal();
            if (e.target === feeModal) this.closeFeeModal();
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupAnimations() {
        // Add intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature, .program-card, .step, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    async loadInitialData() {
        await Promise.all([
            this.loadCourses(),
            this.loadFeeData()
        ]);
    }

    async loadCourses() {
        try {
            const response = await fetch('../api/courses.json');
            const courses = await response.json();
            this.displayCourses(courses);
            this.populateCourseSelect(courses);
        } catch (error) {
            console.error('Error loading courses:', error);
            this.loadFallbackCourses();
        }
    }

    displayCourses(courses) {
        const container = document.getElementById('courses-container');
        if (!container) return;

        container.innerHTML = courses.map(course => `
            <div class="program-card">
                <h3>${course.name}</h3>
                <p>${course.description}</p>
                <div class="program-meta">
                    <span>${course.duration}</span>
                    <span>${course.type}</span>
                </div>
            </div>
        `).join('');
    }

    populateCourseSelect(courses) {
        const select = document.getElementById('course');
        if (!select) return;

        select.innerHTML = '<option value="">Select program</option>' + 
            courses.map(course => 
                `<option value="${course.name}">${course.name}</option>`
            ).join('');
    }

    async loadFeeData() {
        try {
            const response = await fetch('../api/fees.json');
            const fees = await response.json();
            this.displayFeeData(fees);
        } catch (error) {
            console.error('Error loading fee data:', error);
            this.loadFallbackFees();
        }
    }

    displayFeeData(fees) {
        const container = document.getElementById('feeContent');
        if (!container) return;

        container.innerHTML = fees.map(fee => `
            <div class="fee-item">
                <h4>${fee.course}</h4>
                <div class="fee-amount">${fee.range}</div>
                ${fee.breakdown ? `
                    <div class="fee-breakdown">
                        <div><span>Tuition Fee:</span> <span>${fee.breakdown.tuition}</span></div>
                        <div><span>Hostel & Mess:</span> <span>${fee.breakdown.hostel}</span></div>
                        <div><span>Other Charges:</span> <span>${fee.breakdown.other}</span></div>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    loadFallbackCourses() {
        const fallbackCourses = [
            {
                name: "Liberal Arts & Sciences",
                description: "Comprehensive education in humanities, social sciences, and natural sciences with interdisciplinary approach.",
                duration: "3-4 Years",
                type: "BA/BSc"
            },
            {
                name: "Business Management",
                description: "Develop leadership skills and business acumen through case studies and industry projects.",
                duration: "2 Years",
                type: "MBA"
            }
        ];
        
        this.displayCourses(fallbackCourses);
        this.populateCourseSelect(fallbackCourses);
    }

    loadFallbackFees() {
        const fallbackFees = [
            {
                course: "Liberal Arts & Sciences",
                range: "₹1,50,000 - ₹2,50,000 per year",
                breakdown: {
                    tuition: "₹1,20,000",
                    hostel: "₹80,000",
                    other: "₹50,000"
                }
            }
        ];
        
        this.displayFeeData(fallbackFees);
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        console.log("Form submission started...");
        
        if (!this.validateForm()) {
            console.log("Form validation failed");
            return;
        }

        const formData = this.collectFormData();
        console.log("Form data:", formData);
        
        try {
            // Show loading state
            const submitBtn = this.leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            console.log("Sending to Pipedream:", this.PIPEDREAM_ENDPOINT);
            
            const response = await fetch(this.PIPEDREAM_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            if (response.ok) {
                console.log("Form submitted successfully!");
                this.showSuccessMessage();
                this.resetForm();
                setTimeout(() => this.closeModal(), 2000);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showErrorMessage();
        } finally {
            const submitBtn = this.leadForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Inquiry';
            submitBtn.disabled = false;
        }
    }

    collectFormData() {
        return {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            state: document.getElementById('state').value,
            course: document.getElementById('course').value,
            intakeYear: document.getElementById('intakeYear').value,
            consent: document.getElementById('consent').checked,
            university: 'Global Innovation University',
            timestamp: new Date().toISOString(),
            source: 'website_inquiry',
            type: 'admission_inquiry'
        };
    }

    validateForm() {
        const phone = document.getElementById('phone').value;
        const phoneRegex = /^[6-9]\d{9}$/;
        
        if (!phoneRegex.test(phone)) {
            this.showFormMessage('Please provide a valid 10-digit Indian mobile number starting with 6-9.', 'error');
            return false;
        }
        
        if (!document.getElementById('consent').checked) {
            this.showFormMessage('Please consent to receive information about our programs and admission updates.', 'error');
            return false;
        }
        
        return true;
    }

    showSuccessMessage() {
        this.showFormMessage('✅ Thank you for your inquiry! Our admission team will contact you within 24 hours.', 'success');
    }

    showErrorMessage() {
        this.showFormMessage('❌ Sorry, there was an error submitting your inquiry. Please try again.', 'error');
    }

    showFormMessage(message, type) {
        const messageDiv = document.getElementById('formMessage');
        if (!messageDiv) return;

        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    resetForm() {
        if (this.leadForm) this.leadForm.reset();
    }

    // Modal functions
    openModal() {
        document.getElementById('leadModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('leadModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    openFeeModal() {
        document.getElementById('feeModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeFeeModal() {
        document.getElementById('feeModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GlobalInnovationUniversity();
});

// Global functions for HTML onclick attributes
function openModal() {
    const app = new GlobalInnovationUniversity();
    app.openModal();
}

function closeModal() {
    const app = new GlobalInnovationUniversity();
    app.closeModal();
}

function openFeeModal() {
    const app = new GlobalInnovationUniversity();
    app.openFeeModal();
}

function closeFeeModal() {
    const app = new GlobalInnovationUniversity();
    app.closeFeeModal();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .feature, .program-card, .step, .stat-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .feature.animate-in, 
    .program-card.animate-in, 
    .step.animate-in, 
    .stat-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .step:nth-child(2) { transition-delay: 0.1s; }
    .step:nth-child(3) { transition-delay: 0.2s; }
    .step:nth-child(4) { transition-delay: 0.3s; }
`;
document.head.appendChild(style);
