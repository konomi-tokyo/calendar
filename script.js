let currentYear = 2025;
let currentMonth = 0; 

const daysInWeek = ["日", "月", "火", "水", "木", "金", "土"];
const calendar = document.getElementById("calendar");
const calendarTitle = document.getElementById("calendar-title");
const modal = document.getElementById("event-modal");
const eventDateInput = document.getElementById("event-date");
const eventDetailsInput = document.getElementById("event-details");
const saveEventButton = document.getElementById("save-event");
const closeModalButton = document.getElementById("close-modal");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const yearSelect = document.getElementById("year-select");
const monthSelect = document.getElementById("month-select");

let events = loadEventsFromLocalStorage(); 

const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth();
const todayDate = today.getDate();

const holidays = {
  "2025-1-1": "元日",
  "2025-1-13": "成人の日",
  "2025-2-11": "建国記念の日",
  "2025-2-23": "天皇誕生日",
  "2025-2-24": "振替休日",
  "2025-3-20": "春分の日",
  "2025-4-29": "昭和の日",
  "2025-5-3": "憲法記念日",
  "2025-5-4": "みどりの日",
  "2025-5-5": "こどもの日",
  "2025-5-6": "振替休日",
  "2025-7-21": "海の日",
  "2025-8-11": "山の日",
  "2025-9-15": "敬老の日",
  "2025-9-23": "秋分の日",
  "2025-10-13": "スポーツの日",
  "2025-11-3": "文化の日",
  "2025-11-23": "勤労感謝の日",
  "2025-11-24": "振替休日"
};

function initYearMonthSelectors() {
    for (let year = 2025; year <= 2035; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = `${year}年`;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }


    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    monthNames.forEach((monthName, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = monthName;
        if (index === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    });

    yearSelect.addEventListener("change", () => {
        currentYear = parseInt(yearSelect.value);
        generateCalendar(currentYear, currentMonth);
    });

    monthSelect.addEventListener("change", () => {
        currentMonth = parseInt(monthSelect.value);
        generateCalendar(currentYear, currentMonth);
    });
}

function generateCalendar(year, month) {
    calendar.innerHTML = "";

    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    calendarTitle.textContent = `${year}年${monthNames[month]}`;

    daysInWeek.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "day-header";
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "day";
        calendar.appendChild(emptyCell);
    }

    for (let date = 1; date <= lastDate; date++) {
        const dayCell = document.createElement("div");
        dayCell.className = "day";
        dayCell.textContent = date;

        const fullDate = `${year}-${month + 1}-${date}`;

        if (year === todayYear && month === todayMonth && date === todayDate) {
            dayCell.classList.add("today");
        }

        if (holidays[fullDate]) {
            const holidayDiv = document.createElement("div");
            holidayDiv.className = "holiday";
            holidayDiv.textContent = holidays[fullDate];
            dayCell.appendChild(holidayDiv);
            dayCell.classList.add("holiday-cell"); 
        }

        if (events[fullDate]) {
            const eventDiv = document.createElement("div");
            eventDiv.className = "event";
            eventDiv.textContent = events[fullDate];
            dayCell.appendChild(eventDiv);
        }

        dayCell.addEventListener("click", () => openModal(date));

        calendar.appendChild(dayCell);
    }
}

function openModal(date) {
    modal.classList.remove("hidden");
    eventDateInput.value = `${currentYear}-${currentMonth + 1}-${date}`;
    eventDetailsInput.value = events[eventDateInput.value] || "";
}

function closeModal() {
    modal.classList.add("hidden");
    eventDetailsInput.value = "";
}

function saveEvent() {
    const date = eventDateInput.value;
    const details = eventDetailsInput.value;

    if (details.trim()) {
        events[date] = details;
    } else {
        delete events[date];
    }

    saveEventsToLocalStorage(); 
    closeModal();
    generateCalendar(currentYear, currentMonth);
}

function loadEventsFromLocalStorage() {
    const storedEvents = localStorage.getItem("calendarEvents");
    return storedEvents ? JSON.parse(storedEvents) : {};
}

function saveEventsToLocalStorage() {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
}

function changeMonth(offset) {
    currentMonth += offset;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    generateCalendar(currentYear, currentMonth);
}

saveEventButton.addEventListener("click", saveEvent);
closeModalButton.addEventListener("click", closeModal);
prevMonthButton.addEventListener("click", () => changeMonth(-1));
nextMonthButton.addEventListener("click", () => changeMonth(1));

initYearMonthSelectors();
generateCalendar(currentYear, currentMonth);
