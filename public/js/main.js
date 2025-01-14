// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const professionals = document.querySelectorAll('#professionals .card');
            
            professionals.forEach(card => {
                const businessName = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-text').textContent.toLowerCase();
                const services = Array.from(card.querySelectorAll('.service-item span')).map(s => s.textContent.toLowerCase());
                
                const matches = businessName.includes(searchTerm) || 
                              description.includes(searchTerm) ||
                              services.some(s => s.includes(searchTerm));
                              
                card.closest('.col-md-4').style.display = matches ? 'block' : 'none';
            });
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
