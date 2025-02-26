document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.querySelector('.calendar-grid');
    const timeSlots = document.querySelector('.time-slots');
    const prevMonthBtn = document.querySelector('.nav-btn:first-child');
    const nextMonthBtn = document.querySelector('.nav-btn:last-child');
    const monthDisplay = document.querySelector('.calendar-header h2');
    const durationBtns = document.querySelectorAll('.duration-btn');

    let currentDate = new Date(2025, 1, 25); // February 25, 2025
    let selectedDate = currentDate;

    // Duration button handlers
    durationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            durationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            generateTimeSlots(selectedDate);
        });
    });

    // Navigation button handlers
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    function renderCalendar() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startingDay = firstDay.getDay() || 7; // Convert Sunday (0) to 7
    
        monthDisplay.textContent = firstDay.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });
    
        // Clear existing calendar dates
        const existingDates = calendar.querySelectorAll('.calendar-date');
        existingDates.forEach(date => date.remove());
    
        // Add empty cells for days before the first day of the month
        for (let i = 1; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date';
            calendar.appendChild(emptyCell);
        }
    
        // Add calendar dates
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            dateCell.textContent = day;
    
            const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            // To implement new available dates:
            // 1. Add your date conditions here using the currentDateObj
            // 2. Use the following classes to style the dates:
            //    - 'past-available': for past dates that were available
            //    - 'available': for currently available dates
            //    - 'unavailable': for dates that cannot be selected
            // Example implementation for February 24th and 25th, 2025:
            if (currentDateObj.getFullYear() === 2025 && currentDateObj.getMonth() === 1) {
                if (currentDateObj.getDate() === 24) {
                    dateCell.classList.add('past-available');
                } else if (currentDateObj.getDate() === 25) {
                    dateCell.classList.add('available');
                    if (currentDateObj.toDateString() === selectedDate.toDateString()) {
                        dateCell.classList.add('active');
                    }
                    dateCell.addEventListener('click', () => {
                        document.querySelectorAll('.calendar-date').forEach(d => d.classList.remove('active'));
                        dateCell.classList.add('active');
                        selectedDate = currentDateObj;
                        generateTimeSlots(selectedDate);
                    });
                } else {
                    dateCell.classList.add('unavailable');
                }
            } else {
                dateCell.classList.add('unavailable');
            }
    
            calendar.appendChild(dateCell);
        }
    }

    function generateTimeSlots(date) {
        const duration = document.querySelector('.duration-btn.active').textContent;
        const interval = parseInt(duration.split(' ')[0]); // Extract the number directly from duration text
        timeSlots.innerHTML = '';
    
        // Generate time slots from 10:00 AM to 6:00 PM
        const startTime = new Date(date);
        startTime.setHours(10, 0, 0);
        const endTime = new Date(date);
        endTime.setHours(18, 0, 0);
    
        while (startTime < endTime) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
    
            timeSlot.addEventListener('click', () => {
                // Remove existing confirm buttons
                document.querySelectorAll('.confirm-btn').forEach(btn => btn.remove());
                
                // Reset background of all time slots
                document.querySelectorAll('.time-slot').forEach(slot => {
                    slot.style.background = '#f8f9fa';
                });
                
                // Style selected time slot
                timeSlot.style.background = '#e9ecef';
                
                // Create and add confirm button
                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'confirm-btn';
                confirmBtn.textContent = 'Confirm';
                confirmBtn.addEventListener('click', () => {
                    const selectedTime = timeSlot.textContent;
                    const duration = document.querySelector('.duration-btn.active').textContent;
                    const selectedLanguage = document.getElementById('language').value;
                    const params = new URLSearchParams({
                        date: selectedDate.toISOString().split('T')[0],
                        time: selectedTime,
                        duration: duration,
                        language: selectedLanguage
                    });
                    window.location.href = `confirmation.html?${params.toString()}`;
                });
                timeSlot.appendChild(confirmBtn);
            });
    
            timeSlots.appendChild(timeSlot);
            startTime.setMinutes(startTime.getMinutes() + interval);
        }
    }

    // Initial render
    renderCalendar();
    generateTimeSlots(currentDate);
});