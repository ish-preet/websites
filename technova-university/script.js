// TechNova University JavaScript
class TechNovaUniversity {
    constructor() {
        this.PIPEDREAM_ENDPOINT = 'https://eoqvh9sfid85zc1.m.pipedream.net';
        this.leadForm = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupSmoothScrolling();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
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
        document.querySelectorAll('.nav-menu a').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            });
        });
    }

    async loadInitialData() {
        await Promise.all([this.loadCourses(), this.loadFeeData()]);
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

        container.innerHTML = courses
            .map(
                (course) => `
                <div class="program-card">
                    <h3>${course.name}</h3>
                    <p>${course.description}</p>
                    <div class="program-meta">
                        <span>${course.duration}</span>
                        <span>${course.type}</span>
                    </div>
                </div>
            `
            )
            .join('');
    }

    populateCourseSelect(courses) {
        const select = document.getElementById('course');
        if (!select) return;

        select.innerHTML =
            '<option value="">Choose program</option>' +
            courses
                .map(
                    (course) => `<option value="${course.name}">${course.name}</option>`
                )
                .join('');
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

        container.innerHTML = fees
            .map(
                (fee) => `
                <div class="fee-item">
                    <h4>${fee.course}</h4>
                    <div class="fee-range">${fee.range}</div>
                    ${
                        fee.breakdown
                            ? `
                        <div class="fee-breakdown">
                            <div><span>Tuition Fee:</span> <span>${fee.breakdown.tuition}</span></div>
                            <div><span>Hostel Fee:</span> <span>${fee.breakdown.hostel}</span></div>
                            <div><span>Other Charges:</span> <span>${fee.breakdown.other}</span></div>
                        </div>
                    `
                            : ''
                    }
                </div>
            `
            )
            .join('');
    }

    loadFallbackCourses() {
        const fallbackCourses = [
            {
                name: 'Artificial Intelligence & Machine Learning',
                description:
                    'Comprehensive program covering AI algorithms, deep learning, and intelligent systems development.',
                duration: '4 Years',
                type: 'BTech',
            },
            {
                name: 'Cybersecurity & Blockchain',
                description:
                    'Learn to protect digital assets and build secure decentralized applications.',
                duration: '4 Years',
                type: 'BTech',
            },
            {
                name: 'Data Science & Analytics',
                description:
                    'Master data analysis, visualization, and predictive modeling techniques.',
                duration: '4 Years',
                type: 'BTech',
            },
            {
                name: 'Cloud Computing & DevOps',
                description:
                    'Learn cloud infrastructure, containerization, and continuous deployment.',
                duration: '4 Years',
                type: 'BTech',
            },
            {
                name: 'Internet of Things',
                description:
                    'Build connected devices and smart systems with embedded technology.',
                duration: '4 Years',
                type: 'BTech',
            },
            {
                name: 'Business Technology',
                description:
                    'Bridge business strategy with technology implementation and digital transformation.',
                duration: '2 Years',
                type: 'MBA',
            },
        ];

        this.displayCourses(fallbackCourses);
        this.populateCourseSelect(fallbackCourses);
    }

    loadFallbackFees() {
        const fallbackFees = [
            {
                course: 'Artificial Intelligence & Machine Learning',
                range: '₹3,50,000 - ₹5,00,000 per year',
                breakdown: {
                    tuition: '₹3,00,000',
                    hostel: '₹1,20,000',
                    other: '₹80,000',
                },
            },
            {
                course: 'Cybersecurity & Blockchain',
                range: '₹3,00,000 - ₹4,50,000 per year',
                breakdown: {
                    tuition: '₹2,60,000',
                    hostel: '₹1,20,000',
                    other: '₹70,000',
                },
            },
            {
                course: 'Data Science & Analytics',
                range: '₹3,20,000 - ₹4,80,000 per year',
                breakdown: {
                    tuition: '₹2,80,000',
                    hostel: '₹1,20,000',
                    other: '₹80,000',
                },
            },
        ];

        this.displayFeeData(fallbackFees);
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        console.log("=== TECHNOVA FORM SUBMISSION STARTED ===");

        if (!this.validateForm()) {
            console.log("Form validation failed");
            return;
        }

        const formData = this.collectFormData();
        console.log("Form data collected:", formData);
        console.log("Sending to:", this.PIPEDREAM_ENDPOINT);

        try {
            // Show loading state
            const submitBtn = this.leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            // Send to Pipedream
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
                console.log("✅ Form submitted successfully to Pipedream!");
                
                // Show personalized success message with form data
                this.showSuccessMessage(formData);
                this.resetForm();
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    this.closeModal();
                }, 3000);
                
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Error submitting form:', error);
            this.showErrorMessage();
        } finally {
            // Reset button state
            const submitBtn = this.leadForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = 'Submit Application';
                submitBtn.disabled = false;
            }
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
            university: 'TechNova University',
            timestamp: new Date().toISOString(),
            source: 'website_lead',
        };
    }

    validateForm() {
        const phone = document.getElementById('phone').value;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(phone)) {
            this.showFormMessage(
                'Please enter a valid 10-digit Indian mobile number starting with 6-9.',
                'error'
            );
            return false;
        }

        if (!document.getElementById('consent').checked) {
            this.showFormMessage(
                'Please agree to receive information about our programs and updates.',
                'error'
            );
            return false;
        }

        return true;
    }

    showSuccessMessage(formData) {
        const message = `
            🎉 Thank you <strong>${formData.fullName}</strong>!<br><br>
            Your application for <strong>${formData.course}</strong> has been submitted successfully.<br>
            We'll contact you at <strong>${formData.email}</strong> within 24 hours to discuss next steps.
        `;
        this.showFormMessage(message, 'success');
    }

    showErrorMessage() {
        this.showFormMessage(
            '❌ Sorry, there was an error submitting your application. Please try again or contact our admission office directly at admissions@technova.edu.in',
            'error'
        );
    }

    showFormMessage(message, type) {
        const messageDiv = document.getElementById('formMessage');
        if (!messageDiv) return;

        messageDiv.innerHTML = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 7000);
    }

    resetForm() {
        if (this.leadForm) {
            this.leadForm.reset();
        }
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
    new TechNovaUniversity();
});

// Global functions for HTML onclick attributes
function openModal() {
    const app = new TechNovaUniversity();
    app.openModal();
}

function closeModal() {
    const app = new TechNovaUniversity();
    app.closeModal();
}

function openFeeModal() {
    const app = new TechNovaUniversity();
    app.openFeeModal();
}

function closeFeeModal() {
    const app = new TechNovaUniversity();
    app.closeFeeModal();
}
