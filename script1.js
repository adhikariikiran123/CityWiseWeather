document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    getStartedBtn.addEventListener('click', function() {
        // Show alert before redirecting
        alert('Redirecting to weather details page...');
        
        // Redirect to weather.html page
        window.location.href = 'weather.html';
    });
});