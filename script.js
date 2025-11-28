let currentDate = new Date();
let selectedStartDate = null;
let selectedEndDate = null;
let existingBookings = []; // 기존 예약 목록

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

// localStorage에서 예약 데이터 불러오기
function loadBookings() {
    const saved = localStorage.getItem('bookings');
    if (saved) {
        existingBookings = JSON.parse(saved).map(booking => ({
            ...booking,
            start: new Date(booking.start),
            end: new Date(booking.end)
        }));
    }
}

// localStorage에 예약 데이터 저장
function saveBookings() {
    localStorage.setItem('bookings', JSON.stringify(existingBookings));
}

function initCalendar() {
    updateCalendar();
}

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('currentMonth').textContent = 
        `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    // 요일 헤더
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // 이전 달의 마지막 날들
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const dayElement = createDayElement(year, month - 1, day, true);
        calendarGrid.appendChild(dayElement);
    }

    // 현재 달의 날들
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isPast = date < today;
        const dayElement = createDayElement(year, month, day, false, isPast);
        calendarGrid.appendChild(dayElement);
    }

    // 다음 달의 첫 날들 (달력을 채우기 위해)
    const totalCells = calendarGrid.children.length - 7; // 헤더 제외
    const remainingCells = 42 - totalCells; // 6주 * 7일 = 42
    for (let day = 1; day <= remainingCells && day <= 14; day++) {
        const dayElement = createDayElement(year, month + 1, day, true);
        calendarGrid.appendChild(dayElement);
    }
}

function createDayElement(year, month, day, isOtherMonth, isPast = false) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;

    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);

    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    } else if (isPast) {
        dayElement.classList.add('past');
    } else {
        // 예약된 날짜 체크
        if (isBooked(date)) {
            dayElement.classList.add('booked');
            dayElement.title = '예약 불가';
            // 클릭 이벤트를 추가하지 않음
        } else {
            dayElement.onclick = () => selectDate(date);
            
            // 선택된 날짜 범위 표시
            if (selectedStartDate && selectedEndDate) {
                if (date >= selectedStartDate && date <= selectedEndDate) {
                    dayElement.classList.add('range');
                    if (date.getTime() === selectedStartDate.getTime() || 
                        date.getTime() === selectedEndDate.getTime()) {
                        dayElement.classList.add('selected');
                    }
                }
            } else if (selectedStartDate && date.getTime() === selectedStartDate.getTime()) {
                dayElement.classList.add('selected');
            }
        }
    }

    return dayElement;
}

function isBooked(date) {
    return existingBookings.some(booking => {
        const start = new Date(booking.start);
        const end = new Date(booking.end);
        return date >= start && date <= end;
    });
}

function selectDate(date) {
    // 예약된 날짜는 선택 불가
    if (isBooked(date)) {
        alert('이미 예약된 날짜입니다.');
        return;
    }

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // 새로 선택
        selectedStartDate = new Date(date);
        selectedEndDate = null;
    } else {
        // 종료 날짜 선택
        if (date < selectedStartDate) {
            // 시작 날짜보다 이전이면 시작 날짜로 변경
            selectedEndDate = new Date(selectedStartDate);
            selectedStartDate = new Date(date);
        } else {
            selectedEndDate = new Date(date);
        }

        // 예약된 날짜가 범위에 포함되는지 체크
        let hasBooking = false;
        for (let d = new Date(selectedStartDate); d <= selectedEndDate; d.setDate(d.getDate() + 1)) {
            if (isBooked(new Date(d))) {
                hasBooking = true;
                break;
            }
        }

        if (hasBooking) {
            alert('선택한 기간에 예약된 날짜가 포함되어 있습니다.');
            selectedStartDate = null;
            selectedEndDate = null;
        }
    }

    updateCalendar();
    updateSelectedDatesDisplay();
}

function updateSelectedDatesDisplay() {
    if (selectedStartDate) {
        document.getElementById('selectedDatesSection').classList.remove('hidden');
        
        if (selectedEndDate) {
            const nights = Math.ceil((selectedEndDate - selectedStartDate) / (1000 * 60 * 60 * 24));
            document.getElementById('selectedDatesText').textContent = 
                `${formatDate(selectedStartDate)} ~ ${formatDate(selectedEndDate)} (${nights}박)`;
            document.getElementById('bookingFormSection').classList.remove('hidden');
        } else {
            document.getElementById('selectedDatesText').textContent = 
                `${formatDate(selectedStartDate)} (체크아웃 날짜를 선택해주세요)`;
            document.getElementById('bookingFormSection').classList.add('hidden');
        }
    } else {
        document.getElementById('selectedDatesSection').classList.add('hidden');
        document.getElementById('bookingFormSection').classList.add('hidden');
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayName = dayNames[date.getDay()];
    return `${year}.${month}.${day} (${dayName})`;
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendar();
}

function submitBooking() {
    const guestName = document.getElementById('guestName').value;
    const guestPhone = document.getElementById('guestPhone').value;
    const guestEmail = document.getElementById('guestEmail').value;

    if (!guestName || !guestPhone) {
        alert('이름과 연락처는 필수 입력 항목입니다.');
        return;
    }

    if (!selectedStartDate || !selectedEndDate) {
        alert('체크인과 체크아웃 날짜를 모두 선택해주세요.');
        return;
    }

    // 예약 번호 생성
    const bookingNumber = 'BK' + Date.now().toString().slice(-8);

    // 예약 완료 메시지 표시
    document.getElementById('bookingNumber').textContent = bookingNumber;
    document.getElementById('successMessage').classList.remove('hidden');
    document.getElementById('bookingFormSection').classList.add('hidden');
    document.getElementById('selectedDatesSection').classList.add('hidden');
    document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });

    // 실제로는 여기서 서버로 데이터를 전송합니다
    console.log('예약 정보:', {
        bookingNumber,
        checkin: selectedStartDate,
        checkout: selectedEndDate,
        guestName,
        guestPhone,
        guestEmail
    });

    // 예약 목록에 추가
    const booking = {
        bookingNumber,
        start: selectedStartDate,
        end: selectedEndDate,
        guestName,
        guestPhone,
        guestEmail,
        specialRequests: document.getElementById('specialRequests').value
    };
    
    existingBookings.push(booking);
    saveBookings(); // localStorage에 저장

    // 초기화
    selectedStartDate = null;
    selectedEndDate = null;
    document.getElementById('guestName').value = '';
    document.getElementById('guestPhone').value = '';
    document.getElementById('guestEmail').value = '';
    document.getElementById('specialRequests').value = '';
}

// 페이지 로드 시 달력 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadBookings(); // 예약 데이터 불러오기
    initCalendar();
});

